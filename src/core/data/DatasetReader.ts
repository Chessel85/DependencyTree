import { DatePrecision } from '../dates/DatePrecision';
import { HistoricDate } from '../dates/HistoricDate';
import { LinkGraph } from '../graph/LinkGraph';
import { Entry } from '../model/Entry';
import { CauseStrength, Link } from '../model/Link';
import { LinkKind } from '../model/LinkKind';
import { Moment } from '../model/Moment';
import { Period } from '../model/Period';
import { Dataset } from './Dataset';

/** A date as written in a dataset file. Years are astronomical (DES-DATE-001). */
export interface DateRecord {
  year: number;
  precision: `${DatePrecision}`;
  month?: number;
  day?: number;
  approximate?: boolean;
}

/** A link as written in a dataset file, on the later moment: it names the earlier one (DES-REL-001). */
export interface LinkRecord {
  to: string;
  kind: `${LinkKind}`;
  strength?: CauseStrength;
  note?: string;
  /** Where the link came from: a Wikidata property, or "curation" (DES-IMP-003). */
  source?: string;
}

/** A moment as written in a dataset file. */
export interface MomentRecord {
  id: string;
  name: string;
  date: DateRecord;
  description: string;
  tags: string[];
  location?: string;
  /** True for an idea, such as revanchism (DES-DATA-009). */
  idea?: boolean;
  links?: LinkRecord[];
  /** The Wikidata item this moment was imported from (DES-DATA-005). */
  wikidata?: string;
}

/**
 * A period as written in a dataset file. `start` and `end` name moments.
 * `contains` names the moments and smaller periods between them. A period
 * still going on has no `end`.
 */
export interface PeriodRecord {
  id: string;
  name: string;
  description: string;
  tags: string[];
  start: string;
  end?: string;
  contains?: string[];
  /** The Wikidata item this period was imported from (DES-DATA-005). */
  wikidata?: string;
}

export interface DatasetRecord {
  /** The entry to open first. */
  start?: string;
  moments: MomentRecord[];
  periods?: PeriodRecord[];
}

/** Turns a dataset file's contents into a dataset. */
export class DatasetReader {
  read(record: DatasetRecord): Dataset {
    const graph = this.readMoments(record.moments);
    const periods = this.readPeriods(record.periods ?? [], graph);
    return new Dataset(graph, periods);
  }

  private readMoments(records: MomentRecord[]): LinkGraph {
    const moments = records.map((m) => this.toMoment(m));
    const byId = new Map(moments.map((m) => [m.id, m]));
    const links: Link[] = [];
    for (const m of records) {
      for (const link of m.links ?? []) {
        const earlier = byId.get(link.to);
        if (!earlier) {
          throw new Error(`"${m.id}" ${link.kind} "${link.to}", which isn't in the dataset.`);
        }
        links.push(new Link(byId.get(m.id)!, earlier, link.kind as LinkKind, link.strength, link.note));
      }
    }
    return new LinkGraph(moments, links);
  }

  /** Builds periods smaller ones first, since a period needs the periods it contains. */
  private readPeriods(records: PeriodRecord[], graph: LinkGraph): Period[] {
    const recordsById = new Map(records.map((p) => [p.id, p]));
    const built = new Map<string, Period>();
    const building = new Set<string>();

    const build = (record: PeriodRecord): Period => {
      const done = built.get(record.id);
      if (done) {
        return done;
      }
      if (building.has(record.id)) {
        throw new Error(`Period "${record.id}" contains itself.`);
      }
      building.add(record.id);
      const moment = (id: string): Moment => {
        const found = graph.find(id);
        if (!found) {
          throw new Error(`Period "${record.id}" refers to "${id}", which isn't a moment in the dataset.`);
        }
        return found;
      };
      const member = (id: string): Entry => {
        const sub = recordsById.get(id);
        return sub ? build(sub) : moment(id);
      };
      const period = new Period(
        record.id,
        record.name,
        record.description,
        record.tags,
        moment(record.start),
        record.end === undefined ? undefined : moment(record.end),
        (record.contains ?? []).map(member),
      );
      building.delete(record.id);
      built.set(record.id, period);
      return period;
    };

    return records.map(build);
  }

  private toMoment(m: MomentRecord): Moment {
    const date = new HistoricDate(
      m.date.year,
      m.date.precision as DatePrecision,
      m.date.approximate ?? false,
      m.date.month,
      m.date.day,
    );
    return new Moment(m.id, m.name, date, m.description, m.tags, m.location, m.idea ?? false);
  }
}
