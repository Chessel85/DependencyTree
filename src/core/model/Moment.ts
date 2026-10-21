import { HistoricDate } from '../dates/HistoricDate';
import { Entry } from './Entry';

/** Something that happened at a single date (DES-DATA-001). */
export class Moment extends Entry {
  constructor(
    id: string,
    name: string,
    readonly date: HistoricDate,
    description: string,
    tags: readonly string[],
    readonly location?: string,
  ) {
    super(id, name, description, tags);
  }

  get sortKey(): number {
    return this.date.range().earliest;
  }
}
