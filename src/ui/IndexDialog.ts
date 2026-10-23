import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { EntryIndex } from '../core/find/EntryIndex';
import { PAGE_SIZE } from '../core/navigation/RelationshipList';
import { Entry } from '../core/model/Entry';

/** How long typing must pause before the number of results is announced (DES-FIND-001). */
const COUNT_DELAY = 500;

/**
 * The index: a search box and a list box of every entry, in alphabetical
 * order (DES-FIND-004). Typing narrows the list. Down Arrow in the search box
 * moves into the list, and Enter goes to the entry, making it current and
 * closing the dialog (DES-FIND-002). Escape closes it without moving.
 */
export class IndexDialog {
  private results: Entry[] = [];
  private options: HTMLElement[] = [];
  private highlighted = 0;
  private countTimer: number | undefined;

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly search: HTMLInputElement,
    private readonly count: HTMLElement,
    private readonly listbox: HTMLElement,
    closeButton: HTMLButtonElement,
    private readonly index: EntryIndex,
    private readonly words: AnnouncementBuilder,
    private readonly onChoose: (entry: Entry) => void,
    onClose: () => void,
  ) {
    search.addEventListener('input', () => this.update(true));
    search.addEventListener('keydown', (event) => this.onSearchKey(event));
    listbox.addEventListener('keydown', (event) => this.onListKey(event));
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', onClose);
  }

  /** Opens with an empty search box, showing every entry. */
  open(): void {
    this.search.value = '';
    this.update(false);
    this.dialog.showModal();
    this.search.focus();
  }

  private update(announce: boolean): void {
    this.results = this.index.search(this.search.value);
    this.highlighted = 0;
    this.options = this.results.map((entry, i) => {
      const option = document.createElement('li');
      option.setAttribute('role', 'option');
      option.textContent = this.words.entry(entry);
      option.setAttribute('aria-posinset', String(i + 1));
      option.setAttribute('aria-setsize', String(this.results.length));
      option.addEventListener('click', () => this.choose(i));
      return option;
    });
    this.listbox.replaceChildren(...this.options);
    this.mark();
    window.clearTimeout(this.countTimer);
    this.count.textContent = announce ? '' : this.countText();
    if (announce) {
      this.countTimer = window.setTimeout(() => (this.count.textContent = this.countText()), COUNT_DELAY);
    }
  }

  private countText(): string {
    const n = this.results.length;
    return n === 0 ? 'No entries' : n === 1 ? '1 entry' : `${n} entries`;
  }

  private onSearchKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && this.options.length > 0) {
      event.preventDefault();
      this.moveTo(this.highlighted);
    } else if (event.key === 'Enter' && this.results.length > 0) {
      event.preventDefault();
      this.choose(0);
    }
  }

  private onListKey(event: KeyboardEvent): void {
    const last = this.options.length - 1;
    switch (event.key) {
      case 'ArrowDown': return this.handled(event, () => this.moveTo(Math.min(this.highlighted + 1, last)));
      case 'ArrowUp':
        // Up Arrow on the first entry goes back to the search box.
        return this.handled(event, () => (this.highlighted === 0 ? this.search.focus() : this.moveTo(this.highlighted - 1)));
      case 'PageUp': return this.handled(event, () => this.moveTo(Math.max(this.highlighted - PAGE_SIZE, 0)));
      case 'PageDown': return this.handled(event, () => this.moveTo(Math.min(this.highlighted + PAGE_SIZE, last)));
      case 'Home': return this.handled(event, () => this.moveTo(0));
      case 'End': return this.handled(event, () => this.moveTo(last));
      case 'Enter': return this.handled(event, () => this.choose(this.highlighted));
    }
  }

  private handled(event: KeyboardEvent, action: () => void): void {
    event.preventDefault();
    action();
  }

  private moveTo(index: number): void {
    this.highlighted = index;
    this.mark();
    this.options[index]?.focus();
  }

  /** Only the highlighted entry is in the Tab order, as in the card's lists. */
  private mark(): void {
    this.options.forEach((option, i) => {
      option.setAttribute('aria-selected', String(i === this.highlighted));
      option.tabIndex = i === this.highlighted ? 0 : -1;
    });
  }

  private choose(index: number): void {
    const entry = this.results[index];
    if (entry) {
      this.dialog.close();
      this.onChoose(entry);
    }
  }
}
