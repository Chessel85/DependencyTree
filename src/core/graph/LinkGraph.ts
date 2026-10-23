import { Link } from '../model/Link';
import { LinkKind } from '../model/LinkKind';
import { Moment } from '../model/Moment';

/** All moments and the links between them, with lookups in both directions. */
export class LinkGraph {
  private readonly moments = new Map<string, Moment>();
  private readonly earlierById = new Map<string, Link[]>();
  private readonly laterById = new Map<string, Link[]>();

  constructor(moments: readonly Moment[], readonly links: readonly Link[]) {
    for (const moment of moments) {
      if (this.moments.has(moment.id)) {
        throw new Error(`Two moments have the id "${moment.id}".`);
      }
      this.moments.set(moment.id, moment);
      this.earlierById.set(moment.id, []);
      this.laterById.set(moment.id, []);
    }
    for (const link of links) {
      this.earlierById.get(link.later.id)!.push(link);
      this.laterById.get(link.earlier.id)!.push(link);
    }
  }

  get allMoments(): Moment[] {
    return [...this.moments.values()];
  }

  find(id: string): Moment | undefined {
    return this.moments.get(id);
  }

  /** The links from this moment back to earlier ones: what it depended on, was caused by or was influenced by. */
  earlierLinks(moment: Moment, kind?: LinkKind): Link[] {
    return (this.earlierById.get(moment.id) ?? []).filter((l) => kind === undefined || l.kind === kind);
  }

  /** The links from this moment on to later ones: what it enabled, caused or influenced. */
  laterLinks(moment: Moment, kind?: LinkKind): Link[] {
    return (this.laterById.get(moment.id) ?? []).filter((l) => kind === undefined || l.kind === kind);
  }
}
