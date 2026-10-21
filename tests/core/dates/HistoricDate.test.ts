import { describe, expect, it } from 'vitest';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { HistoricDate } from '../../../src/core/dates/HistoricDate';

describe('HistoricDate', () => {
  it('treats a year as the whole of that year', () => {
    const range = new HistoricDate(1991, DatePrecision.Year).range();
    expect(range.earliest).toBe(1991);
    expect(range.latest).toBe(1992);
  });

  it('counts the 19th century as 1801 to 1900', () => {
    const range = new HistoricDate(1850, DatePrecision.Century).range();
    expect(range.earliest).toBe(1801);
    expect(range.latest).toBe(1901);
  });

  it('counts the 5th century BCE as 500 BCE to 401 BCE', () => {
    // 450 BCE is astronomical year -449. 500 BCE is -499, and 401 BCE is -400.
    const range = new HistoricDate(-449, DatePrecision.Century).range();
    expect(range.earliest).toBe(-499);
    expect(range.latest).toBe(-399);
  });

  it('widens an approximate year by one year on each side', () => {
    const range = new HistoricDate(1450, DatePrecision.Year, true).range();
    expect(range.earliest).toBe(1449);
    expect(range.latest).toBe(1452);
  });

  it('places a day inside its month and year', () => {
    const range = new HistoricDate(2007, DatePrecision.Day, false, 1, 9).range();
    expect(range.earliest).toBeGreaterThan(2007);
    expect(range.latest).toBeLessThan(2007 + 1 / 12);
  });

  it('refuses a day date without a day', () => {
    expect(() => new HistoricDate(2007, DatePrecision.Day, false, 1)).toThrow();
  });
});
