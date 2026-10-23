import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { NavigationState } from '../core/navigation/NavigationState';

/**
 * The entries of the active list, as a standard ARIA list box. Focus sits on
 * the highlighted entry, so the screen reader reads it with its position,
 * and NVDA+Up Arrow repeats it (DES-SR-006).
 *
 * A new list box is built whenever the entry or the tab changes, so the
 * screen reader sees focus enter a new list and reads its label (DES-SR-007).
 * If the old list box has focus, it stays until focus has moved into the new
 * one. Otherwise focus would drop to the page for a moment, and the screen
 * reader would announce the whole page again.
 *
 * An empty list shows one item, "None", so NVDA+Up Arrow has something to
 * read. It can't be followed.
 */
export class RelationshipListBox {
  private listbox: HTMLElement | undefined;
  private options: HTMLElement[] = [];

  constructor(
    private readonly panel: HTMLElement,
    private readonly words: AnnouncementBuilder,
    private readonly onChoose: (index: number) => void,
  ) {}

  build(state: NavigationState, label: string): void {
    const list = state.activeList;
    const listbox = document.createElement('ul');
    listbox.setAttribute('role', 'listbox');
    listbox.setAttribute('aria-label', label);
    this.options = list.entries.map((entry, index) => {
      const option = document.createElement('li');
      option.setAttribute('role', 'option');
      option.textContent = this.words.entry(entry);
      option.setAttribute('aria-posinset', String(index + 1));
      option.setAttribute('aria-setsize', String(list.size));
      option.addEventListener('click', () => this.onChoose(index));
      return option;
    });
    if (this.options.length === 0) {
      this.options = [this.noneOption()];
    }
    listbox.append(...this.options);
    listbox.tabIndex = -1;
    this.listbox = listbox;
    if (this.panel.contains(document.activeElement)) {
      this.panel.append(listbox);
    } else {
      this.panel.replaceChildren(listbox);
    }
    this.highlight(list.highlightedIndex);
  }

  private noneOption(): HTMLElement {
    const option = document.createElement('li');
    option.setAttribute('role', 'option');
    option.textContent = 'None';
    return option;
  }

  /** Marks the entry at this position as highlighted. Only it is in the Tab order. */
  highlight(index: number): void {
    // An empty list's highlight is -1, but its "None" item still takes focus.
    const shown = Math.max(index, 0);
    this.options.forEach((option, i) => {
      option.setAttribute('aria-selected', String(i === shown));
      option.tabIndex = i === shown ? 0 : -1;
    });
  }

  /** Focuses the highlighted entry, then removes any list box it replaced. */
  focus(): void {
    const target = this.options.find((option) => option.tabIndex === 0) ?? this.listbox;
    target?.focus();
    for (const child of [...this.panel.children]) {
      if (child !== this.listbox) {
        child.remove();
      }
    }
  }

  contains(node: Node): boolean {
    return this.panel.contains(node);
  }
}
