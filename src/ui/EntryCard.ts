import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { Entry } from '../core/model/Entry';
import { Link } from '../core/model/Link';

/**
 * The top of the current entry's card: its name as a heading, and the
 * summary and description as read-only text boxes, so the screen reader's
 * own reading commands work on them (DES-SR-006). A note box follows them
 * only while the link to the highlighted entry has a note (DES-ANN-014).
 */
export class EntryCard {
  constructor(
    private readonly heading: HTMLElement,
    private readonly summary: HTMLTextAreaElement,
    private readonly description: HTMLTextAreaElement,
    private readonly notePart: HTMLElement,
    private readonly note: HTMLTextAreaElement,
    private readonly words: AnnouncementBuilder,
  ) {}

  show(entry: Entry): void {
    this.heading.textContent = this.words.title(entry);
    this.fill(this.summary, this.words.summaryLines(entry));
    this.fill(this.description, this.words.description(entry));
  }

  /** Shows the note on the link to the highlighted entry, or hides the box if there is none. */
  showNote(link: Link | undefined): void {
    const text = link?.note ?? '';
    if (text !== this.note.value) {
      this.fill(this.note, text);
    }
    this.notePart.hidden = text === '';
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
