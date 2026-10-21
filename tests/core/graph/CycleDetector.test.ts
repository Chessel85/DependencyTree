import { describe, expect, it } from 'vitest';
import { CycleDetector } from '../../../src/core/graph/CycleDetector';
import { TestMoments } from '../../TestMoments';

const detector = new CycleDetector();

describe('CycleDetector', () => {
  it('finds no cycles in a chain', () => {
    const graph = TestMoments.graph(
      [TestMoments.moment('a', 1900), TestMoments.moment('b', 1950), TestMoments.moment('c', 2000)],
      [['c', 'b'], ['b', 'a']],
    );
    expect(detector.findCycles(graph)).toEqual([]);
  });

  it('finds a chain that leads back to its start', () => {
    const graph = TestMoments.graph(
      [TestMoments.moment('a', 1900), TestMoments.moment('b', 1950), TestMoments.moment('c', 2000)],
      [['a', 'b'], ['b', 'c'], ['c', 'a']],
    );
    const cycles = detector.findCycles(graph);
    expect(cycles).toHaveLength(1);
    expect(cycles[0].map((m) => m.id).sort()).toEqual(['a', 'b', 'c']);
  });
});
