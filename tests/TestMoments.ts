import { Dataset } from '../src/core/data/Dataset';
import { DatePrecision } from '../src/core/dates/DatePrecision';
import { HistoricDate } from '../src/core/dates/HistoricDate';
import { DependencyGraph } from '../src/core/graph/DependencyGraph';
import { Dependency } from '../src/core/model/Dependency';
import { Entry } from '../src/core/model/Entry';
import { Moment } from '../src/core/model/Moment';
import { Period } from '../src/core/model/Period';

/** Builds small moments, periods and datasets for tests. */
export class TestMoments {
  static moment(id: string, year: number, precision = DatePrecision.Year, approximate = false): Moment {
    return new Moment(id, id, new HistoricDate(year, precision, approximate), `About ${id}.`, []);
  }

  static period(id: string, start: Moment, end: Moment | undefined, members: Entry[] = []): Period {
    return new Period(id, id, `About ${id}.`, [], start, end, members);
  }

  /** `links` are [dependent, dependency] pairs of ids. */
  static graph(moments: Moment[], links: [string, string][]): DependencyGraph {
    const byId = new Map(moments.map((m) => [m.id, m]));
    return new DependencyGraph(
      moments,
      links.map(([dependent, dependency]) => new Dependency(byId.get(dependent)!, byId.get(dependency)!)),
    );
  }

  static dataset(moments: Moment[], links: [string, string][], periods: Period[] = []): Dataset {
    return new Dataset(TestMoments.graph(moments, links), periods);
  }
}
