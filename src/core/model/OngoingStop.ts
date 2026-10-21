import { Entry } from './Entry';

/** The last stop in a period that is still going on, read as "Ongoing" (DES-NAV-009). It can't be visited. */
export class OngoingStop extends Entry {
  constructor() {
    super('ongoing', 'Ongoing', '', []);
  }

  get sortKey(): number {
    return Number.POSITIVE_INFINITY;
  }

  override get isVisitable(): boolean {
    return false;
  }
}
