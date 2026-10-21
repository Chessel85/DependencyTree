/** Anything the user can be shown in the tree: a moment, a period, or a marker within a period. */
export abstract class Entry {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly tags: readonly string[],
  ) {}

  /** The earliest time this entry could have begun, in fractional astronomical years, for sorting. */
  abstract get sortKey(): number;

  /** Whether the user can go to this entry. */
  get isVisitable(): boolean {
    return true;
  }

  /** Orders entries by date, oldest first, then by name (DES-NAV-006). */
  static byDate(a: Entry, b: Entry): number {
    return a.sortKey - b.sortKey || a.name.localeCompare(b.name);
  }
}
