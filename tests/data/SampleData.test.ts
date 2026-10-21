import { describe, expect, it } from 'vitest';
import sample from '../../data/sample.json';
import { DatasetReader, DatasetRecord } from '../../src/core/data/DatasetReader';
import { CycleDetector } from '../../src/core/graph/CycleDetector';
import { PredatesRule } from '../../src/core/graph/PredatesRule';

const graph = new DatasetReader().read(sample as DatasetRecord);

describe('The hand-made sample', () => {
  it('reads without errors', () => {
    expect(graph.allMoments.length).toBeGreaterThanOrEqual(10);
  });

  it('has no dependency that came later than its dependent', () => {
    expect(new PredatesRule().breaches(graph.dependencies)).toEqual([]);
  });

  it('has no circular dependencies', () => {
    expect(new CycleDetector().findCycles(graph)).toEqual([]);
  });

  it('includes the iPhone, where the page starts', () => {
    expect(graph.find('iphone')).toBeDefined();
  });
});
