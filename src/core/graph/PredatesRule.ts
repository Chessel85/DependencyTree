import { Link } from '../model/Link';

/**
 * Whatever a moment depended on, was caused by or was influenced by must
 * come before it. With rough dates, a link is rejected only when the earlier
 * end certainly came later (DES-REL-002).
 */
export class PredatesRule {
  allows(link: Link): boolean {
    return !link.earlier.date.range().isCertainlyAfter(link.later.date.range());
  }

  /** The links that break the rule. */
  breaches(links: readonly Link[]): Link[] {
    return links.filter((link) => !this.allows(link));
  }
}
