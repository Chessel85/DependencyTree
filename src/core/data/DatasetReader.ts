import { DatePrecision } from '../dates/DatePrecision';
import { HistoricDate } from '../dates/HistoricDate';
import { DependencyGraph } from '../graph/DependencyGraph';
import { Dependency } from '../model/Dependency';
import { Moment } from '../model/Moment';

/** A date as written in a dataset file. Years are astronomical (DES-DATE-001). */
export interface DateRecord {
  year: number;
  precision: `${DatePrecision}`;
  month?: number;
  day?: number;
  approximate?: boolean;
}

/** A moment as written in a dataset file. */
export interface MomentRecord {
  id: string;
  name: string;
  date: DateRecord;
  description: string;
  tags: string[];
  location?: string;
  dependsOn?: string[];
}

export interface DatasetRecord {
  moments: MomentRecord[];
}

/** Turns a dataset file's contents into a dependency graph. */
export class DatasetReader {
  read(record: DatasetRecord): DependencyGraph {
    const moments = record.moments.map((m) => this.toMoment(m));
    const byId = new Map(moments.map((m) => [m.id, m]));
    const links: Dependency[] = [];
    for (const m of record.moments) {
      for (const dependencyId of m.dependsOn ?? []) {
        const dependency = byId.get(dependencyId);
        if (!dependency) {
          throw new Error(`"${m.id}" depends on "${dependencyId}", which isn't in the dataset.`);
        }
        links.push(new Dependency(byId.get(m.id)!, dependency));
      }
    }
    return new DependencyGraph(moments, links);
  }

  private toMoment(m: MomentRecord): Moment {
    const date = new HistoricDate(
      m.date.year,
      m.date.precision as DatePrecision,
      m.date.approximate ?? false,
      m.date.month,
      m.date.day,
    );
    return new Moment(m.id, m.name, date, m.description, m.tags, m.location);
  }
}
