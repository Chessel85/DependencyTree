import { Curation } from './Curation';
import { ImportedGraph } from './ImportedGraph';
import { ImportLog } from './ImportLog';

/** Applies the curation file's links and memberships to what the walk gathered (DES-IMP-004). */
export class CurationApplier {
  constructor(
    private readonly curation: Curation,
    private readonly log: ImportLog,
  ) {}

  apply(graph: ImportedGraph): void {
    for (const link of this.curation.removeLinks) {
      const before = graph.links.length;
      const removed = graph.links.filter(
        (l) => graph.canonical(l.dependent) === graph.canonical(link.dependent) && graph.canonical(l.dependency) === graph.canonical(link.dependency),
      );
      removed.forEach((l) => graph.links.splice(graph.links.indexOf(l), 1));
      if (graph.links.length === before) {
        this.log.curation.push(`The link from ${link.dependent} to ${link.dependency} to be removed isn't in Wikidata.`);
      }
    }
    for (const link of this.curation.addLinks) {
      if (graph.hasLink(link.dependent, link.dependency)) {
        this.log.curation.push(`The link from ${link.dependent} to ${link.dependency} is now in Wikidata, so needn't be added.`);
      } else {
        graph.links.push({ dependent: link.dependent, dependency: link.dependency, source: 'curation' });
      }
    }
    for (const membership of this.curation.addMembers) {
      graph.memberships.push({ period: membership.period, member: membership.member, source: 'curation' });
    }
    for (const id of Object.keys(this.curation.record.entries ?? {})) {
      if (!graph.has(id)) {
        this.log.curation.push(`The corrections to ${id} weren't used, because it isn't in the seed set.`);
      }
    }
  }
}
