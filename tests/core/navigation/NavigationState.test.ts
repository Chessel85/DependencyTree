import { beforeEach, describe, expect, it } from 'vitest';
import { Dataset } from '../../../src/core/data/Dataset';
import { LinkKind } from '../../../src/core/model/LinkKind';
import { ListKind } from '../../../src/core/navigation/ListKind';
import { ListSetBuilder } from '../../../src/core/navigation/ListSetBuilder';
import { NavigationState } from '../../../src/core/navigation/NavigationState';
import { StepResult } from '../../../src/core/navigation/StepResult';
import { TestMoments } from '../../TestMoments';

// The phone (1876) depended on the battery (1800), and was influenced by the
// telegraph (1837), which was caused by the railway (1825). The smartphone
// (2007) depended on the phone and the chip (1971).
let dataset: Dataset;
let state: NavigationState;

beforeEach(() => {
  dataset = TestMoments.dataset(
    [
      TestMoments.moment('battery', 1800),
      TestMoments.moment('railway', 1825),
      TestMoments.moment('telegraph', 1837),
      TestMoments.moment('phone', 1876),
      TestMoments.moment('chip', 1971),
      TestMoments.moment('smartphone', 2007),
    ],
    [
      ['phone', 'battery'],
      ['phone', 'telegraph', LinkKind.InfluencedBy],
      ['telegraph', 'railway', LinkKind.CausedBy],
      ['smartphone', 'phone'],
      ['smartphone', 'chip'],
    ],
  );
  state = new NavigationState(new ListSetBuilder(dataset), dataset.find('phone')!);
});

describe('NavigationState on moments', () => {
  it('shows only the lists that have entries, earlier ones first, starting on Depended on', () => {
    expect(state.allLists.map((l) => l.kind)).toEqual([ListKind.DependedOn, ListKind.InfluencedBy, ListKind.Enabled]);
    expect(state.activeList.kind).toBe(ListKind.DependedOn);
  });

  it('sorts a list oldest first, and keeps the link to each entry', () => {
    state.goTo(dataset.find('smartphone')!);
    expect(state.activeList.entries.map((m) => m.id)).toEqual(['phone', 'chip']);
    state.switchList(-1);
    expect(state.activeList.highlightedLink?.later.id).toBe('smartphone');
  });

  it('goes earlier with Left Arrow from any list of earlier moments', () => {
    state.switchList(1);
    expect(state.activeList.kind).toBe(ListKind.InfluencedBy);
    expect(state.stepEarlier()).toBe(StepResult.Moved);
    expect(state.currentEntry.id).toBe('telegraph');
  });

  it('arrives on the kind of list moved through, if there is one', () => {
    state.goTo(dataset.find('smartphone')!);
    expect(state.stepEarlier()).toBe(StepResult.Moved);
    expect(state.currentEntry.id).toBe('phone');
    expect(state.activeList.kind).toBe(ListKind.DependedOn);
  });

  it('otherwise arrives on the first list going the same way through time', () => {
    state.switchList(1);
    state.stepEarlier();
    expect(state.currentEntry.id).toBe('telegraph');
    expect(state.activeList.kind).toBe(ListKind.CausedBy);
  });

  it('otherwise arrives on the first list', () => {
    state.switchList(2);
    state.stepLater();
    expect(state.currentEntry.id).toBe('smartphone');
    expect(state.activeList.kind).toBe(ListKind.DependedOn);
  });

  it('does nothing with Right Arrow in a list of earlier moments, when there are later ones', () => {
    expect(state.stepLater()).toBe(StepResult.Nothing);
    expect(state.currentEntry.id).toBe('phone');
  });

  it('bumps with Left Arrow on a moment with nothing earlier, whichever list is active', () => {
    state.goTo(dataset.find('railway')!);
    expect(state.activeList.kind).toBe(ListKind.Caused);
    expect(state.stepEarlier()).toBe(StepResult.Bumped);
    expect(state.currentEntry.id).toBe('railway');
  });

  it('bumps with Right Arrow on a moment with nothing later', () => {
    state.goTo(dataset.find('smartphone')!);
    expect(state.stepLater()).toBe(StepResult.Bumped);
  });

  it('gives a moment with no links an empty Depended on list, and bumps both ways', () => {
    const alone = TestMoments.dataset([TestMoments.moment('alone', 1900)], []);
    const aloneState = new NavigationState(new ListSetBuilder(alone), alone.find('alone')!);
    expect(aloneState.allLists.map((l) => l.kind)).toEqual([ListKind.DependedOn]);
    expect(aloneState.activeList.size).toBe(0);
    expect(aloneState.stepEarlier()).toBe(StepResult.Bumped);
    expect(aloneState.stepLater()).toBe(StepResult.Bumped);
  });

  it('goes straight to a clicked entry, and Backspace comes back', () => {
    expect(state.goTo(dataset.find('smartphone')!)).toBe(true);
    expect(state.currentEntry.id).toBe('smartphone');
    expect(state.goBack()).toBe(true);
    expect(state.currentEntry.id).toBe('phone');
  });

  it('does nothing when the clicked entry is already current', () => {
    expect(state.goTo(dataset.find('phone')!)).toBe(false);
    expect(state.path.map((e) => e.id)).toEqual(['phone']);
  });

  it('does not switch past the last list', () => {
    state.switchList(2);
    expect(state.switchList(1)).toBe(false);
  });

  it('follows the highlighted entry with Enter', () => {
    state.switchList(2);
    expect(state.follow()).toBe(true);
    expect(state.currentEntry.id).toBe('smartphone');
  });

  it('goes back, restoring the list and highlight it left from', () => {
    state.goTo(dataset.find('smartphone')!);
    state.activeList.moveBy(1);
    state.stepEarlier();
    expect(state.currentEntry.id).toBe('chip');
    expect(state.goBack()).toBe(true);
    expect(state.currentEntry.id).toBe('smartphone');
    expect(state.activeList.kind).toBe(ListKind.DependedOn);
    expect(state.activeList.highlighted?.id).toBe('chip');
  });

  it('has nothing to go back to at the start', () => {
    expect(state.goBack()).toBe(false);
  });

  it('records the path taken', () => {
    state.stepEarlier();
    state.stepLater();
    expect(state.path.map((m) => m.id)).toEqual(['phone', 'battery', 'phone']);
  });
});

