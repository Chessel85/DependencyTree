import { describe, expect, it } from 'vitest';
import { AnnouncementBuilder } from '../../../src/core/announce/AnnouncementBuilder';
import { DateFormatter } from '../../../src/core/dates/DateFormatter';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { DateShortener } from '../../../src/core/dates/DateShortener';
import { HistoricDate } from '../../../src/core/dates/HistoricDate';
import { Link } from '../../../src/core/model/Link';
import { LinkKind } from '../../../src/core/model/LinkKind';
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
  it('labels the list on arrival at a moment with "Event:", the entry and the list name', () => {
    expect(words.arrivalLabel(laptopState())).toBe('Event: laptop, 1981, Depended on');
  });

  it('labels the list on arrival at a period without "Event:"', () => {
    const dataset = TestMoments.dataset([TestMoments.moment('start', 1947), TestMoments.moment('end', 1991)], []);
    const war = TestMoments.period('war', dataset.find('start') as Moment, dataset.find('end') as Moment);
    const state = new NavigationState(new ListSetBuilder(dataset), war);
    expect(words.arrivalLabel(state)).toBe('war, 1947 to 1991, Moments');
  });

  it('labels the list after switching tab with just the list name', () => {
    expect(words.switchLabel(laptopState())).toBe('Depended on');
  });

  it('gives a moment with no links an empty Depended on list', () => {
    const dataset = TestMoments.dataset([TestMoments.moment('alone', 1900)], []);
    const state = new NavigationState(new ListSetBuilder(dataset), dataset.find('alone')!);
    expect(words.switchLabel(state)).toBe('Depended on');
    expect(words.summary(state)).toBe('Event: alone, 1900. Depended on, none.');
  });

  it('names a tab with its count', () => {
    expect(words.tab(laptopState().activeList)).toBe('Depended on (2)');
  });

  it('puts the name, date and location on separate lines of the summary box', () => {
    expect(words.summaryLines(laptopState().currentEntry)).toBe('Event: laptop\n1981\nLocation not known');
  });

  it('gives a moment in a relationship list a shortened date and no "Event:"', () => {
    const iphone = new Moment('iphone', 'iPhone', new HistoricDate(2007, DatePrecision.Day, false, 1, 9), '', []);
    expect(words.entry(iphone)).toBe('iPhone, 2007');
  });

  it('gives a moment in the index "Event:"', () => {
    const iphone = new Moment('iphone', 'iPhone', new HistoricDate(2007, DatePrecision.Day, false, 1, 9), '', []);
    expect(words.titledEntry(iphone)).toBe('Event: iPhone, 2007');
  });

  it('titles a moment with "Event:" and a period with just its name', () => {
    const start = TestMoments.moment('start', 1947);
    expect(words.title(start)).toBe('Event: start');
    expect(words.title(TestMoments.period('war', start, undefined))).toBe('war');
  });

  it('gives a period its range of dates, and "present" if still going on', () => {
    const start = TestMoments.moment('start', 1947);
    const end = TestMoments.moment('end', 1991);
    expect(words.entry(TestMoments.period('war', start, end))).toBe('war, 1947 to 1991');
    expect(words.entry(TestMoments.period('era', start, undefined))).toBe('era, 1947 to present');
  });

  it('summarises the entry and its lists', () => {
    expect(words.summary(laptopState())).toBe('Event: laptop, 1981. Depended on, 2.');
  });

  it('titles an idea with "Idea:"', () => {
    const idea = new Moment('revanchism', 'Revanchism', new HistoricDate(1871, DatePrecision.Year), '', [], undefined, true);
    expect(words.title(idea)).toBe('Idea: Revanchism');
  });

  it("gives a cause's strength, and says when a link has a note (DES-ANN-013, DES-ANN-014)", () => {
    const war = TestMoments.moment('war', 1914);
    const crisis = TestMoments.moment('crisis', 1914);
    const link = new Link(war, crisis, LinkKind.CausedBy, 'immediate', 'It set off the war.');
    expect(words.entry(crisis, link)).toBe('crisis, 1914, immediate, note');
    expect(words.entry(crisis, new Link(war, crisis, LinkKind.CausedBy))).toBe('crisis, 1914');
    expect(words.note(link)).toBe('Note: It set off the war.');
    expect(words.note(undefined)).toBe('No note.');
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
