import { LinkKind } from '../core/model/LinkKind';
import { CuratedLink, Curation } from './Curation';
import { ImportedGraph, ImportedLink } from './ImportedGraph';
import { ImportLog } from './ImportLog';

/** Applies the curation file's links and memberships to what the walk gathered (DES-IMP-004). */
export class CurationApplier {
  constructor(
    private readonly curation: Curation,
    private readonly log: ImportLog,
  ) {}

  apply(graph: ImportedGraph): void {
    for (const link of this.curation.removeLinks) {
      const removed = graph.linksBetween(link.later, link.earlier).filter((l) => !link.kind || l.kind === link.kind);
      removed.forEach((l) => graph.links.splice(graph.links.indexOf(l), 1));
      if (removed.length === 0) {
        this.log.curation.push(`The link from ${link.later} to ${link.earlier} to be removed isn't in Wikidata.`);
      }
    }
    for (const link of this.curation.addLinks) {
      this.addLink(graph, link);
    }
    for (const membership of this.curation.addMembers) {
      graph.memberships.push({ period: membership.period, member: membership.member, source: 'curation' });
    }
    for (const id of Object.keys(this.curation.record.entries ?? {})) {
      if (!graph.has(id) && !this.curation.isExcluded(id)) {
        this.log.curation.push(`The corrections to ${id} weren't used, because it isn't in the seed set.`);
      }
    }
  }

  /**
   * Adds a link, or, if Wikidata already joins the two items, gives that link
   * the curated kind, strength, note and period end. The log notes a curated
   * link that adds nothing Wikidata doesn't have.
   */
  private addLink(graph: ImportedGraph, curated: CuratedLink): void {
    const { later, earlier, kind, ...details } = curated;
    const wanted: ImportedLink = { later, earlier, kind: (kind ?? LinkKind.DependsOn) as LinkKind, source: 'curation', ...details };
    const existing = graph.linksBetween(later, earlier);
    if (existing.length === 0) {
      graph.links.push(wanted);
      return;
    }
    const changes = kind !== undefined && existing.some((l) => l.kind !== wanted.kind);
    if (!changes && Object.keys(details).length === 0) {
      this.log.curation.push(`The link from ${later} to ${earlier} is now in Wikidata, so needn't be added.`);
    }
    for (const link of existing) {
      Object.assign(link, kind === undefined ? {} : { kind: wanted.kind }, details);
    }
  }
}
