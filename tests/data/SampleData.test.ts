import { describe, expect, it } from 'vitest';
import sample from '../../data/sample.json';
import { DatasetReader, DatasetRecord } from '../../src/core/data/DatasetReader';
import { ContainmentRule } from '../../src/core/graph/ContainmentRule';
import { CycleDetector } from '../../src/core/graph/CycleDetector';
import { PredatesRule } from '../../src/core/graph/PredatesRule';

const dataset = new DatasetReader().read(sample as DatasetRecord);

describe('The hand-made sample', () => {
  it('reads without errors', () => {
    expect(dataset.graph.allMoments.length).toBeGreaterThanOrEqual(10);
    expect(dataset.periods.length).toBeGreaterThanOrEqual(3);
  });

  it('has no dependency that came later than its dependent', () => {
    expect(new PredatesRule().breaches(dataset.graph.dependencies)).toEqual([]);
  });

  it('has no circular dependencies', () => {
    expect(new CycleDetector().findCycles(dataset.graph)).toEqual([]);
  });

  it('has nothing outside the period that contains it', () => {
    const rule = new ContainmentRule();
    for (const period of dataset.periods) {
      expect(rule.breaches(period).map((e) => e.id), period.id).toEqual([]);
    }
  });

  it('includes a period inside another, and one still going on', () => {
    expect(dataset.periods.some((p) => p.members.some((m) => dataset.periods.includes(m as never)))).toBe(true);
    expect(dataset.periods.some((p) => p.isOngoing)).toBe(true);
  });

  it('includes the iPhone, where the page starts', () => {
    expect(dataset.find('iphone')).toBeDefined();
  });
});
