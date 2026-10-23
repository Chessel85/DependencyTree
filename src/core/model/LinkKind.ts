/**
 * The kinds of link between two moments (DES-REL-001). Each is stored on the
 * later moment, and read backwards from the earlier one.
 */
export enum LinkKind {
  /** The later moment could not have happened without the earlier one. */
  DependsOn = 'depends on',
  /** The earlier moment brought the later one about. */
  CausedBy = 'caused by',
  /** The earlier moment shaped the later one, more softly than a dependency. */
  InfluencedBy = 'influenced by',
}
