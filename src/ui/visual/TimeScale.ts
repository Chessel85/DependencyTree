import { DateRange } from '../../core/dates/DateRange';
import { Moment } from '../../core/model/Moment';
import { AxisTick, NodeBox } from './GraphLayout';

/** One way of spacing entries along the time axis (DES-VIEW-005). */
export interface TimeScale {
  /** Where a moment's date falls. */
  x(moment: Moment): number;
  /** Where a range of dates falls, or undefined where distance doesn't mean time. */
  span(range: DateRange): [number, number] | undefined;
  readonly todayX: number;
  /** The year labels, given where the dots ended up. */
  ticks(nodes: readonly NodeBox[]): AxisTick[];
}
