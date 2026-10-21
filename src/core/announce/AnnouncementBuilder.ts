import { DateFormatter } from '../dates/DateFormatter';
import { Moment } from '../model/Moment';
import { NavigationState } from '../navigation/NavigationState';
import { RelationshipList } from '../navigation/RelationshipList';
import { ListKind } from '../navigation/ListKind';

/**
 * The wording of everything the navigator shows or says. Most of it is read
 * by the screen reader from standard controls; the rest is spoken through a
 * live region when the user presses an information key.
 */
export class AnnouncementBuilder {
  constructor(private readonly dates: DateFormatter) {}

  /** The summary box: name, date and location, one per line. */
  summaryLines(moment: Moment): string {
    return [moment.name, this.dates.spoken(moment.date), moment.location ?? 'Location not known'].join('\n');
  }

  /**
   * The list's label, read when focus arrives in it after moving or switching
   * tab: "Telephone, 7 March 1876, Dependencies". An empty list adds "none".
   */
  listLabel(state: NavigationState): string {
    const list = state.activeList;
    const none = list.size === 0 ? ', none' : '';
    return `${this.nameAndDate(state.currentMoment)}, ${list.kind}${none}`;
  }

  /** One entry in a list: "Electric battery, March 1800". */
  entry(moment: Moment): string {
    return this.nameAndDate(moment);
  }

  /** A tab: "Dependencies (2)". */
  tab(list: RelationshipList): string {
    return `${list.kind} (${list.size})`;
  }

  /** Space: a summary of the current moment. */
  summary(state: NavigationState): string {
    const moment = state.currentMoment;
    const place = moment.location ? `, ${moment.location}` : '';
    const counts = [ListKind.Dependencies, ListKind.PartOf, ListKind.Enabled]
      .map((kind) => state.list(kind))
      .filter((list): list is RelationshipList => list !== undefined)
      .map((list) => `${list.kind}, ${list.size === 0 ? 'none' : list.size}.`)
      .join(' ');
    return `${this.nameAndDate(moment)}${place}. ${counts}`;
  }

  /** D */
  description(moment: Moment): string {
    return moment.description || 'No description.';
  }

  /** T */
  tags(moment: Moment): string {
    return moment.tags.length > 0 ? `Tags: ${moment.tags.join(', ')}.` : 'No tags.';
  }

  /** L */
  location(moment: Moment): string {
    return moment.location ? `Location: ${moment.location}.` : 'No location.';
  }

  /** P: the moments on the path taken, each once, in date order from oldest to newest (DES-KEY-006). */
  path(moments: readonly Moment[]): string {
    const distinct = [...new Map(moments.map((m) => [m.id, m])).values()].sort(Moment.byDate);
    if (distinct.length === 1) {
      return `Path: just ${distinct[0].name}.`;
    }
    return `Path, ${distinct.length} moments: ${distinct.map((m) => m.name).join(', ')}.`;
  }

  private nameAndDate(moment: Moment): string {
    return `${moment.name}, ${this.dates.spoken(moment.date)}`;
  }
}
