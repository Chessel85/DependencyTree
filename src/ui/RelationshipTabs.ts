import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { NavigationState } from '../core/navigation/NavigationState';

/**
 * The row of tabs, one per list, as a standard ARIA tab control. Left Arrow
 * and Right Arrow on a tab choose the previous or next tab, and Home and End
 * the first and last, as on any tab control.
 */
export class RelationshipTabs {
  private tabs: HTMLButtonElement[] = [];

  constructor(
    private readonly tablist: HTMLElement,
    private readonly panelId: string,
    private readonly words: AnnouncementBuilder,
    private readonly onChoose: (index: number) => void,
  ) {
    tablist.addEventListener('keydown', (event) => this.onKey(event));
  }

  /** Builds a tab for each of the current moment's lists. */
  build(state: NavigationState): void {
    this.tabs = state.allLists.map((list, index) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.id = `tab-${index}`;
      tab.setAttribute('aria-controls', this.panelId);
      tab.textContent = this.words.tab(list);
      tab.addEventListener('click', () => this.onChoose(index));
      return tab;
    });
    this.tablist.replaceChildren(...this.tabs);
    this.select(state.activeListIndex);
  }

  /** Marks the tab at this position as the chosen one. Only that tab is in the Tab order. */
  select(index: number): void {
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
  }

  focusSelected(): void {
    this.tabs.find((tab) => tab.tabIndex === 0)?.focus();
  }

  private onKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    const current = this.tabs.findIndex((tab) => tab === event.target);
    if (current < 0) {
      return;
    }
    const targets: Record<string, number> = {
      ArrowLeft: current - 1,
      ArrowRight: current + 1,
      Home: 0,
      End: this.tabs.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    if (target >= 0 && target < this.tabs.length && target !== current) {
      this.onChoose(target);
      this.focusSelected();
    }
  }
}
