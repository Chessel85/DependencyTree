import { DateFormatter } from '../dates/DateFormatter';
import { Moment } from '../model/Moment';
import { NavigationState } from '../navigation/NavigationState';
import { RelationshipList } from '../navigation/RelationshipList';
import { ListKind } from '../navigation/ListKind';

/** The wording of everything the navigator says (DES-ANN items). */
export class AnnouncementBuilder {
  constructor(private readonly dates: DateFormatter) {}

  /** On arriving at a moment: "Laptop, 1981. Enabled, 12." (DES-ANN-001) */
  arrival(state: NavigationState): string {
    return `${this.nameAndDate(state.currentMoment)}. ${this.listHeading(state.activeList)}.`;
  }

  /** On moving within a list: "Smartphone, 1994, 3 of 12." (DES-ANN-002) */
  position(list: RelationshipList): string {
    const entry = list.highlighted;
    return entry ? `${this.nameAndDate(entry)}, ${list.position} of ${list.size}.` : '';
  }

  /** On switching list: "Dependencies, 4. Lithium-ion battery, 1991, 1 of 4." (DES-ANN-003) */
  listSwitch(list: RelationshipList): string {
    return list.size === 0 ? `${this.listHeading(list)}.` : `${this.listHeading(list)}. ${this.position(list)}`;
  }

  /** Space: a summary of the current moment. */
  summary(state: NavigationState): string {
    const moment = state.currentMoment;
    const place = moment.location ? `, ${moment.location}` : '';
    const counts = [ListKind.Dependencies, ListKind.PartOf, ListKind.Enabled]
      .map((kind) => state.list(kind))
      .filter((list): list is RelationshipList => list !== undefined)
      .map((list) => `${this.listHeading(list)}.`)
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

  /** P: the path taken, oldest first. */
  path(moments: readonly Moment[]): string {
    if (moments.length === 1) {
      return `Path: just ${moments[0].name}.`;
    }
    return `Path, ${moments.length} steps: ${moments.map((m) => m.name).join(', ')}.`;
  }

  private nameAndDate(moment: Moment): string {
    return `${moment.name}, ${this.dates.spoken(moment.date)}`;
  }

  private listHeading(list: RelationshipList): string {
    return `${list.kind}, ${list.size === 0 ? 'none' : list.size}`;
  }
}
