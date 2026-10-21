import { HistoricDate } from '../dates/HistoricDate';

/** Something that happened at a single date (DES-DATA-001). */
export class Moment {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly date: HistoricDate,
    readonly description: string,
    readonly tags: readonly string[],
    readonly location?: string,
  ) {}

  /** Orders moments by date, oldest first, then by name (DES-NAV-006). */
  static byDate(a: Moment, b: Moment): number {
    return a.date.range().earliest - b.date.range().earliest || a.name.localeCompare(b.name);
  }
}
