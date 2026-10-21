import { describe, expect, it } from 'vitest';
import { AnnouncementBuilder } from '../../../src/core/announce/AnnouncementBuilder';
import { DateFormatter } from '../../../src/core/dates/DateFormatter';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { DateShortener } from '../../../src/core/dates/DateShortener';
import { HistoricDate } from '../../../src/core/dates/HistoricDate';
import { Moment } from '../../../src/core/model/Moment';
import { ListSetBuilder } from '../../../src/core/navigation/ListSetBuilder';
import { NavigationState } from '../../../src/core/navigation/NavigationState';
import { TestMoments } from '../../TestMoments';

const today = new HistoricDate(2026, DatePrecision.Day, false, 10, 21);
const words = new AnnouncementBuilder(new DateFormatter(), new DateShortener(today));

function laptopState(): NavigationState {
  const dataset = TestMoments.dataset(
    [TestMoments.moment('battery', 1800), TestMoments.moment('chip', 1971), TestMoments.moment('laptop', 1981)],
    [['laptop', 'battery'], ['laptop', 'chip']],
  );
  return new NavigationState(new ListSetBuilder(dataset), dataset.find('laptop')!);
}

describe('AnnouncementBuilder', () => {
  it('labels the list on arrival with the entry and the list name', () => {
    expect(words.arrivalLabel(laptopState())).toBe('laptop, 1981, Dependencies');
  });

  it('labels the list after switching tab with just the list name', () => {
    expect(words.switchLabel(laptopState())).toBe('Dependencies');
  });

  it('adds "none" to the label of an empty list', () => {
    const state = laptopState();
    state.switchList(1);
    expect(words.switchLabel(state)).toBe('Enabled, none');
  });

  it('names a tab with its count', () => {
    expect(words.tab(laptopState().activeList)).toBe('Dependencies (2)');
  });

  it('puts the name, date and location on separate lines of the summary box', () => {
    expect(words.summaryLines(laptopState().currentEntry)).toBe('laptop\n1981\nLocation not known');
  });

  it('gives an entry in a list a shortened date', () => {
    const iphone = new Moment('iphone', 'iPhone', new HistoricDate(2007, DatePrecision.Day, false, 1, 9), '', []);
    expect(words.entry(iphone)).toBe('iPhone, 2007');
  });

  it('gives a period its range of dates, and "present" if still going on', () => {
    const start = TestMoments.moment('start', 1947);
    const end = TestMoments.moment('end', 1991);
    expect(words.entry(TestMoments.period('war', start, end))).toBe('war, 1947 to 1991');
    expect(words.entry(TestMoments.period('era', start, undefined))).toBe('era, 1947 to present');
  });

  it('summarises the entry and its lists', () => {
    expect(words.summary(laptopState())).toBe('laptop, 1981. Dependencies, 2. Enabled, none.');
  });

  it('announces the path oldest first, even when the user walked back in time', () => {
    const state = laptopState();
    state.stepEarlier();
    expect(words.path(state.path)).toBe('Path, 2 entries: battery, laptop.');
  });

  it('names each entry on the path once', () => {
    const state = laptopState();
    state.stepEarlier();
    state.switchList(1);
    state.stepLater();
    expect(words.path(state.path)).toBe('Path, 2 entries: battery, laptop.');
  });
});
