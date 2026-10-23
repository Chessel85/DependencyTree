import { LinkKind } from '../model/LinkKind';

/** The kinds of list an entry can show, in tab order (DES-NAV-002, DES-NAV-012). */
export enum ListKind {
  Moments = 'Moments',
  DependedOn = 'Depended on',
  CausedBy = 'Caused by',
  InfluencedBy = 'Influenced by',
  PartOf = 'Part of',
  Enabled = 'Enabled',
  Caused = 'Caused',
  Influenced = 'Influenced',
}

/** The lists of earlier moments, which Left Arrow follows, with the kind of link each shows. */
export const EARLIER_LISTS: ReadonlyMap<ListKind, LinkKind> = new Map([
  [ListKind.DependedOn, LinkKind.DependsOn],
  [ListKind.CausedBy, LinkKind.CausedBy],
  [ListKind.InfluencedBy, LinkKind.InfluencedBy],
]);

/** The lists of later moments, which Right Arrow follows, with the kind of link each shows. */
export const LATER_LISTS: ReadonlyMap<ListKind, LinkKind> = new Map([
  [ListKind.Enabled, LinkKind.DependsOn],
  [ListKind.Caused, LinkKind.CausedBy],
  [ListKind.Influenced, LinkKind.InfluencedBy],
]);
