import { DatePrecision } from './DatePrecision';
import { HistoricDate } from './HistoricDate';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Writes dates in natural form, for reading and for speaking (DES-DATE-004). */
export class DateFormatter {
  /** For the screen: "c. 509 BCE". */
  written(date: HistoricDate): string {
    return date.approximate ? `c. ${this.plain(date)}` : this.plain(date);
  }

  /** For announcements: "around 509 BCE". */
  spoken(date: HistoricDate): string {
    return date.approximate ? `around ${this.plain(date)}` : this.plain(date);
  }

  private plain(date: HistoricDate): string {
    switch (date.precision) {
      case DatePrecision.Day:
        return `${date.day} ${MONTH_NAMES[date.month! - 1]} ${this.yearText(date.year)}`;
      case DatePrecision.Month:
        return `${MONTH_NAMES[date.month! - 1]} ${this.yearText(date.year)}`;
      case DatePrecision.Year:
        return this.yearText(date.year);
      case DatePrecision.Decade:
        return this.decadeText(date.year);
      case DatePrecision.Century:
        return `${this.ordinalText(date.ordinal(100))} century${this.eraSuffix(date.year)}`;
      case DatePrecision.Millennium:
        return `${this.ordinalText(date.ordinal(1000))} millennium${this.eraSuffix(date.year)}`;
    }
  }

  private yearText(year: number): string {
    return year >= 1 ? String(year) : `${1 - year} BCE`;
  }

  private decadeText(year: number): string {
    if (year >= 1) {
      return `${Math.floor(year / 10) * 10}s`;
    }
    return `${Math.floor((1 - year) / 10) * 10}s BCE`;
  }

  private eraSuffix(year: number): string {
    return year >= 1 ? '' : ' BCE';
  }

  private ordinalText(n: number): string {
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 13) {
      return `${n}th`;
    }
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
}
