import { describe, expect, it } from 'vitest';
import { DatePrecision } from '../../../src/core/dates/DatePrecision';
import { ContainmentRule } from '../../../src/core/graph/ContainmentRule';
import { TestMoments } from '../../TestMoments';

const rule = new ContainmentRule();
const m = TestMoments.moment;

describe('ContainmentRule', () => {
  it('accepts moments between the start and end', () => {
    const period = TestMoments.period('war', m('start', 1947), m('end', 1991), [m('net', 1969)]);
    expect(rule.breaches(period)).toEqual([]);
  });

  it('rejects a moment certainly before the start', () => {
    const early = m('early', 1900);
    const period = TestMoments.period('war', m('start', 1947), m('end', 1991), [early]);
    expect(rule.breaches(period)).toEqual([early]);
  });

  it('rejects a moment certainly after the end', () => {
    const late = m('late', 2000);
    const period = TestMoments.period('war', m('start', 1947), m('end', 1991), [late]);
    expect(rule.breaches(period)).toEqual([late]);
  });

  it('accepts anything after the start of a period still going on', () => {
    const period = TestMoments.period('era', m('start', 1970, DatePrecision.Decade), undefined, [m('chip', 1971), m('phone', 2007)]);
    expect(rule.breaches(period)).toEqual([]);
  });

  it('allows for rough dates that might fall inside', () => {
    const rough = m('rough', 1940, DatePrecision.Decade);
    const period = TestMoments.period('war', m('start', 1947), m('end', 1991), [rough]);
    expect(rule.breaches(period)).toEqual([]);
  });

  it('checks the start and end of a smaller period', () => {
    const race = TestMoments.period('race', m('race-start', 1957), m('race-end', 1995));
    const period = TestMoments.period('war', m('start', 1947), m('end', 1991), [race]);
    expect(rule.breaches(period)).toEqual([race]);
  });
});
