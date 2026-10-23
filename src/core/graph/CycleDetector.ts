import { Moment } from '../model/Moment';
import { LinkGraph } from './LinkGraph';

/** Finds chains of links, of any kind, that lead back to where they started (DES-REL-005). */
export class CycleDetector {
  /** Each cycle found, as the moments along it. Empty when there are none. */
  findCycles(graph: LinkGraph): Moment[][] {
    const cycles: Moment[][] = [];
    const finished = new Set<string>();
    const onPath: Moment[] = [];

    const visit = (moment: Moment): void => {
      const loopStart = onPath.indexOf(moment);
      if (loopStart >= 0) {
        cycles.push(onPath.slice(loopStart));
        return;
      }
      if (finished.has(moment.id)) {
        return;
      }
      onPath.push(moment);
      for (const link of graph.earlierLinks(moment)) {
        visit(link.earlier);
      }
      onPath.pop();
      finished.add(moment.id);
    };

    for (const moment of graph.allMoments) {
      visit(moment);
    }
    return cycles;
  }
}
