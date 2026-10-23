import { DateRecord } from '../core/data/DatasetReader';
import { WikidataClaim } from './WikidataEntity';

/** Wikidata's precision codes that the dates module can hold (DES-IMP-006). Lower codes are deeper time. */
const PRECISIONS: Record<number, DateRecord['precision']> = {
  11: 'day',
  10: 'month',
  9: 'year',
  8: 'decade',
  7: 'century',
  6: 'millennium',
};

const SOURCING_CIRCUMSTANCES = 'P1480';
const CIRCA = 'Q5727902';

interface WikidataTime {
  time: string;
  precision: number;
}

/** Turns a Wikidata date statement into a dataset date. */
export class WikidataDateReader {
  /** The date, or undefined if the statement has no date or one too rough for the dates module. */
  read(claim: WikidataClaim): DateRecord | undefined {
    const value = claim.mainsnak.datavalue;
    if (value?.type !== 'time') {
      return undefined;
    }
    const { time, precision } = value.value as WikidataTime;
    const named = PRECISIONS[precision];
    const parts = /^([+-])(\d+)-(\d\d)-(\d\d)/.exec(time);
    if (!named || !parts) {
      return undefined;
    }
    // Wikidata has no year 0: -0001 is 1 BCE, which is astronomical year 0 (DES-DATE-001).
    const written = Number(parts[2]);
    const year = parts[1] === '-' ? 1 - written : written;
    const month = Number(parts[3]);
    const day = Number(parts[4]);
    const date: DateRecord = { year, precision: named };
    if (named === 'month' || named === 'day') {
      if (month === 0) {
        date.precision = 'year';
      } else {
        date.month = month;
        if (named === 'day') {
          if (day === 0) {
            date.precision = 'month';
          } else {
            date.day = day;
          }
        }
      }
    }
    if (this.isCirca(claim)) {
      date.approximate = true;
    }
    return date;
  }

  private isCirca(claim: WikidataClaim): boolean {
    return (claim.qualifiers?.[SOURCING_CIRCUMSTANCES] ?? []).some(
      (q) => q.datavalue?.type === 'wikibase-entityid' && (q.datavalue.value as { id: string }).id === CIRCA,
    );
  }
}
