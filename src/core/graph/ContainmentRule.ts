import { DateRange } from '../dates/DateRange';
import { Entry } from '../model/Entry';
import { Moment } from '../model/Moment';
import { Period } from '../model/Period';

/**
 * Everything in a period must fall between its start and end moments,
 * allowing for uncertainty in the dates (DES-DATA-006). For a smaller
 * period, that applies to its own start and end moments.
 */
export class ContainmentRule {
  /** The members of this period that certainly fall outside it. */
  breaches(period: Period): Entry[] {
    return period.members.filter((member) => !this.fits(member, period));
  }

  private fits(member: Entry, period: Period): boolean {
    const moments: Moment[] =
      member instanceof Period ? [member.start, ...(member.end ? [member.end] : [])] : member instanceof Moment ? [member] : [];
    return moments.every((m) => this.within(m.date.range(), period));
  }

  private within(range: DateRange, period: Period): boolean {
    const afterStart = !period.start.date.range().isCertainlyAfter(range);
    const beforeEnd = !period.end || !range.isCertainlyAfter(period.end.date.range());
    return afterStart && beforeEnd;
  }
}
