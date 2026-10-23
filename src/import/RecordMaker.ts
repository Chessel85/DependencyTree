import { DatasetRecord, MomentRecord, PeriodRecord } from '../core/data/DatasetReader';
import { Curation } from './Curation';
import { EntryDates } from './EntryDates';
import { ImportedGraph } from './ImportedGraph';
import { ImportLog } from './ImportLog';
import { LabelLookup } from './LabelLookup';
import { PropertyMapper } from './PropertyMapper';
import { WikidataEntity } from './WikidataEntity';

/**
 * Turns the gathered items into a dataset. Each period gets a start moment
 * and, unless it is still going on, an end moment (DES-IMP-008). A
 * dependency on or from a whole period is moved to its start moment, and
 * noted (DES-REL-007). Links to items outside the seed set are left out.
 */
export class RecordMaker {
  private readonly ids = new Map<string, string>();
  private readonly names = new Map<string, string>();
  private readonly startIds = new Map<string, string>();

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
    this.nameEntries(graph);
    const moments = new Map<string, MomentRecord>();
    const periods = new Map<string, PeriodRecord>();
    for (const entity of graph.entries.values()) {
      if (graph.isPeriod(entity.id)) {
        this.addPeriod(entity, moments, periods);
      } else {
        moments.set(entity.id, this.moment(entity));
      }
    }
    this.addLinks(graph, moments);
    this.addMembers(graph, periods);
    return {
      start: this.ids.get(graph.canonical(this.curation.root)),
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
      if (taken.has(id) || (graph.isPeriod(entity.id) && taken.has(`start-of-${id}`))) {
        id = `${id}-${entity.id.toLowerCase()}`;
      }
      taken.add(id);
      if (graph.isPeriod(entity.id)) {
        taken.add(`start-of-${id}`).add(`end-of-${id}`);
        this.startIds.set(entity.id, `start-of-${id}`);
      }
      this.ids.set(entity.id, id);
      this.names.set(entity.id, name);
    }
  }

  private moment(entity: WikidataEntity): MomentRecord {
    const record: MomentRecord = {
      id: this.ids.get(entity.id)!,
      name: this.names.get(entity.id)!,
      date: this.dates.momentDate(entity)!.date,
      description: this.description(entity),
      tags: this.tags(entity),
      wikidata: entity.id,
    };
    const location = this.mapper.location(entity);
    const place = location && this.labels.label(location);
    if (place) {
      record.location = place;
    }
    return record;
  }

  private addPeriod(entity: WikidataEntity, moments: Map<string, MomentRecord>, periods: Map<string, PeriodRecord>): void {
    const id = this.ids.get(entity.id)!;
    const inner = this.curation.entry(entity.id)?.name ?? entity.label ?? this.names.get(entity.id)!;
    const tags = this.tags(entity);
    const start = this.dates.start(entity)!;
    const end = this.dates.end(entity);
    moments.set(`start:${entity.id}`, {
      id: `start-of-${id}`,
      name: `Start of the ${inner}`,
      date: start.date,
      description: `The start of the ${inner}.`,
      tags,
    });
    if (end) {
      moments.set(`end:${entity.id}`, {
        id: `end-of-${id}`,
        name: `End of the ${inner}`,
        date: end.date,
        description: `The end of the ${inner}.`,
        tags,
      });
    }
    periods.set(entity.id, {
      id,
      name: this.names.get(entity.id)!,
      description: this.description(entity),
      tags,
      start: `start-of-${id}`,
      ...(end ? { end: `end-of-${id}` } : {}),
      contains: [],
      wikidata: entity.id,
    });
  }

  private addLinks(graph: ImportedGraph, moments: Map<string, MomentRecord>): void {
    const byId = new Map([...moments.values()].map((m) => [m.id, m]));
    for (const link of graph.links) {
      const dependent = graph.canonical(link.dependent);
      const dependency = graph.canonical(link.dependency);
      if (!graph.has(dependent) || !graph.has(dependency)) {
        continue;
      }
      const from = this.momentId(graph, dependent);
      const to = this.momentId(graph, dependency);
      if (from === to) {
        continue;
      }
      const periods = [dependent, dependency].filter((id) => graph.isPeriod(id));
      if (periods.length > 0) {
        this.log.moved.push({
          dependent: this.names.get(dependent)!,
          dependency: this.names.get(dependency)!,
          source: link.source,
          periods: periods.map((id) => this.names.get(id)!),
        });
      }
      const record = byId.get(from)!;
      record.dependsOn ??= [];
      if (!record.dependsOn.includes(to)) {
        record.dependsOn.push(to);
        record.linkSources = { ...record.linkSources, [to]: link.source };
      }
    }
  }

  private addMembers(graph: ImportedGraph, periods: Map<string, PeriodRecord>): void {
    for (const membership of graph.memberships) {
      const period = periods.get(graph.canonical(membership.period));
      const member = graph.canonical(membership.member);
      if (!period || !graph.has(member)) {
        continue;
      }
      const memberId = this.ids.get(member)!;
      if (memberId !== period.id && !period.contains!.includes(memberId)) {
        period.contains!.push(memberId);
      }
    }
  }

  /** The moment that stands for an entry in a dependency: itself, or a period's start moment. */
  private momentId(graph: ImportedGraph, id: string): string {
    return graph.isPeriod(id) ? this.startIds.get(id)! : this.ids.get(id)!;
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
