import { Entry } from '../model/Entry';
import { Period } from '../model/Period';
import { ListKind } from './ListKind';
import { ListSetBuilder } from './ListSetBuilder';
import { PathHistory } from './PathHistory';
import { RelationshipList } from './RelationshipList';
import { StepResult } from './StepResult';
import { Visit } from './Visit';

/**
 * Where the user is in the tree: the current entry, its lists, which list is
 * active, and the path taken. It has no user interface. Every action
 * reports, changing nothing, when it isn't possible (DES-NAV-008).
 */
export class NavigationState {
  private current!: Entry;
  private lists: RelationshipList[] = [];
  private activeIndex = 0;
  private readonly history = new PathHistory();

  constructor(
    private readonly listBuilder: ListSetBuilder,
    start: Entry,
  ) {
    this.arrive(start, ListKind.Dependencies);
  }

  get currentEntry(): Entry {
    return this.current;
  }

  get activeList(): RelationshipList {
    return this.lists[this.activeIndex];
  }

  /** The current entry's lists, in tab order. */
  get allLists(): readonly RelationshipList[] {
    return this.lists;
  }

  get activeListIndex(): number {
    return this.activeIndex;
  }

  /** The list of the given kind, if the current entry has one. */
  list(kind: ListKind): RelationshipList | undefined {
    return this.lists.find((l) => l.kind === kind);
  }

  /** Every entry on the path, ending with the current one. */
  get path(): Entry[] {
    return [...this.history.entries, this.current];
  }

  /**
   * Left Arrow. In a Dependencies list, it goes to the highlighted entry, or
   * bumps if the list is empty. Otherwise it does nothing, including in a
   * period's Moments list (DES-KEY-001, DES-KEY-013, DES-ANN-011).
   */
  stepEarlier(): StepResult {
    return this.step(ListKind.Dependencies);
  }

  /** Right Arrow: the same as Left Arrow, but later in time, using the Enabled list. */
  stepLater(): StepResult {
    return this.step(ListKind.Enabled);
  }

  /** Enter: goes to the highlighted entry in the active list (DES-KEY-004, DES-KEY-011). */
  follow(): boolean {
    const target = this.activeList.highlighted;
    if (!target || !target.isVisitable) {
      return false;
    }
    const from = this.current;
    this.history.push(this.snapshot());
    this.arrive(target, this.activeList.kind, from);
    return true;
  }

  /** Ctrl+Left Arrow and Ctrl+Right Arrow: the previous or next list (DES-KEY-003). */
  switchList(delta: number): boolean {
    return this.selectList(this.activeIndex + delta);
  }

  /** Makes the list at this position active, for example when its tab is chosen. */
  selectList(index: number): boolean {
    if (index < 0 || index >= this.lists.length || index === this.activeIndex) {
      return false;
    }
    this.activeIndex = index;
    return true;
  }

  /** Backspace: back one step along the path, to the list and highlights the user left (DES-KEY-005). */
  goBack(): boolean {
    const visit = this.history.pop();
    if (!visit) {
      return false;
    }
    this.show(visit.entry, visit.activeKind);
    for (const list of this.lists) {
      list.restoreHighlight(visit.highlights.get(list.kind) ?? 0);
    }
    return true;
  }

  private step(followKind: ListKind): StepResult {
    if (this.activeList.kind !== followKind) {
      return StepResult.Nothing;
    }
    return this.follow() ? StepResult.Moved : StepResult.Bumped;
  }

  /**
   * Arriving at a period always shows its Moments list. If the user came from
   * one of its stops, that stop is highlighted (DES-NAV-010). Arriving at a
   * moment shows the kind of list just moved through, if it has one
   * (DES-NAV-005).
   */
  private arrive(entry: Entry, viaKind: ListKind, from?: Entry): void {
    const isPeriod = entry instanceof Period;
    this.show(entry, isPeriod ? ListKind.Moments : viaKind);
    if (isPeriod && from) {
      const stop = this.activeList.entries.indexOf(from);
      if (stop >= 0) {
        this.activeList.restoreHighlight(stop);
      }
    }
  }

  private show(entry: Entry, kind: ListKind): void {
    this.current = entry;
    this.lists = this.listBuilder.build(entry);
    const index = this.lists.findIndex((l) => l.kind === kind);
    this.activeIndex = index >= 0 ? index : 0;
  }

  private snapshot(): Visit {
    const highlights = new Map(this.lists.map((l) => [l.kind, l.highlightedIndex] as const));
    return new Visit(this.current, this.activeList.kind, highlights);
  }
}
