import { Dataset } from '../data/Dataset';
import { Entry } from '../model/Entry';
import { Moment } from '../model/Moment';
import { OngoingStop } from '../model/OngoingStop';
import { Period } from '../model/Period';
import { ListKind } from './ListKind';
import { RelationshipList } from './RelationshipList';

/**
 * Decides which lists an entry shows (DES-NAV-002, DES-NAV-003, DES-NAV-012).
 * A moment has Dependencies and Enabled, always, and Part of when it belongs
 * to a period. A period has Moments, its stops in date order, and Part of
 * when it belongs to a larger period.
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
      return [
        new RelationshipList(ListKind.Dependencies, graph.dependenciesOf(entry).sort(Entry.byDate)),
        ...partOfList,
        new RelationshipList(ListKind.Enabled, graph.enabledBy(entry).sort(Entry.byDate)),
      ];
    }
    return [];
  }
}
