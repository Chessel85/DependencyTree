/** What happened when the user pressed Left Arrow or Right Arrow. */
export enum StepResult {
  /** Went to another entry. */
  Moved,
  /** The list to follow is empty (DES-ANN-011). */
  Bumped,
  /** Nothing happened, silently (DES-KEY-013). */
  Nothing,
}
