import { DateRange } from '../core/dates/DateRange';
import { Curation } from './Curation';
import { EntryDates } from './EntryDates';
import { ImportedGraph } from './ImportedGraph';

/** The real moments a period starts and ends with, as Wikidata IDs. A period still going on has no end. */
export interface Anchors {
  start: string;
  end?: string;
}

/** Why an item couldn't be a period. */
export type MissingAnchor = 'start' | 'end' | 'start and end';

/**
 * Finds the real moments each period starts and ends with (DES-DATA-001,
 * DES-IMP-008). The start moment is the earliest of the period's members
 * that could have happened on its start date, and the end moment the latest
 * that could have happened on its end date. A member that is itself a period
 * offers its own start or end moment. The curation file can name them
 * instead. A period with no real start moment, or no real end moment when
 * it has an end date, is imported as a moment at its start date.
 */
export class PeriodAnchors {
  private readonly found = new Map<string, Anchors | undefined>();
  private readonly missingById = new Map<string, MissingAnchor>();
  private readonly visiting = new Set<string>();

  constructor(
    private readonly graph: ImportedGraph,
    private readonly dates: EntryDates,
    private readonly curation: Curation,
  ) {}

  /** The period's start and end moments, or undefined if it is imported as a moment instead. */
  of(id: string): Anchors | undefined {
    if (!this.found.has(id)) {
      this.found.set(id, this.resolve(id));
    }
    return this.found.get(id);
  }

  /** Whether the item is imported as a period: Wikidata or the curation file says so, and it has real start and end moments. */
  isPeriod(id: string): boolean {
    return this.graph.isPeriod(id) && this.of(id) !== undefined;
  }

  /** What was missing for each item that couldn't be a period. */
  get missing(): ReadonlyMap<string, MissingAnchor> {
    for (const id of this.graph.entries.keys()) {
      if (this.graph.isPeriod(id)) {
        this.of(id);
      }
    }
    return this.missingById;
  }

  private resolve(id: string): Anchors | undefined {
    if (this.visiting.has(id)) {
      return undefined;
    }
    this.visiting.add(id);
    const entity = this.graph.entries.get(id)!;
    const curated = this.curation.entry(id);
    const members = this.members(id);
    const startRange = this.dates.range(entity)!;
    const endRange = this.dates.endRange(entity);
    const hasEnd = endRange !== undefined || curated?.endMoment !== undefined;

    const start = curated?.startMoment
      ? this.firstMoment(this.graph.canonical(curated.startMoment))
      : this.pick(members.map((m) => this.firstMoment(m)), startRange, 'earliest');
    let end: string | undefined;
    if (hasEnd) {
      end = curated?.endMoment
        ? this.lastMoment(this.graph.canonical(curated.endMoment))
        : this.pick(members.map((m) => this.lastMoment(m)), endRange!, 'latest', start);
    }
    this.visiting.delete(id);

    if (!start || (hasEnd && !end)) {
      this.missingById.set(id, !start && hasEnd && !end ? 'start and end' : !start ? 'start' : 'end');
      return undefined;
    }
    return end ? { start, end } : { start };
  }

  /** The gathered entries the period lists as members, or that say they are part of it. */
  private members(id: string): string[] {
    const ids = this.graph.memberships
      .filter((m) => this.graph.canonical(m.period) === id)
      .map((m) => this.graph.canonical(m.member))
      .filter((m) => m !== id && this.graph.has(m));
    return [...new Set(ids)];
  }

  /** The moment an entry starts with: itself, or a period's start moment. */
  private firstMoment(id: string): string | undefined {
    if (!this.graph.has(id)) {
      return undefined;
    }
    return this.graph.isPeriod(id) ? (this.of(id)?.start ?? id) : id;
  }

  /** The moment an entry ends with: itself, or a period's end moment. */
  private lastMoment(id: string): string | undefined {
    if (!this.graph.has(id)) {
      return undefined;
    }
    if (!this.graph.isPeriod(id)) {
      return id;
    }
    const anchors = this.of(id);
    return anchors ? anchors.end : id;
  }

  /** The earliest or latest of the moments that could have happened at `range`. */
  private pick(moments: (string | undefined)[], range: DateRange, which: 'earliest' | 'latest', not?: string): string | undefined {
    const fitting = moments
      .filter((m): m is string => m !== undefined && m !== not)
      .map((m) => ({ id: m, range: this.momentRange(m) }))
      .filter((m) => EntryDates.overlap(m.range, range))
      .sort((a, b) => a.range.earliest - b.range.earliest);
    return (which === 'earliest' ? fitting[0] : fitting[fitting.length - 1])?.id;
  }

  /** A moment's date. A period imported as a moment uses its start date. */
  private momentRange(id: string): DateRange {
    return this.dates.range(this.graph.entries.get(id)!)!;
  }
}
