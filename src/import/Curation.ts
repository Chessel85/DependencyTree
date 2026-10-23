import { readFileSync } from 'node:fs';
import { DateRecord } from '../core/data/DatasetReader';
import { CauseStrength } from '../core/model/Link';

/** Corrections to one Wikidata item. Giving `date` makes it a moment, and giving `start` makes it a period. */
export interface CuratedEntry {
  id?: string;
  name?: string;
  description?: string;
  date?: DateRecord;
  start?: DateRecord;
  end?: DateRecord;
  /** For a period: the Wikidata items of the real moments it starts and ends with (DES-IMP-008). */
  startMoment?: string;
  endMoment?: string;
  /** True if the item is an idea, false if it isn't, whatever Wikidata's classes say (DES-DATA-009). */
  idea?: boolean;
  note?: string;
}

/**
 * A link named by Wikidata IDs: `later` depends on, was caused by or was
 * influenced by `earlier`. The kind is "depends on" unless given. The note
 * is shown to the user (DES-REL-009). `at` chooses which end of a period
 * `earlier` stands for (DES-REL-007).
 */
export interface CuratedLink {
  later: string;
  earlier: string;
  kind?: 'depends on' | 'caused by' | 'influenced by';
  strength?: CauseStrength;
  note?: string;
  at?: 'start' | 'end';
}

export interface CuratedMember {
  period: string;
  member: string;
  note?: string;
}

/** The curation file as written (DES-IMP-004). Every item is named by its Wikidata ID. */
export interface CurationRecord {
  /** The top items the walk starts from, such as the iPhone. The page opens at the first. */
  roots: string[];
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

  get roots(): string[] {
    return this.record.roots;
  }

  get maxEntries(): number {
    return this.record.maxEntries ?? DEFAULT_MAX_ENTRIES;
  }

  /** Where the walk starts: the roots, the extra seeds, and both ends of every added link and membership. */
  get startingPoints(): string[] {
    const ids = [
      ...this.roots,
      ...(this.record.seeds ?? []),
      ...this.addLinks.flatMap((l) => [l.later, l.earlier]),
      ...this.addMembers.flatMap((m) => [m.period, m.member]),
      ...Object.values(this.record.entries ?? {}).flatMap((e) => [e.startMoment ?? [], e.endMoment ?? []].flat()),
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
