import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { Entry } from '../core/model/Entry';

/**
 * The top of the current entry's card: its name as a heading, and the
 * summary and description as read-only text boxes, so the screen reader's
 * own reading commands work on them (DES-SR-006).
 */
export class EntryCard {
  constructor(
    private readonly heading: HTMLElement,
    private readonly summary: HTMLTextAreaElement,
    private readonly description: HTMLTextAreaElement,
    private readonly words: AnnouncementBuilder,
  ) {}

  show(entry: Entry): void {
    this.heading.textContent = entry.name;
    this.fill(this.summary, this.words.summaryLines(entry));
    this.fill(this.description, this.words.description(entry));
  }

  /**
   * Setting a text box's value leaves the caret at the end, so it is moved
   * back to the start. Within one entry, the box keeps wherever the user
   * left the caret.
   */
  private fill(box: HTMLTextAreaElement, text: string): void {
    box.value = text;
    box.setSelectionRange(0, 0);
    box.scrollTop = 0;
  }
}
