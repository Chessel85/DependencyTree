import { Moment } from '../model/Moment';
import { ListKind } from './ListKind';

/** A record of one stop along the path: where the user was, and how they left it (DES-NAV-007). */
export class Visit {
  constructor(
    readonly moment: Moment,
    readonly activeKind: ListKind,
    readonly highlights: ReadonlyMap<ListKind, number>,
  ) {}
}
