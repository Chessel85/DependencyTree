import { AnnouncementBuilder } from '../core/announce/AnnouncementBuilder';
import { Moment } from '../core/model/Moment';

/**
 * The top of the current moment's card: its name as a heading, and the
 * summary and description as read-only text boxes, so the screen reader's
 * own reading commands work on them (DES-SR-006).
 */
export class MomentCard {
  constructor(
    private readonly heading: HTMLElement,
    private readonly summary: HTMLTextAreaElement,
    private readonly description: HTMLTextAreaElement,
    private readonly words: AnnouncementBuilder,
  ) {}

  show(moment: Moment): void {
    this.heading.textContent = moment.name;
    this.summary.value = this.words.summaryLines(moment);
    this.description.value = this.words.description(moment);
  }
}
