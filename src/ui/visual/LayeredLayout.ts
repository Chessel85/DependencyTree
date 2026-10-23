import { Moment } from '../../core/model/Moment';
import { ElkArranger } from './ElkArranger';
import { Arrangement, LinkPath } from './GraphLayout';
import { LayoutEngine } from './LayoutEngine';
import { NodeBoxMaker } from './NodeBoxMaker';
import { TickPicker } from './TickPicker';

/**
 * The layered layout as ELK gives it (DES-VIEW-010): moments in columns in
 * date order, with links routed in straight segments around the boxes.
 * Distance across the page shows order, not how much time passed.
 */
export class LayeredLayout implements LayoutEngine {
  constructor(
    readonly key: string,
    readonly title: string,
    readonly note: string,
    private readonly moments: readonly Moment[],
    private readonly arranger: ElkArranger,
    private readonly maker: NodeBoxMaker,
    private readonly margin: number,
    private readonly picker = new TickPicker(),
  ) {}

  async arrange(): Promise<Arrangement> {
    const { positions, routes } = await this.arranger.result();
    const nodes = this.moments.map((m) => {
      const at = positions.get(m)!;
      return this.maker.make(m, at.x + this.margin, at.y);
    });
    const links: LinkPath[] = [...routes].map(([l, points]) => ({
      earlier: l.earlier,
      later: l.later,
      kind: l.kind,
      points: points.map((p) => ({ x: p.x + this.margin, y: p.y })),
      curved: false,
    }));
    const rightmost = Math.max(...nodes.map((n) => n.x + n.width));
    return { nodes, links, ticks: this.picker.fromNodes(nodes), todayX: rightmost + this.margin * 2 };
  }
}
