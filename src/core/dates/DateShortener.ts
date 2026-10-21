import { DatePrecision } from './DatePrecision';
import { HistoricDate } from './HistoricDate';

/**
 * Shortens dates in lists and labels by how far they are from today
 * (DES-DATE-006):
 * - more than 3 years away: the year only, such as "2007";
 * - more than 12 months but at most 3 years away: month and year, such as "March 2024";
 * - within 12 months: the full date, as precisely as it is known.
 * Dates known only to a decade or coarser are left as they are.
 */
export class DateShortener {
  constructor(private readonly today: HistoricDate) {}

  shorten(date: HistoricDate): HistoricDate {
    const yearsAway = Math.abs(this.today.range().earliest - date.range().earliest);
    if (yearsAway > 3) {
      return date.atPrecision(DatePrecision.Year);
    }
    if (yearsAway > 1) {
      return date.atPrecision(DatePrecision.Month);
    }
    return date;
  }
}
