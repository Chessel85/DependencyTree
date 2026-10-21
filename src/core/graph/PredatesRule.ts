import { Dependency } from '../model/Dependency';

/**
 * A dependency must come before the moment that depends on it. With rough
 * dates, it is rejected only when it certainly came later (DES-REL-002).
 */
export class PredatesRule {
  allows(link: Dependency): boolean {
    return !link.dependency.date.range().isCertainlyAfter(link.dependent.date.range());
  }

  /** The links that break the rule. */
  breaches(links: readonly Dependency[]): Dependency[] {
    return links.filter((link) => !this.allows(link));
  }
}
