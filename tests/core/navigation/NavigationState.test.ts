import { beforeEach, describe, expect, it } from 'vitest';
import { Dataset } from '../../../src/core/data/Dataset';
import { ListKind } from '../../../src/core/navigation/ListKind';
import { ListSetBuilder } from '../../../src/core/navigation/ListSetBuilder';
import { NavigationState } from '../../../src/core/navigation/NavigationState';
import { StepResult } from '../../../src/core/navigation/StepResult';
import { TestMoments } from '../../TestMoments';

// battery (1800) enabled both the phone (1876) and the laptop (1981).
// The laptop also depends on the chip (1971).
let dataset: Dataset;
let state: NavigationState;

beforeEach(() => {
  dataset = TestMoments.dataset(
    [
      TestMoments.moment('battery', 1800),
      TestMoments.moment('phone', 1876),
      TestMoments.moment('chip', 1971),
      TestMoments.moment('laptop', 1981),
    ],
    [['phone', 'battery'], ['laptop', 'battery'], ['laptop', 'chip']],
  );
  state = new NavigationState(new ListSetBuilder(dataset), dataset.find('laptop')!);
});

describe('NavigationState on moments', () => {
  it('starts with the Dependencies list active, sorted oldest first', () => {
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
    expect(state.activeList.entries.map((m) => m.id)).toEqual(['battery', 'chip']);
  });

  it('goes earlier with Left Arrow when Dependencies is active, keeping that list active', () => {
    expect(state.stepEarlier()).toBe(StepResult.Moved);
    expect(state.currentEntry.id).toBe('battery');
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
  });

  it('does nothing with Right Arrow when Dependencies is active', () => {
    expect(state.stepLater()).toBe(StepResult.Nothing);
    expect(state.currentEntry.id).toBe('laptop');
  });

  it('switches list and goes later, keeping the Enabled list active', () => {
    state.stepEarlier();
    expect(state.switchList(1)).toBe(true);
    expect(state.activeList.kind).toBe(ListKind.Enabled);
    expect(state.stepLater()).toBe(StepResult.Moved);
    expect(state.currentEntry.id).toBe('phone');
    expect(state.activeList.kind).toBe(ListKind.Enabled);
  });

  it('does not switch past the last list', () => {
    state.switchList(1);
    expect(state.switchList(1)).toBe(false);
  });

  it('follows the highlighted entry with Enter', () => {
    state.activeList.moveBy(1);
    expect(state.follow()).toBe(true);
    expect(state.currentEntry.id).toBe('chip');
  });

  it('goes back, restoring the list and highlight it left from', () => {
    state.activeList.moveBy(1);
    state.stepEarlier();
    expect(state.goBack()).toBe(true);
    expect(state.currentEntry.id).toBe('laptop');
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
    expect(state.activeList.highlighted?.id).toBe('chip');
  });

  it('has nothing to go back to at the start', () => {
    expect(state.goBack()).toBe(false);
  });

  it('records the path taken', () => {
    state.stepEarlier();
    state.switchList(1);
    state.stepLater();
    expect(state.path.map((m) => m.id)).toEqual(['laptop', 'battery', 'phone']);
  });

  it('keeps an empty Dependencies list, and does nothing when following it', () => {
    state.stepEarlier();
    expect(state.list(ListKind.Dependencies)?.size).toBe(0);
    expect(state.stepEarlier()).toBe(StepResult.Nothing);
    expect(state.currentEntry.id).toBe('battery');
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

  it('steps through the stops with Left Arrow and Right Arrow, bumping at the ends', () => {
    expect(periodState.stepEarlier()).toBe(StepResult.Bumped);
    expect(periodState.stepLater()).toBe(StepResult.Highlighted);
    expect(periodState.activeList.highlighted?.id).toBe('race');
    periodState.activeList.moveToLast();
    expect(periodState.stepLater()).toBe(StepResult.Bumped);
  });

  it('goes into a smaller period with Enter, showing its Moments list', () => {
    periodState.stepLater();
    expect(periodState.follow()).toBe(true);
    expect(periodState.currentEntry.id).toBe('race');
    expect(periodState.activeList.kind).toBe(ListKind.Moments);
    expect(periodState.activeList.highlighted?.id).toBe('race-start');
  });

  it('goes up through Part of, with the period it came from highlighted', () => {
    periodState.stepLater();
    periodState.follow();
    expect(periodState.switchList(1)).toBe(true);
    expect(periodState.activeList.kind).toBe(ListKind.PartOf);
    periodState.follow();
    expect(periodState.currentEntry.id).toBe('war');
    expect(periodState.activeList.kind).toBe(ListKind.Moments);
    expect(periodState.activeList.highlighted?.id).toBe('race');
  });

  it('gives a moment in a period a Part of list between Dependencies and Enabled', () => {
    periodState.activeList.moveBy(2);
    periodState.follow();
    expect(periodState.currentEntry.id).toBe('net');
    expect(periodState.allLists.map((l) => l.kind)).toEqual([ListKind.Dependencies, ListKind.PartOf, ListKind.Enabled]);
  });

  it("ends a period still going on with an Ongoing stop that can't be visited", () => {
    const eraState = new NavigationState(new ListSetBuilder(data), data.find('era')!);
    expect(eraState.activeList.entries.map((e) => e.name)).toEqual(['era-start', 'chip', 'Ongoing']);
    eraState.activeList.moveToLast();
    expect(eraState.follow()).toBe(false);
    expect(eraState.stepLater()).toBe(StepResult.Bumped);
  });
});
