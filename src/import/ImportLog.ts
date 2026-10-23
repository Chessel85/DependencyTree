/** A link, named for the report: `later` depends on, was caused by or was influenced by `earlier`. */
export interface LinkNote {
  later: string;
  earlier: string;
  kind: string;
  source: string;
}

/** One end of a link that was a whole period, and the moment of the period used instead. */
export interface PeriodEnd {
  period: string;
  end: 'start' | 'end';
}

/** A link on or from a whole period, moved to one of the period's moments (DES-REL-007, DES-IMP-008). */
export interface MovedLinkNote extends LinkNote {
  /** One period, or two if the link joins two periods. */
  ends: PeriodEnd[];
}

/** A link that broke the predates rule, with both dates as written. */
export interface PredatesNote extends LinkNote {
  laterDate: string;
  earlierDate: string;
}

export interface MemberNote {
  period: string;
  member: string;
}

/** An item Wikidata gives as a period, imported as a moment because it has no real start or end moment. */
export interface NotPeriodNote {
  name: string;
  missing: string;
}

export interface CycleNote {
  /** The moments around the circle, in order. */
  moments: string[];
  /** The link left out to break it. */
  removed: LinkNote;
}

/** What the import found and did, gathered by each stage for the report (DES-IMP-007). */
export class ImportLog {
  readonly moved: MovedLinkNote[] = [];
  readonly predates: PredatesNote[] = [];
  readonly outsidePeriod: MemberNote[] = [];
  readonly cycles: CycleNote[] = [];
  readonly notPeriods: NotPeriodNote[] = [];
  /** Things in the curation file that had no effect, so may be out of date. */
  readonly curation: string[] = [];
}
