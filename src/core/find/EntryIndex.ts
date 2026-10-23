import { Entry } from '../model/Entry';

/**
 * Every entry the user can go to, in alphabetical order, with a simple
 * search (DES-FIND-004). Each word typed must appear in the name or the
 * description, ignoring capitals and accents. Entries whose name matches
 * come before those that match only in their description.
 */
export class EntryIndex {
  private readonly entries: Entry[];

  constructor(entries: readonly Entry[]) {
    this.entries = entries.filter((e) => e.isVisitable).sort((a, b) => a.name.localeCompare(b.name));
  }

  get size(): number {
    return this.entries.length;
  }

  search(query: string): Entry[] {
    const words = EntryIndex.plain(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [...this.entries];
    }
    const inName: Entry[] = [];
    const inDescription: Entry[] = [];
    for (const entry of this.entries) {
      const name = EntryIndex.plain(entry.name);
      const text = `${name} ${EntryIndex.plain(entry.description)}`;
      if (words.every((w) => name.includes(w))) {
        inName.push(entry);
      } else if (words.every((w) => text.includes(w))) {
        inDescription.push(entry);
      }
    }
    return [...inName, ...inDescription];
  }

  /** Lower case, without accents, so "Apollo–Soyuz" matches "apollo soyuz" and "Reykjavík" matches "reykjavik". */
  private static plain(text: string): string {
    return text
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ');
  }
}
