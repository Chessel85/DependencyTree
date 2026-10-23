import { Dataset } from '../data/Dataset';
import { Entry } from '../model/Entry';
import { Moment } from '../model/Moment';
import { OngoingStop } from '../model/OngoingStop';
import { Period } from '../model/Period';
import { EARLIER_LISTS, LATER_LISTS, ListKind } from './ListKind';
import { RelationshipList } from './RelationshipList';

/**
 * Decides which lists an entry shows (DES-NAV-002, DES-NAV-003, DES-NAV-012).
 * A moment has a list for each kind of link it has, earlier ones first, then
 * Part of when it belongs to a period, then later ones. Empty lists are left
 * out, but a moment with no lists at all shows an empty Depended on list. A
 * period has Moments, its stops in date order, and Part of when it belongs
 * to a larger period.
 */
export class ListSetBuilder {
  constructor(private readonly dataset: Dataset) {}

  build(entry: Entry): RelationshipList[] {
    const partOf = this.dataset.partOf(entry);
    const partOfList = partOf.length > 0 ? [new RelationshipList(ListKind.PartOf, partOf)] : [];
    if (entry instanceof Period) {
      const stops = entry.isOngoing ? [...entry.stops, new OngoingStop()] : entry.stops;
      return [new RelationshipList(ListKind.Moments, stops), ...partOfList];
    }
    if (entry instanceof Moment) {
      const graph = this.dataset.graph;
      const earlier = [...EARLIER_LISTS].map(([kind, link]) =>
        RelationshipList.ofLinks(kind, graph.earlierLinks(entry, link), true),
      );
      const later = [...LATER_LISTS].map(([kind, link]) => RelationshipList.ofLinks(kind, graph.laterLinks(entry, link), false));
      const lists = [...earlier, ...partOfList, ...later].filter((l) => l.size > 0);
      return lists.length > 0 ? lists : [new RelationshipList(ListKind.DependedOn, [])];
    }
    return [];
  }
}
