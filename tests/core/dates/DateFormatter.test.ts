import { describe, expect, it } from 'vitest';
import { DateFormatter } from '../../../src/core/dates/DateFormatter';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { HistoricDate } from '../../../src/core/dates/HistoricDate';

const formatter = new DateFormatter();

describe('DateFormatter', () => {
  it('writes a full date', () => {
    expect(formatter.written(new HistoricDate(2007, DatePrecision.Day, false, 1, 9))).toBe('9 January 2007');
  });

  it('writes a month', () => {
    expect(formatter.written(new HistoricDate(1989, DatePrecision.Month, false, 3))).toBe('March 1989');
  });

  it('writes BCE years', () => {
    expect(formatter.written(new HistoricDate(-508, DatePrecision.Year))).toBe('509 BCE');
  });

  it('writes and speaks approximate dates differently', () => {
    const date = new HistoricDate(-508, DatePrecision.Year, true);
    expect(formatter.written(date)).toBe('c. 509 BCE');
    expect(formatter.spoken(date)).toBe('around 509 BCE');
  });

  it('writes centuries with ordinals', () => {
    expect(formatter.written(new HistoricDate(1850, DatePrecision.Century))).toBe('19th century');
    expect(formatter.written(new HistoricDate(2001, DatePrecision.Century))).toBe('21st century');
    expect(formatter.written(new HistoricDate(1150, DatePrecision.Century))).toBe('12th century');
    expect(formatter.written(new HistoricDate(-449, DatePrecision.Century))).toBe('5th century BCE');
  });

  it('writes decades', () => {
    expect(formatter.written(new HistoricDate(1994, DatePrecision.Decade))).toBe('1990s');
  });
});