describe('NavigationState on periods', () => {
  // war (1940 to 1990) contains race (1957 to 1975), which contains landing (1969).
  // net (1969) is in war too. era (from 1970, still going) contains chip (1971).
  let periodState: NavigationState;
  let data: Dataset;

  beforeEach(() => {
    const m = (id: string, year: number) => TestMoments.moment(id, year);
    const warStart = m('war-start', 1940);
    const warEnd = m('war-end', 1990);
    const raceStart = m('race-start', 1957);
    const raceEnd = m('race-end', 1975);
    const landing = m('landing', 1969);
    const net = m('net', 1969);
    const eraStart = m('era-start', 1970);
    const chip = m('chip', 1971);
    const race = TestMoments.period('race', raceStart, raceEnd, [landing]);
    const war = TestMoments.period('war', warStart, warEnd, [race, net]);
    const era = TestMoments.period('era', eraStart, undefined, [chip]);
    data = TestMoments.dataset([warStart, warEnd, raceStart, raceEnd, landing, net, eraStart, chip], [], [war, race, era]);
    periodState = new NavigationState(new ListSetBuilder(data), war);
  });

  it('shows a period\'s stops in date order, from its start moment to its end moment', () => {
    expect(periodState.activeList.kind).toBe(ListKind.Moments);
    expect(periodState.activeList.entries.map((e) => e.id)).toEqual(['war-start', 'race', 'net', 'war-end']);
  });

  it('does nothing with Left Arrow or Right Arrow in the Moments list', () => {
    expect(periodState.stepEarlier()).toBe(StepResult.Nothing);
    expect(periodState.stepLater()).toBe(StepResult.Nothing);
    expect(periodState.currentEntry.id).toBe('war');
    expect(periodState.activeList.highlighted?.id).toBe('war-start');
  });

  it('goes into a smaller period with Enter, showing its Moments list', () => {
    periodState.activeList.moveBy(1);
    expect(periodState.follow()).toBe(true);
    expect(periodState.currentEntry.id).toBe('race');
    expect(periodState.activeList.kind).toBe(ListKind.Moments);
    expect(periodState.activeList.highlighted?.id).toBe('race-start');
  });

  it('goes up through Part of, with the period it came from highlighted', () => {
    periodState.activeList.moveBy(1);
    periodState.follow();
    expect(periodState.switchList(1)).toBe(true);
    expect(periodState.activeList.kind).toBe(ListKind.PartOf);
    periodState.follow();
    expect(periodState.currentEntry.id).toBe('war');
    expect(periodState.activeList.kind).toBe(ListKind.Moments);
    expect(periodState.activeList.highlighted?.id).toBe('race');
  });

  it('gives a moment in a period a Part of list', () => {
    periodState.activeList.moveBy(2);
    periodState.follow();
    expect(periodState.currentEntry.id).toBe('net');
    expect(periodState.allLists.map((l) => l.kind)).toEqual([ListKind.PartOf]);
  });

  it("ends a period still going on with an Ongoing stop that can't be visited", () => {
    const eraState = new NavigationState(new ListSetBuilder(data), data.find('era')!);
    expect(eraState.activeList.entries.map((e) => e.name)).toEqual(['era-start', 'chip', 'Ongoing']);
    eraState.activeList.moveToLast();
    expect(eraState.follow()).toBe(false);
    expect(eraState.stepLater()).toBe(StepResult.Nothing);
  });
});
