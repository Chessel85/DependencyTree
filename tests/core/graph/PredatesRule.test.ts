import { describe, expect, it } from 'vitest';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { PredatesRule } from '../../../src/core/graph/PredatesRule';
import { Dependency } from '../../../src/core/model/Dependency';
import { TestMoments } from '../../TestMoments';

const rule = new PredatesRule();

describe('PredatesRule', () => {
  it('allows a dependency that came first', () => {
    const link = new Dependency(TestMoments.moment('laptop', 1981), TestMoments.moment('battery', 1800));
    expect(rule.allows(link)).toBe(true);
  });

  it('rejects a dependency that certainly came later', () => {
    const link = new Dependency(TestMoments.moment('early', 1991), TestMoments.moment('late', 2007));
    expect(rule.allows(link)).toBe(false);
  });

  it('allows a dependency whose rough date might have come first', () => {
    // A, around 1450, depends on B, somewhere in the 15th century (1401 to 1500).
    const a = TestMoments.moment('a', 1450, DatePrecision.Year, true);
    const b = TestMoments.moment('b', 1450, DatePrecision.Century);
    expect(rule.allows(new Dependency(a, b))).toBe(true);
  });

  it('allows a dependency in the same year', () => {
    const link = new Dependency(TestMoments.moment('a', 1991), TestMoments.moment('b', 1991));
    expect(rule.allows(link)).toBe(true);
  });
});
