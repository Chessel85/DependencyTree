import { DatePrecision } from './DatePrecision';
import { DateRange } from './DateRange';

const MONTH_SPAN = 1 / 12;
const DAY_SPAN = MONTH_SPAN / 31;

/**
 * A date with a precision and an approximate flag. Years are astronomical:
 * 1 BCE is year 0, 2 BCE is year -1, and so on (DES-DATE-001).
 */
export class HistoricDate {
  constructor(
    readonly year: number,
    readonly precision: DatePrecision,
    readonly approximate = false,
    readonly month?: number,
    readonly day?: number,
  ) {
    if (precision === DatePrecision.Month || precision === DatePrecision.Day) {
      if (month === undefined || month < 1 || month > 12) {
        throw new Error(`A ${precision} date needs a month from 1 to 12, but got ${month}.`);
      }
    }
    if (precision === DatePrecision.Day && (day === undefined || day < 1 || day > 31)) {
      throw new Error(`A day date needs a day from 1 to 31, but got ${day}.`);
    }
  }

  /** The earliest and latest times this date could mean, widened if approximate. */
  range(): DateRange {
    const exact = this.exactRange();
    return this.approximate ? exact.widenedBy(exact.latest - exact.earliest) : exact;
  }

  private exactRange(): DateRange {
    switch (this.precision) {
      case DatePrecision.Day: {
        const start = this.year + (this.month! - 1) * MONTH_SPAN + (this.day! - 1) * DAY_SPAN;
        return new DateRange(start, start + DAY_SPAN);
      }
      case DatePrecision.Month: {
        const start = this.year + (this.month! - 1) * MONTH_SPAN;
        return new DateRange(start, start + MONTH_SPAN);
      }
      case DatePrecision.Year:
        return new DateRange(this.year, this.year + 1);
      case DatePrecision.Decade: {
        const start = Math.floor(this.year / 10) * 10;
        return new DateRange(start, start + 10);
      }
      case DatePrecision.Century:
        return HistoricDate.countedSpan(this.year, 100);
      case DatePrecision.Millennium:
        return HistoricDate.countedSpan(this.year, 1000);
    }
  }

  /**
   * Centuries and millennia are counted from year 1, so the 19th century is
   * 1801 to 1900, and the 5th century BCE is 500 BCE to 401 BCE.
   */
  private static countedSpan(year: number, size: number): DateRange {
    if (year >= 1) {
      const ordinal = Math.floor((year - 1) / size) + 1;
      const start = (ordinal - 1) * size + 1;
      return new DateRange(start, start + size);
    }
    const yearBce = 1 - year;
    const ordinal = Math.floor((yearBce - 1) / size) + 1;
    const start = 1 - ordinal * size;
    return new DateRange(start, start + size);
  }

  /** The number of the century or millennium this date falls in, counting BCE ones separately. */
  ordinal(size: number): number {
    const counted = this.year >= 1 ? this.year : 1 - this.year;
    return Math.floor((counted - 1) / size) + 1;
  }
}
