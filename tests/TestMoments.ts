import { Dataset } from '../src/core/data/Dataset';
import { DatePrecision } from '../src/core/dates/DatePrecision';
import { HistoricDate } from '../src/core/dates/HistoricDate';
import { LinkGraph } from '../src/core/graph/LinkGraph';
import { Entry } from '../src/core/model/Entry';
import { Link } from '../src/core/model/Link';
import { LinkKind } from '../src/core/model/LinkKind';
import { Moment } from '../src/core/model/Moment';
import { Period } from '../src/core/model/Period';

/** A link for tests: the later moment's id, the earlier one's, and optionally the kind. */
export type TestLink = [string, string, LinkKind?];

/** Builds small moments, periods and datasets for tests. */
export class TestMoments {
  static moment(id: string, year: number, precision = DatePrecision.Year, approximate = false): Moment {
    return new Moment(id, id, new HistoricDate(year, precision, approximate), `About ${id}.`, []);
  }

  static period(id: string, start: Moment, end: Moment | undefined, members: Entry[] = []): Period {
    return new Period(id, id, `About ${id}.`, [], start, end, members);
  }

  /** `links` are [later, earlier] pairs of ids, with the kind of link if it isn't "depends on". */
  static graph(moments: Moment[], links: TestLink[]): LinkGraph {
    const byId = new Map(moments.map((m) => [m.id, m]));
    return new LinkGraph(
      moments,
      links.map(([later, earlier, kind]) => new Link(byId.get(later)!, byId.get(earlier)!, kind)),
    );
  }

  static dataset(moments: Moment[], links: TestLink[], periods: Period[] = []): Dataset {
    return new Dataset(TestMoments.graph(moments, links), periods);
  }
}
