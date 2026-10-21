import { DateFormatter } from '../core/dates/DateFormatter';
import { ListKind } from '../core/navigation/ListKind';
import { NavigationState } from '../core/navigation/NavigationState';
import { RelationshipList } from '../core/navigation/RelationshipList';

/**
 * The Details region: everything about the current moment as ordinary
 * headings, paragraphs and lists, for reading in browse mode (DES-SR-003).
 */
export class DetailsPanel {
  constructor(
    private readonly region: HTMLElement,
    private readonly content: HTMLElement,
    private readonly dates: DateFormatter,
    onEscape: () => void,
  ) {
    region.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    });
  }

  show(state: NavigationState): void {
    const moment = state.currentMoment;
    this.content.replaceChildren(
      this.element('h3', moment.name, { tabindex: '-1', id: 'details-name' }),
      this.element('p', `Date: ${this.dates.written(moment.date)}`),
      this.element('p', `Location: ${moment.location ?? 'not known'}`),
      this.element('p', moment.description),
      this.element('p', `Tags: ${moment.tags.join(', ') || 'none'}`),
      ...this.listSection(state.list(ListKind.Dependencies)),
      ...this.listSection(state.list(ListKind.Enabled)),
    );
  }

  /** I: moves focus to the moment's name, so it can be read with normal reading keys (DES-KEY-008). */
  focus(): void {
    this.region.querySelector<HTMLElement>('#details-name')?.focus();
  }

  private listSection(list: RelationshipList | undefined): HTMLElement[] {
    if (!list) {
      return [];
    }
    const heading = this.element('h4', `${list.kind} (${list.size})`);
    if (list.size === 0) {
      return [heading, this.element('p', 'None.')];
    }
    const items = list.entries.map((m) => this.element('li', `${m.name}, ${this.dates.written(m.date)}`));
    const ul = document.createElement('ul');
    ul.append(...items);
    return [heading, ul];
  }

  private element(tag: string, text: string, attributes: Record<string, string> = {}): HTMLElement {
    const el = document.createElement(tag);
    el.textContent = text;
    for (const [name, value] of Object.entries(attributes)) {
      el.setAttribute(name, value);
    }
    return el;
  }
}
