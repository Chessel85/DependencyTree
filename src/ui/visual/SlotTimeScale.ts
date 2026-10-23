import { Moment } from '../../core/model/Moment';
import { AxisTick, NodeBox } from './GraphLayout';
import { TickPicker } from './TickPicker';
import { TimeScale } from './TimeScale';

/**
 * Time slots: each moment has its own column in date order, however far apart
 * the dates are (DES-VIEW-005). Columns are as wide as their box.
 */
export class SlotTimeScale implements TimeScale {
  private readonly columns = new Map<Moment, number>();
  readonly todayX: number;

  constructor(
    moments: readonly Moment[],
    widthOf: (moment: Moment) => number,
    gap: number,
    margin: number,
    private readonly picker = new TickPicker(),
  ) {
    let x = margin;
    for (const moment of moments) {
      this.columns.set(moment, x);
      x += widthOf(moment) + gap;
    }
    this.todayX = x;
  }

  x(moment: Moment): number {
    const x = this.columns.get(moment);
    if (x === undefined) {
      throw new Error(`"${moment.id}" has no time slot.`);
    }
    return x;
  }

  span(): undefined {
    return undefined;
  }

  ticks(nodes: readonly NodeBox[]): AxisTick[] {
    return this.picker.fromNodes(nodes);
  }
}
