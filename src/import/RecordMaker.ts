import { DatasetRecord, LinkRecord, MomentRecord, PeriodRecord } from '../core/data/DatasetReader';
import { LinkKind } from '../core/model/LinkKind';
import { Curation } from './Curation';
import { EntryDates } from './EntryDates';
import { ImportedGraph, ImportedLink } from './ImportedGraph';
import { ImportLog, PeriodEnd } from './ImportLog';
import { LabelLookup } from './LabelLookup';
import { PeriodAnchors } from './PeriodAnchors';
import { PropertyMapper } from './PropertyMapper';
import { WikidataEntity } from './WikidataEntity';

/**
 * Turns the gathered items into a dataset. Each period starts and ends with
 * real moments (DES-IMP-008), and one without them becomes a moment. A link
 * on or from a whole period is moved to one of its moments, and noted
 * (DES-REL-007). Links to items outside the seed set are left out, and two
 * items are joined by one link at most.
 */
export class RecordMaker {
  private readonly ids = new Map<string, string>();
  private readonly names = new Map<string, string>();
  private anchors!: PeriodAnchors;

  constructor(
    private readonly curation: Curation,
    private readonly mapper: PropertyMapper,
    private readonly dates: EntryDates,
    private readonly labels: LabelLookup,
    private readonly log: ImportLog,
  ) {}

  /** The items whose labels the dataset needs, to load before making it. */
  mentionedItems(graph: ImportedGraph): string[] {
    return [...graph.entries.values()].flatMap((e) => {
      const location = this.mapper.location(e);
      return location ? [...this.mapper.tags(e), location] : this.mapper.tags(e);
    });
  }

  make(graph: ImportedGraph): DatasetRecord {
    this.anchors = new PeriodAnchors(graph, this.dates, this.curation);
    this.nameEntries(graph);
    const moments = new Map<string, MomentRecord>();
    const periods = new Map<string, PeriodRecord>();
    for (const entity of graph.entries.values()) {
      if (this.anchors.isPeriod(entity.id)) {
        periods.set(entity.id, this.period(entity));
      } else {
        moments.set(entity.id, this.moment(entity, graph.isPeriod(entity.id)));
      }
    }
    for (const [id, missing] of this.anchors.missing) {
      this.log.notPeriods.push({ name: this.names.get(id)!, missing });
    }
    this.addLinks(graph, moments);
    this.addMembers(graph, periods);
    return {
      start: this.ids.get(graph.canonical(this.curation.roots[0])),
      moments: [...moments.values()],
      periods: [...periods.values()],
    };
  }

  /** Gives each entry a name, and an address-friendly ID made from it that no other entry has (DES-DATA-005). */
  private nameEntries(graph: ImportedGraph): void {
    const taken = new Set<string>();
    for (const entity of graph.entries.values()) {
      const curated = this.curation.entry(entity.id);
      const name = curated?.name ?? RecordMaker.capitalised(entity.label ?? entity.id);
      let id = curated?.id ?? RecordMaker.slug(name, entity.id);
      if (taken.has(id)) {
        id = `${id}-${entity.id.toLowerCase()}`;
      }
      taken.add(id);
      this.ids.set(entity.id, id);
      this.names.set(entity.id, name);
    }
  }

  /** A moment, or an item Wikidata gives as a period that has no real start or end moment, dated by its start. */
  private moment(entity: WikidataEntity, fromPeriod: boolean): MomentRecord {
    const record: MomentRecord = {
      id: this.ids.get(entity.id)!,
      name: this.names.get(entity.id)!,
      date: (fromPeriod ? this.dates.start(entity) : this.dates.momentDate(entity))!.date,
      description: this.description(entity),
      tags: this.tags(entity),
      wikidata: entity.id,
    };
    if (this.curation.entry(entity.id)?.idea ?? this.mapper.isIdea(entity)) {
      record.idea = true;
    }
    const location = this.mapper.location(entity);
    const place = location && this.labels.label(location);
    if (place) {
      record.location = place;
    }
    return record;
  }

  private period(entity: WikidataEntity): PeriodRecord {
    const anchors = this.anchors.of(entity.id)!;
    return {
      id: this.ids.get(entity.id)!,
      name: this.names.get(entity.id)!,
      description: this.description(entity),
      tags: this.tags(entity),
      start: this.ids.get(anchors.start)!,
      ...(anchors.end ? { end: this.ids.get(anchors.end)! } : {}),
      contains: [],
      wikidata: entity.id,
    };
  }

