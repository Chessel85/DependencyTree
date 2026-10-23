import { Entry } from '../model/Entry';
import { Link } from '../model/Link';
import { ListKind } from './ListKind';

/** How many entries Page Up and Page Down move by (DES-KEY-002). */
export const PAGE_SIZE = 10;

/**
 * One list on an entry, such as Depended on or a period's Moments, with its
 * highlighted entry (DES-NAV-004). A list of linked moments also keeps the
 * link to each, for its strength and note.
 */
export class RelationshipList {
  private highlightIndex = 0;

  constructor(
    readonly kind: ListKind,
    readonly entries: readonly Entry[],
    private readonly links: readonly Link[] = [],
  ) {}

  /** The moments at the earlier or later end of these links, oldest first (DES-NAV-006). */
  static ofLinks(kind: ListKind, links: readonly Link[], earlier: boolean): RelationshipList {
    const other = (l: Link) => (earlier ? l.earlier : l.later);
    const sorted = [...links].sort((a, b) => Entry.byDate(other(a), other(b)));
    return new RelationshipList(kind, sorted.map(other), sorted);
  }

  /** The link to the entry at this position, if the list is one of linked moments. */
  linkAt(index: number): Link | undefined {
    return this.links[index];
  }

  get highlightedLink(): Link | undefined {
    return this.links[this.highlightIndex];
  }

  get size(): number {
    return this.entries.length;
  }

  get highlighted(): Entry | undefined {
    return this.entries[this.highlightIndex];
  }

  /** The highlighted entry's position, counting from 1. */
  get position(): number {
    return this.highlightIndex + 1;
  }

  /** Moves the highlight by `delta` places. Returns false, changing nothing, if that would leave the list. */
  moveBy(delta: number): boolean {
    return this.highlightAt(this.highlightIndex + delta);
  }

  /** Page Up or Page Down: moves by a page, stopping at the first or last entry. */
  movePage(direction: -1 | 1): boolean {
    const target = Math.min(Math.max(this.highlightIndex + direction * PAGE_SIZE, 0), this.size - 1);
    return this.highlightAt(target);
  }

  moveToFirst(): boolean {
    return this.highlightAt(0);
  }

  moveToLast(): boolean {
    return this.highlightAt(this.size - 1);
  }

  /** Puts the highlight back where it was, when returning along the path. */
  restoreHighlight(index: number): void {
    this.highlightAt(index);
  }

  get highlightedIndex(): number {
    return this.highlightIndex;
  }

  private highlightAt(index: number): boolean {
    if (index < 0 || index >= this.size || index === this.highlightIndex) {
      return false;
    }
    this.highlightIndex = index;
    return true;
  }
}
