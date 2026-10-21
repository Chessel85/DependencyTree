import { Entry } from './Entry';
import { Moment } from './Moment';

/**
 * Something that lasted for a time, defined by a start moment and an end
 * moment, with any number of moments and smaller periods between them
 * (DES-DATA-001, DES-DATA-003). A period still going on has no end moment
 * (DES-DATA-002).
 */
export class Period extends Entry {
  constructor(
    id: string,
    name: string,
    description: string,
    tags: readonly string[],
    readonly start: Moment,
    readonly end: Moment | undefined,
    readonly members: readonly Entry[],
  ) {
    super(id, name, description, tags);
  }

  get sortKey(): number {
    return this.start.sortKey;
  }

  get isOngoing(): boolean {
    return this.end === undefined;
  }

  /** The start moment, the moments and smaller periods between in date order, then the end moment. */
  get stops(): Entry[] {
    const between = [...this.members].sort(Entry.byDate);
    return this.end ? [this.start, ...between, this.end] : [this.start, ...between];
  }

  /** Whether this entry is the start, the end, or one of the members. */
  includes(entry: Entry): boolean {
    return entry === this.start || entry === this.end || this.members.includes(entry);
  }
}
