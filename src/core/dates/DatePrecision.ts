/** How precisely a date is known (DES-DATE-002). */
export enum DatePrecision {
  Millennium = 'millennium',
  Century = 'century',
  Decade = 'decade',
  Year = 'year',
  Month = 'month',
  Day = 'day',
}

const ORDER = [
  DatePrecision.Millennium,
  DatePrecision.Century,
  DatePrecision.Decade,
  DatePrecision.Year,
  DatePrecision.Month,
  DatePrecision.Day,
];

/** True if `a` is less precise than `b`, for example a year is coarser than a day. */
export function isCoarser(a: DatePrecision, b: DatePrecision): boolean {
  return ORDER.indexOf(a) < ORDER.indexOf(b);
}
