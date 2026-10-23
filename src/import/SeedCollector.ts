import { Curation } from './Curation';
import { EntryDates } from './EntryDates';
import { ImportedGraph } from './ImportedGraph';
import { PropertyMapper } from './PropertyMapper';
import { WikidataEntity } from './WikidataEntity';
import { WikidataSource } from './WikidataSource';

/** Rounds of looking for larger periods: enough for a period inside a period inside a period. */
const PERIOD_ROUNDS = 3;

/**
 * Gathers the seed set (DES-IMP-002). Starting from the roots and the
 * curation file's seeds, it follows links of every kind backwards, one step at
 * a time, until there are no more or it reaches the most entries allowed.
 * Then it adds the periods the gathered entries say they are part of.
 * Items without an English name or a usable date are noted and not walked through, and so are
 * items that certainly came after every gathered entry that links to them,
 * since the walk goes backwards in time.
 */
export class SeedCollector {
  private readonly seen = new Set<string>();

  constructor(
    private readonly source: WikidataSource,
    private readonly mapper: PropertyMapper,
    private readonly dates: EntryDates,
    private readonly curation: Curation,
  ) {}

  async collect(): Promise<ImportedGraph> {
    const graph = new ImportedGraph();
    let step = this.curation.startingPoints;
    while (step.length > 0) {
      if (graph.size >= this.curation.maxEntries) {
        graph.stoppedAtLimit = true;
        break;
      }
      const added = await this.gather(graph, step);
      step = await this.readLinks(graph, added);
    }
    await this.addPeriods(graph);
    return graph;
  }

  /** Fetches the items not seen yet, and adds the dated ones while there is room. */
  private async gather(graph: ImportedGraph, ids: readonly string[]): Promise<WikidataEntity[]> {
    const fresh = [...new Set(ids)].filter((id) => !this.seen.has(id) && !this.curation.isExcluded(id));
    fresh.forEach((id) => this.seen.add(id));
    const fetched = await this.source.entities(fresh);
    const added: WikidataEntity[] = [];
    for (const id of fresh) {
      const entity = fetched.get(id);
      if (!entity) {
        continue;
      }
      if (entity.id !== id) {
        graph.alias(id, entity.id);
      }
      if (graph.has(entity.id) || this.curation.isExcluded(entity.id)) {
        continue;
      }
      if (!entity.label && !this.curation.entry(entity.id)?.name) {
        graph.unnamed.set(entity.id, entity);
        continue;
      }
      if (!this.dates.isDated(entity)) {
        graph.undated.set(entity.id, entity);
        continue;
      }
      if (this.isTooLate(graph, entity)) {
        graph.tooLate.set(entity.id, entity);
        continue;
      }
      if (graph.size >= this.curation.maxEntries) {
        graph.stoppedAtLimit = true;
        continue;
      }
      graph.add(entity, this.dates.isPeriod(entity));
      added.push(entity);
    }
    return added;
  }

  /**
   * True if the item was reached through links, and certainly came after
   * every entry those links came from. Items the curation file names are
   * always kept.
   */
  private isTooLate(graph: ImportedGraph, entity: WikidataEntity): boolean {
    if (this.curation.startingPoints.includes(entity.id)) {
      return false;
    }
    const dependents = graph.links
      .filter((l) => graph.canonical(l.earlier) === entity.id && graph.has(l.later))
      .map((l) => graph.entries.get(graph.canonical(l.later))!);
    const range = this.dates.range(entity)!;
    return dependents.length > 0 && dependents.every((d) => range.isCertainlyAfter(this.dates.range(d)!));
  }

  /**
   * Records what the new items depend on, were caused by or were influenced
   * by, read from their own statements and backwards from other items'
   * statements, and returns those earlier items for the next step.
   */
  private async readLinks(graph: ImportedGraph, added: readonly WikidataEntity[]): Promise<string[]> {
    const next: string[] = [];
    for (const entity of added) {
      for (const link of this.mapper.earlierLinks(entity, graph.isPeriod(entity.id))) {
        const { target, property, ...meaning } = link;
        graph.links.push({ later: entity.id, earlier: target, source: property, ...meaning });
        next.push(link.target);
      }
    }
    const ids = added.map((e) => e.id);
    for (const [property, meaning] of Object.entries(PropertyMapper.LATER)) {
      for (const link of ids.length > 0 ? await this.source.linksTo(property, ids) : []) {
        graph.links.push({ later: link.target, earlier: link.subject, source: property, ...meaning });
        next.push(link.subject);
      }
    }
    return next;
  }

  /**
   * Adds the periods that gathered entries are part of, and reads which
   * gathered entries each period lists. For each period, it also adds the
   * moments among its events and parts that fall on its start or end date,
   * since those are the real moments it starts and ends with (DES-IMP-008).
   */
  private async addPeriods(graph: ImportedGraph): Promise<void> {
    let newcomers = [...graph.entries.values()];
    for (let round = 0; round < PERIOD_ROUNDS && newcomers.length > 0; round++) {
      const larger: string[] = [];
      const events: [WikidataEntity, string][] = [];
      for (const entity of newcomers) {
        for (const period of this.mapper.partOf(entity)) {
          graph.memberships.push({ period, member: entity.id, source: PropertyMapper.PART_OF });
          larger.push(period);
        }
        if (graph.isPeriod(entity.id)) {
          for (const member of this.mapper.members(entity)) {
            graph.memberships.push({ period: entity.id, member: member.target, source: member.property });
            events.push([entity, member.target]);
          }
        }
      }
      const candidates = [...new Set([...larger, ...events.map(([, id]) => id)])].filter((id) => !this.seen.has(id));
      const fetched = await this.source.entities(candidates);
      const periods = [...new Set(larger)].filter((id) => {
        const entity = fetched.get(id);
        return entity !== undefined && this.dates.isPeriod(entity);
      });
      const boundaries = events
        .filter(([period, id]) => {
          const event = fetched.get(id);
          return event !== undefined && !this.dates.isPeriod(event) && this.dates.isDated(event) && this.isAtBoundary(period, event);
        })
        .map(([, id]) => id);
      newcomers = await this.gather(graph, [...periods, ...boundaries]);
    }
  }

  /** True if the event could have happened on the period's start date, or on its end date. */
  private isAtBoundary(period: WikidataEntity, event: WikidataEntity): boolean {
    const start = this.dates.range(period);
    const end = this.dates.endRange(period);
    const eventStart = this.dates.range(event)!;
    const eventEnd = this.dates.endRange(event) ?? eventStart;
    return (start !== undefined && EntryDates.overlap(start, eventStart)) || (end !== undefined && EntryDates.overlap(end, eventEnd));
  }
}
