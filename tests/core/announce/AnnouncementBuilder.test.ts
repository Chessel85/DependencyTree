import { describe, expect, it } from 'vitest';
import { AnnouncementBuilder } from '../../../src/core/announce/AnnouncementBuilder';
import { DateFormatter } from '../../../src/core/dates/DateFormatter';
import { ListSetBuilder } from '../../../src/core/navigation/ListSetBuilder';
import { NavigationState } from '../../../src/core/navigation/NavigationState';
import { TestMoments } from '../../TestMoments';

const words = new AnnouncementBuilder(new DateFormatter());

function laptopState(): NavigationState {
  const graph = TestMoments.graph(
    [TestMoments.moment('battery', 1800), TestMoments.moment('chip', 1971), TestMoments.moment('laptop', 1981)],
    [['laptop', 'battery'], ['laptop', 'chip']],
  );
  return new NavigationState(new ListSetBuilder(graph), graph.find('laptop')!);
}

describe('AnnouncementBuilder', () => {
  it('announces arrival with the active list, its size and its highlighted entry', () => {
    expect(words.arrival(laptopState())).toBe('laptop, 1981. Dependencies, 2. battery, 1800, 1 of 2.');
  });

  it('announces arrival at a moment whose active list is empty', () => {
    const state = laptopState();
    state.goEarlier();
    expect(words.arrival(state)).toBe('battery, 1800. Dependencies, none.');
  });

  it('announces position within a list', () => {
    const state = laptopState();
    state.activeList.moveBy(1);
    expect(words.position(state.activeList)).toBe('chip, 1971, 2 of 2.');
  });

  it('announces an empty list as none', () => {
    const state = laptopState();
    state.switchList(1);
    expect(words.listSwitch(state.activeList)).toBe('Enabled, none.');
  });

  it('announces a switch to a list with entries', () => {
    const state = laptopState();
    state.goEarlier();
    state.switchList(1);
    expect(words.listSwitch(state.activeList)).toBe('Enabled, 1. laptop, 1981, 1 of 1.');
  });

  it('announces the path oldest first, even when the user walked back in time', () => {
    const state = laptopState();
    state.goEarlier();
    expect(words.path(state.path)).toBe('Path, 2 moments, oldest first: battery, laptop.');
  });

  it('names each moment on the path once', () => {
    const state = laptopState();
    state.goEarlier();
    state.switchList(1);
    state.goLater();
    expect(words.path(state.path)).toBe('Path, 2 moments, oldest first: battery, laptop.');
  });
});
