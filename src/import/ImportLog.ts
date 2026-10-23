/** A dependency, named for the report. */
export interface LinkNote {
  dependent: string;
  dependency: string;
  source: string;
}

/** A dependency on or from a whole period, moved to the period's start moment (DES-IMP-008). */
export interface MovedLinkNote extends LinkNote {
  /** One period, or two if the link joins two periods. */
  periods: string[];
}

/** A dependency that broke the predates rule, with both dates as written. */
export interface PredatesNote extends LinkNote {
  dependentDate: string;
  dependencyDate: string;
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
