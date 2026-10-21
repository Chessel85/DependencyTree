/** What happened when the user pressed Left Arrow or Right Arrow. */
export enum StepResult {
  /** Went to another entry. */
  Moved,
  /** Moved to the next or previous stop within a period. */
  Highlighted,
  /** Tried to step past the start or end of a period (DES-ANN-011). */
  Bumped,
  /** Nothing happened, silently (DES-KEY-013). */
  Nothing,
}
