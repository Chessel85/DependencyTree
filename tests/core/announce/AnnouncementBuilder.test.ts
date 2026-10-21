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
  it('labels the active list with the moment and the list name', () => {
    expect(words.listLabel(laptopState())).toBe('laptop, 1981, Dependencies');
  });

  it('adds "none" to the label of an empty list', () => {
    const state = laptopState();
    state.switchList(1);
    expect(words.listLabel(state)).toBe('laptop, 1981, Enabled, none');
  });

  it('names a tab with its count', () => {
    expect(words.tab(laptopState().activeList)).toBe('Dependencies (2)');
  });

  it('puts the name, date and location on separate lines of the summary box', () => {
    expect(words.summaryLines(laptopState().currentMoment)).toBe('laptop\n1981\nLocation not known');
  });

  it('summarises the moment and its lists', () => {
    expect(words.summary(laptopState())).toBe('laptop, 1981. Dependencies, 2. Enabled, none.');
  });

  it('announces the path oldest first, even when the user walked back in time', () => {
    const state = laptopState();
    state.goEarlier();
    expect(words.path(state.path)).toBe('Path, 2 moments: battery, laptop.');
  });

  it('names each moment on the path once', () => {
    const state = laptopState();
    state.goEarlier();
    state.switchList(1);
    state.goLater();
    expect(words.path(state.path)).toBe('Path, 2 moments: battery, laptop.');
  });
});
