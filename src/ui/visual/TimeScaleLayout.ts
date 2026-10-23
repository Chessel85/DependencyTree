import { Link } from '../../core/model/Link';
import { Moment } from '../../core/model/Moment';
import { ElkArranger } from './ElkArranger';
import { Arrangement, LinkPath, NodeBox } from './GraphLayout';
import { LanePlacer } from './LanePlacer';
import { LayoutEngine } from './LayoutEngine';
import { NodeBoxMaker } from './NodeBoxMaker';
import { TimeScale } from './TimeScale';

/**
 * Puts each moment's dot at its date, across the page (DES-VIEW-005).
 * Up and down, each moment starts in the row the layered layout gave it, and
 * moves to the nearest free row if its dot would be too close to another.
 * Links are smooth curves, which can pass behind other dots.
 */
export class TimeScaleLayout implements LayoutEngine {
  constructor(
    readonly key: string,
    readonly title: string,
    readonly note: string,
    private readonly scale: TimeScale,
    private readonly moments: readonly Moment[],
    private readonly links: readonly Link[],
    private readonly arranger: ElkArranger,
    private readonly maker: NodeBoxMaker,
    private readonly rowHeight: number,
    private readonly placer = new LanePlacer(),
  ) {}

  async arrange(): Promise<Arrangement> {
    const { positions } = await this.arranger.result();
    const half = this.maker.size / 2;
    const rows = this.placer.place(
      this.moments.map((m) => ({
        x: this.scale.x(m) - half,
        width: this.maker.size,
        preferredLane: Math.round(positions.get(m)!.y / this.rowHeight),
      })),
    );
    const nodes = this.moments.map((m, i) =>
      this.maker.make(m, this.scale.x(m) - half, rows[i] * this.rowHeight, this.scale.span(m.date.range())),
    );
    const byMoment = new Map(nodes.map((n) => [n.moment, n]));
    const links = this.links.map((l) => this.link(l, byMoment.get(l.earlier)!, byMoment.get(l.later)!));
    return { nodes, links, ticks: this.scale.ticks(nodes), todayX: this.scale.todayX };
  }

  /**
   * From the right-hand side of the earlier dot to the left-hand side of the
   * later one. Two dots too close in time for that are joined by a straight
   * line from the top or bottom of one to the other.
   */
  private link(l: Link, from: NodeBox, to: NodeBox): LinkPath {
    const link = { earlier: l.earlier, later: l.later, kind: l.kind };
    const fromX = from.x + from.width / 2;
    const toX = to.x + to.width / 2;
    if (to.x >= from.x + from.width) {
      return {
        ...link,
        points: [{ x: from.x + from.width, y: from.y + from.height / 2 }, { x: to.x, y: to.y + to.height / 2 }],
        curved: true,
      };
    }
    const downward = to.y > from.y;
    return {
      ...link,
      points: [
        { x: fromX, y: downward ? from.y + from.height : from.y },
        { x: toX, y: downward ? to.y : to.y + to.height },
      ],
      curved: false,
    };
  }
}
