import { describe, expect, it } from 'vitest';
import { Moment } from '../../../src/core/model/Moment';
import { GraphLayoutAssembler } from '../../../src/ui/visual/GraphLayoutAssembler';
import { NodeBox } from '../../../src/ui/visual/GraphLayout';
import { TestMoments } from '../../TestMoments';

function box(moment: Moment, x: number): NodeBox {
  return { moment, name: moment.name, date: '', x, y: 0, width: 50, height: 40, uncertain: false, planned: false };
}

const warStart = TestMoments.moment('war-start', 1947);
const raceStart = TestMoments.moment('race-start', 1957);
const raceEnd = TestMoments.moment('race-end', 1975);
const warEnd = TestMoments.moment('war-end', 1991);
const race = TestMoments.period('race', raceStart, raceEnd);
const war = TestMoments.period('war', warStart, warEnd, [race]);
const era = TestMoments.period('era', raceEnd, undefined);
const arrangement = {
  nodes: [box(warStart, 0), box(raceStart, 100), box(raceEnd, 200), box(warEnd, 300)],
  links: [],
  ticks: [],
  todayX: 500,
};

describe('GraphLayoutAssembler', () => {
  const layout = new GraphLayoutAssembler().assemble(arrangement, [war, race, era]);
  const bar = (id: string) => layout.bars.find((b) => b.period.id === id)!;

  it('runs a bar from its start box to the end of its end box', () => {
    expect(bar('war').x).toBe(0);
    expect(bar('war').width).toBe(350);
  });

  it('runs a period still going on to today', () => {
    expect(bar('era').ongoing).toBe(true);
    expect(bar('era').x + bar('era').width).toBe(500);
  });

  it('draws a smaller period thinner, in its own row, with its moments marked', () => {
    expect(bar('race').height).toBeLessThan(bar('war').height);
    expect(bar('race').y).toBeGreaterThan(bar('war').y);
    expect(bar('race').marks).toEqual([125, 225]);
  });

  it('puts the moments below the period bars', () => {
    const lowestBar = Math.max(...layout.bars.map((b) => b.y + b.height));
    expect(Math.min(...layout.nodes.map((n) => n.y))).toBeGreaterThan(lowestBar);
  });
});
