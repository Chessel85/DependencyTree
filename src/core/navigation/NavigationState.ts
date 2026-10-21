import { Moment } from '../model/Moment';
import { ListKind } from './ListKind';
import { ListSetBuilder } from './ListSetBuilder';
import { PathHistory } from './PathHistory';
import { RelationshipList } from './RelationshipList';
import { Visit } from './Visit';

/**
 * Where the user is in the tree: the current moment, its lists, which list is
 * active, and the path taken. It has no user interface. Every action returns
 * false, changing nothing, when it isn't possible (DES-NAV-008).
 */
export class NavigationState {
  private current!: Moment;
  private lists: RelationshipList[] = [];
  private activeIndex = 0;
  private readonly history = new PathHistory();

  constructor(
    private readonly listBuilder: ListSetBuilder,
    start: Moment,
  ) {
    this.arrive(start, ListKind.Dependencies);
  }

  get currentMoment(): Moment {
    return this.current;
  }

  get activeList(): RelationshipList {
    return this.lists[this.activeIndex];
  }

  /** The list of the given kind, if the current moment has one. */
  list(kind: ListKind): RelationshipList | undefined {
    return this.lists.find((l) => l.kind === kind);
  }

  /** Every moment on the path, ending with the current one. */
  get path(): Moment[] {
    return [...this.history.moments, this.current];
  }

  /** Left Arrow: works only when the Dependencies list is active (DES-KEY-001, DES-KEY-013). */
  goEarlier(): boolean {
    return this.activeList.kind === ListKind.Dependencies && this.follow();
  }

  /** Right Arrow: works only when the Enabled list is active (DES-KEY-001, DES-KEY-013). */
  goLater(): boolean {
    return this.activeList.kind === ListKind.Enabled && this.follow();
  }

  /** Enter: goes to the highlighted entry in the active list (DES-KEY-004). */
  follow(): boolean {
    const target = this.activeList.highlighted;
    if (!target) {
      return false;
    }
    this.history.push(this.snapshot());
    this.arrive(target, this.activeList.kind);
    return true;
  }

  /** Ctrl+Left Arrow and Ctrl+Right Arrow: the previous or next list (DES-KEY-003). */
  switchList(delta: number): boolean {
    const index = this.activeIndex + delta;
    if (index < 0 || index >= this.lists.length) {
      return false;
    }
    this.activeIndex = index;
    return true;
  }

  /** Backspace: back one step along the path (DES-KEY-005). */
  goBack(): boolean {
    const visit = this.history.pop();
    if (!visit) {
      return false;
    }
    this.arrive(visit.moment, visit.activeKind);
    for (const list of this.lists) {
      list.restoreHighlight(visit.highlights.get(list.kind) ?? 0);
    }
    return true;
  }

  /** The active list after arriving is the kind just moved through, if the moment has one (DES-NAV-005). */
  private arrive(moment: Moment, kind: ListKind): void {
    this.current = moment;
    this.lists = this.listBuilder.build(moment);
    const index = this.lists.findIndex((l) => l.kind === kind);
    this.activeIndex = index >= 0 ? index : 0;
  }

  private snapshot(): Visit {
    const highlights = new Map(this.lists.map((l) => [l.kind, l.highlightedIndex] as const));
    return new Visit(this.current, this.activeList.kind, highlights);
  }
}
