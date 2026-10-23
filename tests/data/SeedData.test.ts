import { describe, expect, it } from 'vitest';
import seed from '../../data/seed.json';
import { DatasetReader, DatasetRecord } from '../../src/core/data/DatasetReader';
import { ContainmentRule } from '../../src/core/graph/ContainmentRule';
import { CycleDetector } from '../../src/core/graph/CycleDetector';
import { PredatesRule } from '../../src/core/graph/PredatesRule';

const record = seed as DatasetRecord;
const dataset = new DatasetReader().read(record);

describe('The Wikidata seed file', () => {
  it('reads without errors, with 50 to 200 entries (REQ-CONT-007)', () => {
    const size = dataset.graph.allMoments.length + dataset.periods.length;
    expect(size).toBeGreaterThanOrEqual(50);
    expect(size).toBeLessThanOrEqual(250);
  });

  it('has no link whose earlier end came later', () => {
    expect(new PredatesRule().breaches(dataset.graph.links)).toEqual([]);
  });

  it('has no circular links', () => {
    expect(new CycleDetector().findCycles(dataset.graph)).toEqual([]);
  });

  it('has nothing outside the period that contains it', () => {
    const rule = new ContainmentRule();
    for (const period of dataset.periods) {
      expect(rule.breaches(period).map((e) => e.id), period.id).toEqual([]);
    }
  });

  it('includes the entry where the page starts', () => {
    expect(dataset.find(record.start!)).toBeDefined();
  });
});
