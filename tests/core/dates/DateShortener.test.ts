import { describe, expect, it } from 'vitest';
import { DateFormatter } from '../../../src/core/dates/DateFormatter';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { DateShortener } from '../../../src/core/dates/DateShortener';
import { HistoricDate } from '../../../src/core/dates/HistoricDate';

const today = new HistoricDate(2026, DatePrecision.Day, false, 10, 21);
const shortener = new DateShortener(today);
const formatter = new DateFormatter();
const shortened = (date: HistoricDate) => formatter.written(shortener.shorten(date));
const day = (year: number, month: number, d: number) => new HistoricDate(year, DatePrecision.Day, false, month, d);

describe('DateShortener', () => {
  it('gives only the year for dates more than 3 years ago', () => {
    expect(shortened(day(2007, 1, 9))).toBe('2007');
  });

  it('gives month and year for dates between 12 months and 3 years ago', () => {
    expect(shortened(day(2024, 3, 15))).toBe('March 2024');
  });

  it('gives the full date for dates within 12 months', () => {
    expect(shortened(day(2026, 2, 1))).toBe('1 February 2026');
  });

  it('treats future dates the same way', () => {
    expect(shortened(day(2028, 7, 14))).toBe('July 2028');
    expect(shortened(day(2030, 7, 14))).toBe('2030');
  });

  it('never makes a date more precise than it is known', () => {
    expect(shortened(new HistoricDate(2026, DatePrecision.Year))).toBe('2026');
    expect(shortened(new HistoricDate(1850, DatePrecision.Century))).toBe('19th century');
  });

  it('keeps an approximate date approximate', () => {
    expect(shortened(new HistoricDate(-508, DatePrecision.Year, true))).toBe('c. 509 BCE');
  });
});
