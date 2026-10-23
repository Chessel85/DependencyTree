import { DateFormatter } from '../../core/dates/DateFormatter';
import { DatePrecision, isCoarser } from '../../core/dates/DatePrecision';
import { DateShortener } from '../../core/dates/DateShortener';
import { HistoricDate } from '../../core/dates/HistoricDate';
import { Moment } from '../../core/model/Moment';
import { NodeBox } from './GraphLayout';

/**
 * Decides how a moment is drawn: a dot of fixed size, with its name and date
 * kept for the tooltip (DES-VIEW-002). The date is shortened as in lists (DES-DATE-006).
 */
export class NodeBoxMaker {
  /** The width and height of every dot. */
  readonly size = 12;

  constructor(
    private readonly formatter: DateFormatter,
    private readonly shortener: DateShortener,
    private readonly today: HistoricDate,
  ) {}

  make(moment: Moment, x: number, y: number, span?: [number, number]): NodeBox {
    const date = moment.date;
    return {
      moment,
      name: moment.name,
      date: this.formatter.written(this.shortener.shorten(date)),
      x,
      y,
      width: this.size,
      height: this.size,
      uncertain: date.approximate || isCoarser(date.precision, DatePrecision.Year),
      planned: date.range().isCertainlyAfter(this.today.range()),
      span,
    };
  }
}
