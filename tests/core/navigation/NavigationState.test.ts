import { beforeEach, describe, expect, it } from 'vitest';
import { DependencyGraph } from '../../../src/core/graph/DependencyGraph';
import { ListKind } from '../../../src/core/navigation/ListKind';
import { ListSetBuilder } from '../../../src/core/navigation/ListSetBuilder';
import { NavigationState } from '../../../src/core/navigation/NavigationState';
import { TestMoments } from '../../TestMoments';

// battery (1800) enabled both the phone (1876) and the laptop (1981).
// The laptop also depends on the chip (1971).
let graph: DependencyGraph;
let state: NavigationState;

beforeEach(() => {
  graph = TestMoments.graph(
    [
      TestMoments.moment('battery', 1800),
      TestMoments.moment('phone', 1876),
      TestMoments.moment('chip', 1971),
      TestMoments.moment('laptop', 1981),
    ],
    [['phone', 'battery'], ['laptop', 'battery'], ['laptop', 'chip']],
  );
  state = new NavigationState(new ListSetBuilder(graph), graph.find('laptop')!);
});

describe('NavigationState', () => {
  it('starts with the Dependencies list active, sorted oldest first', () => {
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
    expect(state.activeList.entries.map((m) => m.id)).toEqual(['battery', 'chip']);
  });

  it('goes earlier with Left Arrow when Dependencies is active, keeping that list active', () => {
    expect(state.goEarlier()).toBe(true);
    expect(state.currentMoment.id).toBe('battery');
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
  });

  it('does nothing with Right Arrow when Dependencies is active', () => {
    expect(state.goLater()).toBe(false);
    expect(state.currentMoment.id).toBe('laptop');
  });

  it('switches list and goes later, keeping the Enabled list active', () => {
    state.goEarlier();
    expect(state.switchList(1)).toBe(true);
    expect(state.activeList.kind).toBe(ListKind.Enabled);
    expect(state.goLater()).toBe(true);
    expect(state.currentMoment.id).toBe('phone');
    expect(state.activeList.kind).toBe(ListKind.Enabled);
  });

  it('does not switch past the last list', () => {
    state.switchList(1);
    expect(state.switchList(1)).toBe(false);
  });

  it('follows the highlighted entry with Enter', () => {
    state.activeList.moveBy(1);
    expect(state.follow()).toBe(true);
    expect(state.currentMoment.id).toBe('chip');
  });

  it('goes back, restoring the list and highlight it left from', () => {
    state.activeList.moveBy(1);
    state.goEarlier();
    expect(state.goBack()).toBe(true);
    expect(state.currentMoment.id).toBe('laptop');
    expect(state.activeList.kind).toBe(ListKind.Dependencies);
    expect(state.activeList.highlighted?.id).toBe('chip');
  });

  it('has nothing to go back to at the start', () => {
    expect(state.goBack()).toBe(false);
  });

  it('records the path taken', () => {
    state.goEarlier();
    state.switchList(1);
    state.goLater();
    expect(state.path.map((m) => m.id)).toEqual(['laptop', 'battery', 'phone']);
  });

  it('keeps an empty Dependencies list, and does nothing when following it', () => {
    state.goEarlier();
    expect(state.list(ListKind.Dependencies)?.size).toBe(0);
    expect(state.goEarlier()).toBe(false);
    expect(state.currentMoment.id).toBe('battery');
  });
});
