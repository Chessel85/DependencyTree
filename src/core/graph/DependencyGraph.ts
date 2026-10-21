import { Dependency } from '../model/Dependency';
import { Moment } from '../model/Moment';

/** All moments and the dependencies between them, with lookups in both directions. */
export class DependencyGraph {
  private readonly moments = new Map<string, Moment>();
  private readonly dependenciesOfId = new Map<string, Moment[]>();
  private readonly enabledById = new Map<string, Moment[]>();

  constructor(moments: readonly Moment[], readonly dependencies: readonly Dependency[]) {
    for (const moment of moments) {
      if (this.moments.has(moment.id)) {
        throw new Error(`Two moments have the id "${moment.id}".`);
      }
      this.moments.set(moment.id, moment);
      this.dependenciesOfId.set(moment.id, []);
      this.enabledById.set(moment.id, []);
    }
    for (const link of dependencies) {
      this.dependenciesOfId.get(link.dependent.id)!.push(link.dependency);
      this.enabledById.get(link.dependency.id)!.push(link.dependent);
    }
  }

  get allMoments(): Moment[] {
    return [...this.moments.values()];
  }

  find(id: string): Moment | undefined {
    return this.moments.get(id);
  }

  /** What this moment needed. */
  dependenciesOf(moment: Moment): Moment[] {
    return [...(this.dependenciesOfId.get(moment.id) ?? [])];
  }

  /** What this moment made possible. */
  enabledBy(moment: Moment): Moment[] {
    return [...(this.enabledById.get(moment.id) ?? [])];
  }
}
