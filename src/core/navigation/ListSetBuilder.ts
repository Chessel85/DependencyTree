import { DependencyGraph } from '../graph/DependencyGraph';
import { Moment } from '../model/Moment';
import { ListKind } from './ListKind';
import { RelationshipList } from './RelationshipList';

/**
 * Decides which lists a moment shows (DES-NAV-002, DES-NAV-003). Dependencies
 * and Enabled are always present, even when empty. Part of arrives with
 * periods, in Step 0B.
 */
export class ListSetBuilder {
  constructor(private readonly graph: DependencyGraph) {}

  build(moment: Moment): RelationshipList[] {
    return [
      new RelationshipList(ListKind.Dependencies, this.graph.dependenciesOf(moment).sort(Moment.byDate)),
      new RelationshipList(ListKind.Enabled, this.graph.enabledBy(moment).sort(Moment.byDate)),
    ];
  }
}
