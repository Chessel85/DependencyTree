import { DateFormatter } from '../dates/DateFormatter';
import { DateShortener } from '../dates/DateShortener';
import { HistoricDate } from '../dates/HistoricDate';
import { Entry } from '../model/Entry';
import { Moment } from '../model/Moment';
import { Period } from '../model/Period';
import { ListKind } from '../navigation/ListKind';
import { NavigationState } from '../navigation/NavigationState';
import { RelationshipList } from '../navigation/RelationshipList';

/**
 * The wording of everything the navigator shows or says. Most of it is read
 * by the screen reader from standard controls; the rest is spoken through a
 * live region when the user presses an information key.
 *
 * Lists and labels use shortened dates (DES-DATE-006). The summary box and
 * the Space summary give dates in full.
 */
export class AnnouncementBuilder {
  constructor(
    private readonly dates: DateFormatter,
    private readonly shortener: DateShortener,
  ) {}

  /** The summary box: the name, the date, and the location or kind of period, one per line. */
  summaryLines(entry: Entry): string {
    if (entry instanceof Period) {
      return [entry.name, this.fullDate(entry), entry.isOngoing ? 'Period, still going on' : 'Period'].join('\n');
    }
    const location = entry instanceof Moment ? entry.location : undefined;
    return [entry.name, this.fullDate(entry), location ?? 'Location not known'].join('\n');
  }

  /**
   * The list's label after arriving at an entry, so the screen reader names
   * where the user now is: "Event: Telephone, 1876, Dependencies"
   * (DES-ANN-001). A period needs no word before it, as its range of dates
   * shows it is a period.
   */
  arrivalLabel(state: NavigationState): string {
    const kind = state.currentEntry instanceof Period ? '' : 'Event: ';
    return `${kind}${this.entry(state.currentEntry)}, ${this.switchLabel(state)}`;
  }

  /** The list's label after switching tab: just "Dependencies". An empty list shows "None" as its only item (DES-ANN-003). */
  switchLabel(state: NavigationState): string {
    return state.activeList.kind;
  }

  /** One entry in a list: "Electric battery, 1800", or "Cold War, 1947 to 1991", or "Ongoing". */
  entry(entry: Entry): string {
    if (!entry.isVisitable) {
      return entry.name;
    }
    return `${entry.name}, ${this.shortDate(entry)}`;
  }

  /** A tab: "Dependencies (2)". */
  tab(list: RelationshipList): string {
    return `${list.kind} (${list.size})`;
  }

  /** Space: a summary of the current entry. */
  summary(state: NavigationState): string {
    const entry = state.currentEntry;
    const place = entry instanceof Moment && entry.location ? `, ${entry.location}` : '';
    const counts = [ListKind.Moments, ListKind.Dependencies, ListKind.PartOf, ListKind.Enabled]
      .map((kind) => state.list(kind))
      .filter((list): list is RelationshipList => list !== undefined)
      .map((list) => `${list.kind}, ${list.size === 0 ? 'none' : list.size}.`)
      .join(' ');
    return `${entry.name}, ${this.fullDate(entry)}${place}. ${counts}`;
  }

  /** D */
  description(entry: Entry): string {
    return entry.description || 'No description.';
  }

  /** T */
  tags(entry: Entry): string {
    return entry.tags.length > 0 ? `Tags: ${entry.tags.join(', ')}.` : 'No tags.';
  }

  /** L */
  location(entry: Entry): string {
    return entry instanceof Moment && entry.location ? `Location: ${entry.location}.` : 'No location.';
  }

  /** P: the entries on the path taken, each once, in date order from oldest to newest (DES-KEY-006). */
  path(entries: readonly Entry[]): string {
    const distinct = [...new Map(entries.map((e) => [e.id, e])).values()].sort(Entry.byDate);
    if (distinct.length === 1) {
      return `Path: just ${distinct[0].name}.`;
    }
    return `Path, ${distinct.length} entries: ${distinct.map((e) => e.name).join(', ')}.`;
  }

  private fullDate(entry: Entry): string {
    return this.dateText(entry, (d) => d);
  }

  private shortDate(entry: Entry): string {
    return this.dateText(entry, (d) => this.shortener.shorten(d));
  }

  /** A moment's date, or a period's dates as "509 BCE to 27 BCE" or "1949 to present". */
  private dateText(entry: Entry, adjust: (date: HistoricDate) => HistoricDate): string {
    const spoken = (m: Moment) => this.dates.spoken(adjust(m.date));
    if (entry instanceof Period) {
      return `${spoken(entry.start)} to ${entry.end ? spoken(entry.end) : 'present'}`;
    }
    return entry instanceof Moment ? spoken(entry) : '';
  }
}
