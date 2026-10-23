import { DateRecord } from '../core/data/DatasetReader';
import { DatePrecision } from '../core/dates/DatePrecision';
import { DateRange } from '../core/dates/DateRange';
import { HistoricDate } from '../core/dates/HistoricDate';
import { Curation } from './Curation';
import { PropertyMapper } from './PropertyMapper';
import { WikidataDateReader } from './WikidataDateReader';
import { WikidataEntity } from './WikidataEntity';

/** A date, with the Wikidata property or "curation" that gave it. */
export interface SourcedDate {
  date: DateRecord;
  source: string;
}

/** Decides whether an item is a moment or a period, and finds its dates: from the curation file first, then Wikidata. */
export class EntryDates {
  constructor(
    private readonly curation: Curation,
    private readonly mapper: PropertyMapper,
    private readonly reader = new WikidataDateReader(),
  ) {}

  isPeriod(entity: WikidataEntity): boolean {
    const curated = this.curation.entry(entity.id);
    if (curated?.start) {
      return true;
    }
    if (curated?.date) {
      return false;
    }
    return this.mapper.isPeriod(entity);
  }

  /** Whether the item has the date it needs to be included: a moment's date, or a period's start. */
  isDated(entity: WikidataEntity): boolean {
    return (this.isPeriod(entity) ? this.start(entity) : this.momentDate(entity)) !== undefined;
  }

  momentDate(entity: WikidataEntity): SourcedDate | undefined {
    return this.curated(entity, 'date') ?? this.first(entity, PropertyMapper.MOMENT_DATE);
  }

  start(entity: WikidataEntity): SourcedDate | undefined {
    return this.curated(entity, 'start') ?? this.first(entity, PropertyMapper.PERIOD_START);
  }

  /** Undefined for a period still going on. */
  end(entity: WikidataEntity): SourcedDate | undefined {
    return this.curated(entity, 'end') ?? this.first(entity, PropertyMapper.PERIOD_END);
  }

  /** The times the item could have happened: a moment's date, or a period's start. Undefined if undated. */
  range(entity: WikidataEntity): DateRange | undefined {
    const found = this.isPeriod(entity) ? this.start(entity) : this.momentDate(entity);
    if (!found) {
      return undefined;
    }
    const d = found.date;
    return new HistoricDate(d.year, d.precision as DatePrecision, d.approximate ?? false, d.month, d.day).range();
  }

  private curated(entity: WikidataEntity, field: 'date' | 'start' | 'end'): SourcedDate | undefined {
    const date = this.curation.entry(entity.id)?.[field];
    return date ? { date, source: 'curation' } : undefined;
  }

  private first(entity: WikidataEntity, properties: readonly string[]): SourcedDate | undefined {
    for (const property of properties) {
      for (const claim of entity.claims(property)) {
        const date = this.reader.read(claim);
        if (date) {
          return { date, source: property };
        }
      }
    }
    return undefined;
  }
}
