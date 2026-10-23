import { LinkKind } from './LinkKind';
import { Moment } from './Moment';

/** How directly a cause brought its effect about (DES-REL-008). An ordinary cause has no strength. */
export type CauseStrength = 'immediate' | 'contributing';

/**
 * One link between two moments: `later` depends on, was caused by, or was
 * influenced by `earlier` (DES-REL-001). It can carry a short note saying
 * why it exists (DES-REL-009).
 */
export class Link {
  constructor(
    readonly later: Moment,
    readonly earlier: Moment,
    readonly kind: LinkKind = LinkKind.DependsOn,
    readonly strength?: CauseStrength,
    readonly note?: string,
  ) {}
}
