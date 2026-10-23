import { DateFormatter } from '../../core/dates/DateFormatter';
import { DatePrecision, isCoarser } from '../../core/dates/DatePrecision';
import { DateShortener } from '../../core/dates/DateShortener';
import { HistoricDate } from '../../core/dates/HistoricDate';
import { Moment } from '../../core/model/Moment';
import { NodeBox } from './GraphLayout';

/** Rough width of one character of the box text, in pixels. Good enough to size a box. */
const CHARACTER_WIDTH = 7;
const PADDING = 16;
const MINIMUM_WIDTH = 80;

/** Decides what a moment's box says and how big it is. The date is shortened as in lists (DES-DATE-006). */
export class NodeBoxMaker {
  readonly height = 40;

  constructor(
    private readonly formatter: DateFormatter,
    private readonly shortener: DateShortener,
    private readonly today: HistoricDate,
  ) {}

  widthOf(moment: Moment): number {
    const longest = Math.max(moment.name.length, this.dateText(moment).length);
    return Math.max(MINIMUM_WIDTH, Math.ceil(longest * CHARACTER_WIDTH + PADDING));
  }

  make(moment: Moment, x: number, y: number, span?: [number, number]): NodeBox {
    const date = moment.date;
    return {
      moment,
      name: moment.name,
      date: this.dateText(moment),
      x,
      y,
      width: this.widthOf(moment),
      height: this.height,
      uncertain: date.approximate || isCoarser(date.precision, DatePrecision.Year),
      planned: date.range().isCertainlyAfter(this.today.range()),
      span,
    };
  }

  private dateText(moment: Moment): string {
    return this.formatter.written(this.shortener.shorten(moment.date));
  }
}
