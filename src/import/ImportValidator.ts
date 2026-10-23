import { DatasetReader, DatasetRecord, MomentRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { ContainmentRule } from '../core/graph/ContainmentRule';
import { CycleDetector } from '../core/graph/CycleDetector';
import { PredatesRule } from '../core/graph/PredatesRule';
import { Moment } from '../core/model/Moment';
import { ImportLog } from './ImportLog';

/**
 * Checks the dataset with the same rules the app uses, and leaves out what
 * breaks them, noting each one for the report (DES-IMP-007): dependencies
 * that came later than what depends on them (DES-REL-002), circular
 * dependencies (DES-REL-005), and entries outside their period (DES-DATA-006).
 */
export class ImportValidator {
  private readonly reader = new DatasetReader();
  private readonly formatter = new DateFormatter();

  constructor(private readonly log: ImportLog) {}

  validate(record: DatasetRecord): void {
    this.removeLaterDependencies(record);
    this.breakCycles(record);
    this.removeOutsiders(record);
  }

  private removeLaterDependencies(record: DatasetRecord): void {
    const graph = this.reader.read(record).graph;
    for (const link of new PredatesRule().breaches(graph.dependencies)) {
      const source = this.unlink(record, link.dependent, link.dependency);
      this.log.predates.push({
        dependent: link.dependent.name,
        dependency: link.dependency.name,
        source,
        dependentDate: this.formatter.written(link.dependent.date),
        dependencyDate: this.formatter.written(link.dependency.date),
      });
    }
  }

  /** Breaks each circle by leaving out the link that closes it, until none are left. */
  private breakCycles(record: DatasetRecord): void {
    const detector = new CycleDetector();
    for (;;) {
      const [cycle] = detector.findCycles(this.reader.read(record).graph);
      if (!cycle) {
        return;
      }
      const last = cycle[cycle.length - 1];
      const source = this.unlink(record, last, cycle[0]);
      this.log.cycles.push({
        moments: cycle.map((m) => m.name),
        removed: { dependent: last.name, dependency: cycle[0].name, source },
      });
    }
  }

  private removeOutsiders(record: DatasetRecord): void {
    const rule = new ContainmentRule();
    for (const period of this.reader.read(record).periods) {
      const periodRecord = record.periods!.find((p) => p.id === period.id)!;
      for (const member of rule.breaches(period)) {
        periodRecord.contains = periodRecord.contains!.filter((id) => id !== member.id);
        this.log.outsidePeriod.push({ period: period.name, member: member.name });
      }
    }
  }

  /** Leaves out one dependency, and gives the source it came from. */
  private unlink(record: DatasetRecord, dependent: Moment, dependency: Moment): string {
    const moment: MomentRecord = record.moments.find((m) => m.id === dependent.id)!;
    moment.dependsOn = moment.dependsOn!.filter((id) => id !== dependency.id);
    const source = moment.linkSources?.[dependency.id] ?? 'unknown';
    if (moment.linkSources) {
      delete moment.linkSources[dependency.id];
    }
    return source;
  }
}
