import { Moment } from '../model/Moment';
import { ListKind } from './ListKind';

/** One list on a moment, such as Dependencies, with its highlighted entry (DES-NAV-004). */
export class RelationshipList {
  private highlightIndex = 0;

  constructor(
    readonly kind: ListKind,
    readonly entries: readonly Moment[],
  ) {}

  get size(): number {
    return this.entries.length;
  }

  get highlighted(): Moment | undefined {
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
