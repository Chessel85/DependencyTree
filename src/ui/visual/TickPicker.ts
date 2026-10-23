import { AxisTick, NodeBox } from './GraphLayout';

/** Chooses year labels for the time axis, leaving out any that would crowd the one before. */
export class TickPicker {
  constructor(private readonly minimumGap = 48) {}

  /** Keeps candidates, in order, that are far enough from the last one kept. */
  pick(candidates: readonly AxisTick[]): AxisTick[] {
    const kept: AxisTick[] = [];
    for (const tick of [...candidates].sort((a, b) => a.x - b.x)) {
      const last = kept[kept.length - 1];
      if (!last || tick.x - last.x >= this.minimumGap) {
        kept.push(tick);
      }
    }
    return kept;
  }

  /** For layouts where distance doesn't mean time: each year at the first box from that year. */
  fromNodes(nodes: readonly NodeBox[]): AxisTick[] {
    const firstByYear = new Map<number, number>();
    for (const node of nodes) {
      const year = node.moment.date.year;
      firstByYear.set(year, Math.min(node.x, firstByYear.get(year) ?? Number.POSITIVE_INFINITY));
    }
    return this.pick([...firstByYear].map(([year, x]) => ({ x, label: TickPicker.yearLabel(year) })));
  }

  /** Astronomical years as people write them (DES-DATE-001). */
  static yearLabel(year: number): string {
    return year >= 1 ? String(year) : `${1 - year} BCE`;
  }
}
