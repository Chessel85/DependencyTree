import { Moment } from '../model/Moment';
import { DependencyGraph } from './DependencyGraph';

/** Finds chains of dependencies that lead back to where they started (DES-REL-005). */
export class CycleDetector {
  /** Each cycle found, as the moments along it. Empty when there are none. */
  findCycles(graph: DependencyGraph): Moment[][] {
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
      for (const dependency of graph.dependenciesOf(moment)) {
        visit(dependency);
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
