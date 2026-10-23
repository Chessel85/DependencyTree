import { Dependency } from '../../core/model/Dependency';
import { Moment } from '../../core/model/Moment';
import { ElkArranger } from './ElkArranger';
import { Arrangement, LinkPath, NodeBox } from './GraphLayout';
import { LanePlacer } from './LanePlacer';
import { LayoutEngine } from './LayoutEngine';
import { NodeBoxMaker } from './NodeBoxMaker';
import { TimeScale } from './TimeScale';

/**
 * Puts each moment where its time scale says, across the page (DES-VIEW-005).
 * Up and down, each moment starts in the row the layered layout gave it, and
 * moves to the nearest free row if its box would overlap another. Links are
 * smooth curves, which can pass behind other boxes.
 */
export class TimeScaleLayout implements LayoutEngine {
  constructor(
    readonly key: string,
    readonly title: string,
    readonly note: string,
    private readonly scale: TimeScale,
    private readonly moments: readonly Moment[],
    private readonly dependencies: readonly Dependency[],
    private readonly arranger: ElkArranger,
    private readonly maker: NodeBoxMaker,
    private readonly rowHeight: number,
    private readonly placer = new LanePlacer(),
  ) {}

  async arrange(): Promise<Arrangement> {
    const { positions } = await this.arranger.result();
    const rows = this.placer.place(
      this.moments.map((m) => ({
        x: this.scale.x(m),
        width: this.maker.widthOf(m),
        preferredLane: Math.round(positions.get(m)!.y / this.rowHeight),
      })),
    );
    const nodes = this.moments.map((m, i) =>
      this.maker.make(m, this.scale.x(m), rows[i] * this.rowHeight, this.scale.span(m.date.range())),
    );
    const byMoment = new Map(nodes.map((n) => [n.moment, n]));
    const links = this.dependencies.map((d) => this.link(d, byMoment.get(d.dependency)!, byMoment.get(d.dependent)!));
    return { nodes, links, ticks: this.scale.ticks(nodes), todayX: this.scale.todayX };
  }

  /** From the right-hand side of the earlier box to the left-hand side of the later one. */
  private link(d: Dependency, from: NodeBox, to: NodeBox): LinkPath {
    return {
      dependency: d.dependency,
      dependent: d.dependent,
      points: [
        { x: from.x + from.width, y: from.y + from.height / 2 },
        { x: to.x, y: to.y + to.height / 2 },
      ],
      curved: true,
    };
  }
}
