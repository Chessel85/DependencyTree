import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { NavigationState } from '../core/navigation/NavigationState';

/**
 * The entries of the active list, as a standard ARIA list box. Focus sits on
 * the highlighted entry, so the screen reader reads it, its position, and
 * NVDA+Up Arrow repeats it (DES-SR-006).
 *
 * The list box is rebuilt whenever the moment or the tab changes. Because the
 * screen reader then sees focus enter a new list, it reads the list's label,
 * which names the moment and the list (DES-ANN-001).
 */
export class RelationshipListBox {
  private listbox: HTMLElement | undefined;
  private options: HTMLElement[] = [];

  constructor(
    private readonly panel: HTMLElement,
    private readonly words: AnnouncementBuilder,
    private readonly onChoose: (index: number) => void,
  ) {}

  build(state: NavigationState): void {
    const list = state.activeList;
    const listbox = document.createElement('ul');
    listbox.setAttribute('role', 'listbox');
    listbox.setAttribute('aria-label', this.words.listLabel(state));
    this.options = list.entries.map((moment, index) => {
      const option = document.createElement('li');
      option.setAttribute('role', 'option');
      option.id = `entry-${moment.id}`;
      option.textContent = this.words.entry(moment);
      option.setAttribute('aria-posinset', String(index + 1));
      option.setAttribute('aria-setsize', String(list.size));
      option.addEventListener('click', () => this.onChoose(index));
      return option;
    });
    listbox.append(...this.options);
    // An empty list box takes focus itself, and its label says "none".
    listbox.tabIndex = this.options.length === 0 ? 0 : -1;
    this.listbox = listbox;
    this.panel.replaceChildren(listbox);
    this.highlight(list.highlightedIndex);
  }

  /** Marks the entry at this position as highlighted. Only it is in the Tab order. */
  highlight(index: number): void {
    this.options.forEach((option, i) => {
      option.setAttribute('aria-selected', String(i === index));
      option.tabIndex = i === index ? 0 : -1;
    });
  }

  focus(): void {
    const target = this.options.find((option) => option.tabIndex === 0) ?? this.listbox;
    target?.focus();
  }

  contains(node: Node): boolean {
    return this.panel.contains(node);
  }
}
