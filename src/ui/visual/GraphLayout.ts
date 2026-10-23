import { Moment } from '../../core/model/Moment';
import { Period } from '../../core/model/Period';

/** The shapes a layout produces, in pixels, ready to draw. These are plain data, with no drawing code. */

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A moment, drawn as a labelled box. */
export interface NodeBox extends Box {
  moment: Moment;
  name: string;
  date: string;
  /** Known only roughly, so drawn with soft edges (DES-VIEW-004). */
  uncertain: boolean;
  /** After today, so drawn with a dashed outline (DES-VIEW-009). */
  planned: boolean;
  /** Where the date's range of possible times falls, on layouts where distance means time. */
  span?: [number, number];
}

/** A dependency, drawn as an arrow from the earlier moment to the later one (DES-VIEW-003). */
export interface LinkPath {
  dependency: Moment;
  dependent: Moment;
  points: Point[];
  /** True for a smooth curve between the two ends; false for straight segments through every point. */
  curved: boolean;
}

/** A period, drawn as a bar from its start moment to its end moment (DES-VIEW-002). */
export interface PeriodBar extends Box {
  period: Period;
  ongoing: boolean;
  /** The centres of its moments, marked along the bar. */
  marks: number[];
}

/** A year label on the time axis. */
export interface AxisTick {
  x: number;
  label: string;
}

/** What a layout decides before the axis and period band are added above it. */
export interface Arrangement {
  nodes: NodeBox[];
  links: LinkPath[];
  ticks: AxisTick[];
  todayX: number;
}

/** The finished picture. */
export interface GraphLayout extends Arrangement {
  bars: PeriodBar[];
  width: number;
  height: number;
}