  private addLinks(graph: ImportedGraph, moments: Map<string, MomentRecord>): void {
    for (const link of graph.links) {
      const later = graph.canonical(link.later);
      const earlier = graph.canonical(link.earlier);
      if (!graph.has(later) || !graph.has(earlier)) {
        continue;
      }
      const from = this.anchors.isPeriod(later) ? this.anchors.of(later)!.start : later;
      const to = this.earlierMoment(graph, earlier, link, from);
      if (from === to) {
        continue;
      }
      const ends: PeriodEnd[] = [];
      if (this.anchors.isPeriod(later)) {
        ends.push({ period: this.names.get(later)!, end: 'start' });
      }
      if (this.anchors.isPeriod(earlier)) {
        ends.push({ period: this.names.get(earlier)!, end: to === this.anchors.of(earlier)!.start ? 'start' : 'end' });
      }
      if (ends.length > 0) {
        this.log.moved.push({ later: this.names.get(later)!, earlier: this.names.get(earlier)!, kind: link.kind, source: link.source, ends });
      }
      const record = moments.get(from)!;
      this.addLink((record.links ??= []), this.ids.get(to)!, link);
    }
  }

  /** Adds the link, or fills in the strength and note of one already joining the same two moments. */
  private addLink(links: LinkRecord[], to: string, link: ImportedLink): void {
    const existing = links.find((l) => l.to === to);
    if (!existing) {
      links.push({
        to,
        kind: link.kind,
        ...(link.strength ? { strength: link.strength } : {}),
        ...(link.note ? { note: link.note } : {}),
        source: link.source,
      });
      return;
    }
    if (link.kind === existing.kind && link.strength && !existing.strength) {
      existing.strength = link.strength;
    }
    if (link.note && !existing.note) {
      existing.note = link.note;
    }
  }

  /**
   * The moment that stands for the earlier end of a link (DES-REL-007): the
   * entry itself, or one end of a period. A cause stands for the period's end
   * moment, unless that came after the later moment; anything else for its
   * start moment. The curation file can choose instead.
   */
  private earlierMoment(graph: ImportedGraph, id: string, link: ImportedLink, laterMoment: string): string {
    if (!this.anchors.isPeriod(id)) {
      return id;
    }
    const { start, end } = this.anchors.of(id)!;
    if (!end || (link.at ?? (link.kind === LinkKind.CausedBy ? 'end' : 'start')) === 'start') {
      return start;
    }
    const endRange = this.dates.range(graph.entries.get(end)!)!;
    const laterRange = this.dates.range(graph.entries.get(laterMoment)!)!;
    return link.at === 'end' || !endRange.isCertainlyAfter(laterRange) ? end : start;
  }

  private addMembers(graph: ImportedGraph, periods: Map<string, PeriodRecord>): void {
    for (const membership of graph.memberships) {
      const period = periods.get(graph.canonical(membership.period));
      const member = graph.canonical(membership.member);
      if (!period || !graph.has(member)) {
        continue;
      }
      const memberId = this.ids.get(member)!;
      const isStop = memberId === period.id || memberId === period.start || memberId === period.end;
      if (!isStop && !period.contains!.includes(memberId)) {
        period.contains!.push(memberId);
      }
    }
  }

  private description(entity: WikidataEntity): string {
    const curated = this.curation.entry(entity.id)?.description;
    if (curated) {
      return curated;
    }
    const text = entity.description;
    return text ? `${RecordMaker.capitalised(text)}${/[.!?]$/.test(text) ? '' : '.'}` : '';
  }

  private tags(entity: WikidataEntity): string[] {
    return this.mapper
      .tags(entity)
      .map((id) => this.labels.label(id))
      .filter((label): label is string => label !== undefined);
  }

  /** Capitalises the first letter, except in names such as "iPhone" that start with a small letter on purpose. */
  private static capitalised(text: string): string {
    return /^[a-z][A-Z]/.test(text) ? text : text.charAt(0).toUpperCase() + text.slice(1);
  }

  private static slug(name: string, fallback: string): string {
    const slug = name
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return slug || fallback.toLowerCase();
  }
}
