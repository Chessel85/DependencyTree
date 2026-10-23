import { describe, expect, it } from 'vitest';
import { LanePlacer } from '../../../src/ui/visual/LanePlacer';

describe('LanePlacer', () => {
  it('gives each box its preferred lane when nothing overlaps', () => {
    const lanes = new LanePlacer(10).place([
      { x: 0, width: 50, preferredLane: 2 },
      { x: 100, width: 50, preferredLane: 2 },
    ]);
    expect(lanes).toEqual([2, 2]);
  });

  it('moves an overlapping box to the nearest free lane, trying below first', () => {
    const lanes = new LanePlacer(10).place([
      { x: 0, width: 50, preferredLane: 1 },
      { x: 30, width: 50, preferredLane: 1 },
      { x: 40, width: 50, preferredLane: 1 },
    ]);
    expect(lanes).toEqual([1, 2, 0]);
  });

  it('keeps the gap between boxes in a lane', () => {
    const lanes = new LanePlacer(10).place([
      { x: 0, width: 50, preferredLane: 0 },
      { x: 55, width: 50, preferredLane: 0 },
    ]);
    expect(lanes).toEqual([0, 1]);
  });
});
