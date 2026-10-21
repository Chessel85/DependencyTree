/**
 * The span of possible times a date could mean (DES-DATE-003), measured in
 * fractional astronomical years. `earliest` is included; `latest` is the first
 * moment after the span, so it is excluded.
 */
export class DateRange {
  constructor(
    readonly earliest: number,
    readonly latest: number,
  ) {}

  /** True only if every possible time in this range is after every possible time in `other`. */
  isCertainlyAfter(other: DateRange): boolean {
    return this.earliest >= other.latest;
  }

  widenedBy(amount: number): DateRange {
    return new DateRange(this.earliest - amount, this.latest + amount);
  }
}
