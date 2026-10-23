import { describe, expect, it } from 'vitest';
import { WikidataDateReader } from '../../src/import/WikidataDateReader';
import { TestItems } from './TestItems';

const reader = new WikidataDateReader();

describe('WikidataDateReader', () => {
  it('reads a day', () => {
    expect(reader.read(TestItems.time('+2007-01-09', 11))).toEqual({ year: 2007, precision: 'day', month: 1, day: 9 });
  });

  it('reads a month', () => {
    expect(reader.read(TestItems.time('+1947-12-00', 10))).toEqual({ year: 1947, precision: 'month', month: 12 });
  });

  it('reads a year and a century', () => {
    expect(reader.read(TestItems.time('+1991-00-00', 9))).toEqual({ year: 1991, precision: 'year' });
    expect(reader.read(TestItems.time('+1900-00-00', 7))).toEqual({ year: 1900, precision: 'century' });
  });

  it('turns a BCE year into an astronomical one', () => {
    // Wikidata writes 509 BCE as -0509, which is astronomical year -508 (DES-DATE-001).
    expect(reader.read(TestItems.time('-0509-00-00', 9))).toEqual({ year: -508, precision: 'year' });
  });

  it('marks a date given as circa as approximate', () => {
    expect(reader.read(TestItems.time('+1450-00-00', 9, true))).toEqual({ year: 1450, precision: 'year', approximate: true });
  });

  it('falls back to the year when a month date has no month', () => {
    expect(reader.read(TestItems.time('+1800-00-00', 10))).toEqual({ year: 1800, precision: 'year' });
  });

  it('gives nothing for a date rougher than a millennium', () => {
    expect(reader.read(TestItems.time('-10000-00-00', 5))).toBeUndefined();
  });

  it('gives nothing for a statement that is not a date', () => {
    expect(reader.read(TestItems.link('Q1'))).toBeUndefined();
  });
});
