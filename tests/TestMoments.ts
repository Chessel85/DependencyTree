import { DatePrecision } from '../src/core/dates/DatePrecision';
import { HistoricDate } from '../src/core/dates/HistoricDate';
import { DependencyGraph } from '../src/core/graph/DependencyGraph';
import { Dependency } from '../src/core/model/Dependency';
import { Moment } from '../src/core/model/Moment';

/** Builds small moments and graphs for tests. */
export class TestMoments {
  static moment(id: string, year: number, precision = DatePrecision.Year, approximate = false): Moment {
    return new Moment(id, id, new HistoricDate(year, precision, approximate), `About ${id}.`, []);
  }

  /** `links` are [dependent, dependency] pairs of ids. */
  static graph(moments: Moment[], links: [string, string][]): DependencyGraph {
    const byId = new Map(moments.map((m) => [m.id, m]));
    return new DependencyGraph(
      moments,
      links.map(([dependent, dependency]) => new Dependency(byId.get(dependent)!, byId.get(dependency)!)),
    );
  }
}
