import { DateRange } from '../../core/dates/DateRange';
import { Moment } from '../../core/model/Moment';
import { AxisTick } from './GraphLayout';
import { TickPicker } from './TickPicker';
import { TimeScale } from './TimeScale';

const TICK_STEP = 25;

/** Linear time: distance is proportional to the years between entries (DES-VIEW-005). */
export class LinearTimeScale implements TimeScale {
  private readonly start: number;

  constructor(
    earliest: number,
    private readonly today: number,
    private readonly pixelsPerYear: number,
    private readonly margin: number,
    private readonly picker = new TickPicker(),
  ) {
    this.start = Math.floor(earliest / TICK_STEP) * TICK_STEP;
  }

  x(moment: Moment): number {
    return this.at(moment.sortKey);
  }

  span(range: DateRange): [number, number] {
    return [this.at(range.earliest), this.at(range.latest)];
  }

  get todayX(): number {
    return this.at(this.today);
  }

  ticks(): AxisTick[] {
    const candidates: AxisTick[] = [];
    for (let year = this.start; year <= this.today; year += TICK_STEP) {
      candidates.push({ x: this.at(year), label: TickPicker.yearLabel(year) });
    }
    return this.picker.pick(candidates);
  }

  private at(year: number): number {
    return this.margin + (year - this.start) * this.pixelsPerYear;
  }
}
