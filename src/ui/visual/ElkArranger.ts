import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled.js';
import { Dependency } from '../../core/model/Dependency';
import { Moment } from '../../core/model/Moment';
import { Point } from './GraphLayout';

/** Where ELK put each moment, and the route of each dependency around the boxes. */
export interface ElkArrangement {
  positions: Map<Moment, Point>;
  routes: Map<Dependency, Point[]>;
}

/**
 * Runs the ELK layered layout on the moments (DES-VIEW-010). It places them
 * in columns so that crossing links are few, and routes links around boxes.
 * Moments from an earlier year are always in an earlier column, so time still
 * runs left to right. The layout is worked out once, the first time it is
 * asked for, and shared by every layout that uses it.
 */
export class ElkArranger {
  private arrangement?: Promise<ElkArrangement>;

  constructor(
    private readonly moments: readonly Moment[],
    private readonly dependencies: readonly Dependency[],
    private readonly widthOf: (moment: Moment) => number,
    private readonly height: number,
  ) {}

  result(): Promise<ElkArrangement> {
    return (this.arrangement ??= this.arrange());
  }

  private async arrange(): Promise<ElkArrangement> {
    const { moments, dependencies, widthOf, height } = this;
    const years = [...new Set(moments.map((m) => m.date.year))].sort((a, b) => a - b);
    const byId = new Map(moments.map((m) => [m.id, m]));
    const children: ElkNode[] = moments.map((m) => ({
      id: m.id,
      width: widthOf(m),
      height,
      layoutOptions: { 'elk.partitioning.partition': String(years.indexOf(m.date.year)) },
    }));
    const edges: ElkExtendedEdge[] = dependencies.map((d, i) => ({
      id: `link-${i}`,
      sources: [d.dependency.id],
      targets: [d.dependent.id],
    }));
    const result = await new ELK().layout({
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.edgeRouting': 'ORTHOGONAL',
        'elk.partitioning.activate': 'true',
        // Laid out as one graph, so moments with no links still keep to their date's column.
        'elk.separateConnectedComponents': 'false',
        'elk.spacing.nodeNode': '16',
        'elk.layered.spacing.nodeNodeBetweenLayers': '48',
        'elk.layered.spacing.edgeNodeBetweenLayers': '16',
        'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      },
      children,
      edges,
    });

    const positions = new Map<Moment, Point>();
    for (const node of result.children ?? []) {
      positions.set(byId.get(node.id)!, { x: node.x ?? 0, y: node.y ?? 0 });
    }
    const routes = new Map<Dependency, Point[]>();
    for (const edge of result.edges ?? []) {
      const section = edge.sections?.[0];
      if (section) {
        const index = Number(edge.id.slice('link-'.length));
        routes.set(dependencies[index], [section.startPoint, ...(section.bendPoints ?? []), section.endPoint]);
      }
    }
    return { positions, routes };
  }
}
