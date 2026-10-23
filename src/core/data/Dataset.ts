import { LinkGraph } from '../graph/LinkGraph';
import { Entry } from '../model/Entry';
import { Period } from '../model/Period';

/** Every entry in the data: the moments with the links between them, and the periods with what they contain. */
export class Dataset {
  private readonly periodsById = new Map<string, Period>();

  constructor(
    readonly graph: LinkGraph,
    readonly periods: readonly Period[],
  ) {
    for (const period of periods) {
      if (graph.find(period.id) || this.periodsById.has(period.id)) {
        throw new Error(`Two entries have the id "${period.id}".`);
      }
      this.periodsById.set(period.id, period);
    }
  }

  find(id: string): Entry | undefined {
    return this.graph.find(id) ?? this.periodsById.get(id);
  }

  /** The periods this entry is part of, oldest first (DES-NAV-002). */
  partOf(entry: Entry): Period[] {
    return this.periods.filter((p) => p.includes(entry)).sort(Entry.byDate);
  }
}
