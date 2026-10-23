import { Moment } from '../../core/model/Moment';
import { Period } from '../../core/model/Period';
import { Arrangement, GraphLayout, NodeBox, PeriodBar } from './GraphLayout';
import { LanePlacer } from './LanePlacer';

const AXIS_HEIGHT = 24;
const BAR_ROW = 28;
const BAR_HEIGHT = 20;
const SMALLER_BAR_HEIGHT = 14;
const GAP = 24;

/**
 * Finishes a layout: the time axis goes at the top, then a band of period
 * bars, then the moments. Each bar runs from its start moment's dot to its
 * end moment's dot, or to today if the period is still going on
 * (DES-VIEW-002). A period inside another is drawn as a thinner bar.
 */
export class GraphLayoutAssembler {
  constructor(private readonly placer = new LanePlacer(4)) {}

  assemble(arrangement: Arrangement, periods: readonly Period[]): GraphLayout {
    const byMoment = new Map(arrangement.nodes.map((n) => [n.moment, n]));
    const box = (moment: Moment): NodeBox => {
      const node = byMoment.get(moment);
      if (!node) {
        throw new Error(`"${moment.id}" is in a period but has no box.`);
      }
      return node;
    };

    const extents = periods.map((p) => {
      const left = box(p.start).x;
      const right = p.end ? box(p.end).x + box(p.end).width : arrangement.todayX;
      return { x: left, width: right - left, preferredLane: 0 };
    });
    const lanes = this.placer.place(extents);
    const barTop = AXIS_HEIGHT + GAP / 2;
    const laneCount = lanes.length ? Math.max(...lanes) + 1 : 0;
    const nodesTop = barTop + laneCount * BAR_ROW + GAP;

    const bars: PeriodBar[] = periods.map((p, i) => {
      const smaller = periods.some((outer) => outer.members.includes(p));
      const height = smaller ? SMALLER_BAR_HEIGHT : BAR_HEIGHT;
      return {
        period: p,
        ongoing: p.isOngoing,
        x: extents[i].x,
        width: extents[i].width,
        y: barTop + lanes[i] * BAR_ROW + (BAR_HEIGHT - height) / 2,
        height,
        marks: p.stops.filter((s): s is Moment => s instanceof Moment).map((m) => box(m).x + box(m).width / 2),
      };
    });

    const nodes = arrangement.nodes.map((n) => ({ ...n, y: n.y + nodesTop }));
    const links = arrangement.links.map((l) => ({ ...l, points: l.points.map((p) => ({ x: p.x, y: p.y + nodesTop })) }));
    const right = Math.max(arrangement.todayX, ...nodes.map((n) => n.x + n.width));
    const bottom = Math.max(nodesTop, ...nodes.map((n) => n.y + n.height));
    return {
      nodes,
      links,
      bars,
      ticks: arrangement.ticks,
      todayX: arrangement.todayX,
      width: right + GAP * 2,
      height: bottom + GAP,
    };
  }
}
