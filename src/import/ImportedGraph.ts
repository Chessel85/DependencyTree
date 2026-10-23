import { WikidataEntity } from './WikidataEntity';

/** A dependency between two Wikidata items, with the property or "curation" it came from (DES-IMP-003). */
export interface ImportedLink {
  dependent: string;
  dependency: string;
  source: string;
}

/** A Wikidata item that is part of a period, with the property or "curation" it came from. */
export interface ImportedMembership {
  period: string;
  member: string;
  source: string;
}

/** The items the walk gathered, and the links it read between them and to items beyond them. */
export class ImportedGraph {
  /** The gathered items, in the order they were reached. */
  readonly entries = new Map<string, WikidataEntity>();
  /** Items reached that have no usable date, so are left out (DES-IMP-007). */
  readonly undated = new Map<string, WikidataEntity>();
  /** Items reached only from entries that certainly came before them, so are left out (DES-IMP-002). */
  readonly tooLate = new Map<string, WikidataEntity>();
  readonly links: ImportedLink[] = [];
  readonly memberships: ImportedMembership[] = [];
  /** True if the walk stopped because it reached the most entries allowed (DES-IMP-002). */
  stoppedAtLimit = false;

  private readonly periods = new Set<string>();
  private readonly aliases = new Map<string, string>();

  add(entity: WikidataEntity, isPeriod: boolean): void {
    this.entries.set(entity.id, entity);
    if (isPeriod) {
      this.periods.add(entity.id);
    }
  }

  has(id: string): boolean {
    return this.entries.has(this.canonical(id));
  }

  isPeriod(id: string): boolean {
    return this.periods.has(this.canonical(id));
  }

  get size(): number {
    return this.entries.size;
  }

  /** Records that Wikidata merged one item into another, so links to either reach the same entry. */
  alias(from: string, to: string): void {
    this.aliases.set(from, to);
  }

  canonical(id: string): string {
    return this.aliases.get(id) ?? id;
  }

  hasLink(dependent: string, dependency: string): boolean {
    return this.links.some(
      (l) => this.canonical(l.dependent) === this.canonical(dependent) && this.canonical(l.dependency) === this.canonical(dependency),
    );
  }
}
