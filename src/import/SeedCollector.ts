import { Curation } from './Curation';
import { EntryDates } from './EntryDates';
import { ImportedGraph } from './ImportedGraph';
import { PropertyMapper } from './PropertyMapper';
import { WikidataEntity } from './WikidataEntity';
import { WikidataSource } from './WikidataSource';

/** Rounds of looking for larger periods: enough for a period inside a period inside a period. */
const PERIOD_ROUNDS = 3;

/**
 * Gathers the seed set (DES-IMP-002). Starting from the root and the
 * curation file's seeds, it follows dependency links backwards, one step at
 * a time, until there are no more or it reaches the most entries allowed.
 * Then it adds the periods the gathered entries say they are part of.
 * Items without a usable date are noted and not walked through, and so are
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
      step = await this.readDependencies(graph, added);
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

  /** True if the item was reached through links, and certainly came after every entry those links came from. */
  private isTooLate(graph: ImportedGraph, entity: WikidataEntity): boolean {
    const dependents = graph.links
      .filter((l) => graph.canonical(l.dependency) === entity.id && graph.has(l.dependent))
      .map((l) => graph.entries.get(graph.canonical(l.dependent))!);
    const range = this.dates.range(entity)!;
    return dependents.length > 0 && dependents.every((d) => range.isCertainlyAfter(this.dates.range(d)!));
  }

  /** Records what the new items depend on, in both directions, and returns those items for the next step. */
  private async readDependencies(graph: ImportedGraph, added: readonly WikidataEntity[]): Promise<string[]> {
    const next: string[] = [];
    for (const entity of added) {
      for (const link of this.mapper.dependencies(entity, graph.isPeriod(entity.id))) {
        graph.links.push({ dependent: entity.id, dependency: link.target, source: link.property });
        next.push(link.target);
      }
    }
    const ids = added.map((e) => e.id);
    for (const property of PropertyMapper.ENABLED) {
      for (const link of ids.length > 0 ? await this.source.linksTo(property, ids) : []) {
        graph.links.push({ dependent: link.target, dependency: link.subject, source: property });
        next.push(link.subject);
      }
    }
    return next;
  }

  /** Adds the periods that gathered entries are part of, and reads which gathered entries each period lists. */
  private async addPeriods(graph: ImportedGraph): Promise<void> {
    let newcomers = [...graph.entries.values()];
    for (let round = 0; round < PERIOD_ROUNDS && newcomers.length > 0; round++) {
      const larger: string[] = [];
      for (const entity of newcomers) {
        for (const period of this.mapper.partOf(entity)) {
          graph.memberships.push({ period, member: entity.id, source: PropertyMapper.PART_OF });
          larger.push(period);
        }
        if (graph.isPeriod(entity.id)) {
          for (const member of this.mapper.members(entity)) {
            graph.memberships.push({ period: entity.id, member: member.target, source: member.property });
          }
        }
      }
      const candidates = [...new Set(larger)].filter((id) => !this.seen.has(id));
      const fetched = await this.source.entities(candidates);
      const periods = candidates.filter((id) => {
        const entity = fetched.get(id);
        return entity !== undefined && this.dates.isPeriod(entity);
      });
      newcomers = await this.gather(graph, periods);
    }
  }
}
