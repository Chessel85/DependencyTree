import { readFileSync } from 'node:fs';
import { DateRecord } from '../core/data/DatasetReader';

/** Corrections to one Wikidata item. Giving `date` makes it a moment, and giving `start` makes it a period. */
export interface CuratedEntry {
  id?: string;
  name?: string;
  description?: string;
  date?: DateRecord;
  start?: DateRecord;
  end?: DateRecord;
  note?: string;
}

/** A link named by Wikidata IDs: `dependent` depends on `dependency`. */
export interface CuratedLink {
  dependent: string;
  dependency: string;
  note?: string;
}

export interface CuratedMember {
  period: string;
  member: string;
  note?: string;
}

/** The curation file as written (DES-IMP-004). Every item is named by its Wikidata ID. */
export interface CurationRecord {
  root: string;
  maxEntries?: number;
  seeds?: string[];
  exclude?: string[];
  entries?: Record<string, CuratedEntry>;
  addLinks?: CuratedLink[];
  removeLinks?: CuratedLink[];
  addMembers?: CuratedMember[];
}

const DEFAULT_MAX_ENTRIES = 200;

/** The curation file: what to add to, remove from and correct in Wikidata's data, applied on every import. */
export class Curation {
  constructor(readonly record: CurationRecord) {}

  static read(file: string): Curation {
    return new Curation(JSON.parse(readFileSync(file, 'utf8')) as CurationRecord);
  }

  get root(): string {
    return this.record.root;
  }

  get maxEntries(): number {
    return this.record.maxEntries ?? DEFAULT_MAX_ENTRIES;
  }

  /** Where the walk starts: the root, the extra seeds, and both ends of every added link and membership. */
  get startingPoints(): string[] {
    const ids = [
      this.root,
      ...(this.record.seeds ?? []),
      ...this.addLinks.flatMap((l) => [l.dependent, l.dependency]),
      ...this.addMembers.flatMap((m) => [m.period, m.member]),
    ];
    return [...new Set(ids)].filter((id) => !this.isExcluded(id));
  }

  isExcluded(id: string): boolean {
    return (this.record.exclude ?? []).includes(id);
  }

  entry(id: string): CuratedEntry | undefined {
    return this.record.entries?.[id];
  }

  get addLinks(): CuratedLink[] {
    return this.record.addLinks ?? [];
  }

  get removeLinks(): CuratedLink[] {
    return this.record.removeLinks ?? [];
  }

  get addMembers(): CuratedMember[] {
    return this.record.addMembers ?? [];
  }
}
