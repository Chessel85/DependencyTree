import { DateRange } from '../../core/dates/DateRange';
import { Moment } from '../../core/model/Moment';
import { AxisTick } from './GraphLayout';
import { TickPicker } from './TickPicker';
import { TimeScale } from './TimeScale';

const TICK_STEP = 10;

/**
 * Compressed time: distance is the logarithm of how long ago something was,
 * so recent years get more room than distant ones (DES-VIEW-005). `softening`
 * is the number of years that still get roughly linear room near today.
 */
export class CompressedTimeScale implements TimeScale {
  private readonly start: number;
  private readonly depth: number;

  constructor(
    earliest: number,
    private readonly today: number,
    private readonly width: number,
    private readonly margin: number,
    private readonly softening = 10,
    private readonly picker = new TickPicker(),
  ) {
    this.start = Math.floor(earliest / TICK_STEP) * TICK_STEP;
    this.depth = this.compressedAgo(this.start);
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
    return this.margin + this.width * (1 - this.compressedAgo(year) / this.depth);
  }

  /** How long ago, compressed. Future years mirror past ones, so they lie to the right of today. */
  private compressedAgo(year: number): number {
    const ago = this.today - year;
    const compressed = Math.log1p(Math.abs(ago) / this.softening);
    return ago >= 0 ? compressed : -compressed;
  }
}
