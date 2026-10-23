import { DatasetReader, DatasetRecord, MomentRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { ContainmentRule } from '../core/graph/ContainmentRule';
import { CycleDetector } from '../core/graph/CycleDetector';
import { PredatesRule } from '../core/graph/PredatesRule';
import { Moment } from '../core/model/Moment';
import { ImportLog, LinkNote } from './ImportLog';

/**
 * Checks the dataset with the same rules the app uses, and leaves out what
 * breaks them, noting each one for the report (DES-IMP-007): links whose
 * earlier end came later (DES-REL-002), circular links (DES-REL-005), and
 * entries outside their period (DES-DATA-006).
 */
export class ImportValidator {
  private readonly reader = new DatasetReader();
  private readonly formatter = new DateFormatter();

  constructor(private readonly log: ImportLog) {}

  validate(record: DatasetRecord): void {
    this.removeLaterLinks(record);
    this.breakCycles(record);
    this.removeOutsiders(record);
  }

  private removeLaterLinks(record: DatasetRecord): void {
    const graph = this.reader.read(record).graph;
    for (const link of new PredatesRule().breaches(graph.links)) {
      this.log.predates.push({
        ...this.unlink(record, link.later, link.earlier),
        laterDate: this.formatter.written(link.later.date),
        earlierDate: this.formatter.written(link.earlier.date),
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
      this.log.cycles.push({
        moments: cycle.map((m) => m.name),
        removed: this.unlink(record, last, cycle[0]),
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

  /** Leaves out one link, and names it for the report. */
  private unlink(record: DatasetRecord, later: Moment, earlier: Moment): LinkNote {
    const moment: MomentRecord = record.moments.find((m) => m.id === later.id)!;
    const link = moment.links!.find((l) => l.to === earlier.id)!;
    moment.links = moment.links!.filter((l) => l !== link);
    return { later: later.name, earlier: earlier.name, kind: link.kind, source: link.source ?? 'unknown' };
  }
}
