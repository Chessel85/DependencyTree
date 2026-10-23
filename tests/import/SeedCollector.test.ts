import { describe, expect, it } from 'vitest';
import { Curation, CurationRecord } from '../../src/import/Curation';
import { EntryDates } from '../../src/import/EntryDates';
import { ImportedGraph } from '../../src/import/ImportedGraph';
import { PropertyMapper } from '../../src/import/PropertyMapper';
import { SeedCollector } from '../../src/import/SeedCollector';
import { WikidataEntityRecord } from '../../src/import/WikidataEntity';
import { FakeWikidataSource, TestItems } from './TestItems';

function collect(items: WikidataEntityRecord[], record: CurationRecord): Promise<ImportedGraph> {
  const curation = new Curation(record);
  const mapper = new PropertyMapper();
  return new SeedCollector(new FakeWikidataSource(items), mapper, new EntryDates(curation, mapper), curation).collect();
}

describe('SeedCollector', () => {
  it('follows dependencies backwards from the root', async () => {
    const graph = await collect(
      [TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971, ['Q1']), TestItems.moment('Q1', 1958)],
      { roots: ['Q3'] },
    );
    expect([...graph.entries.keys()]).toEqual(['Q3', 'Q2', 'Q1']);
    expect(graph.links).toContainEqual({ dependent: 'Q2', dependency: 'Q1', source: 'P2283' });
  });

  it('reads "has effect" backwards, so the effect depends on the cause', async () => {
    const cause = TestItems.item('Q1', 'cause', { P585: [TestItems.time('+1914-00-00')], P1542: [TestItems.link('Q2')] });
    const graph = await collect([cause, TestItems.moment('Q2', 1918)], { roots: ['Q2'] });
    expect(graph.has('Q1')).toBe(true);
    expect(graph.links).toContainEqual({ dependent: 'Q2', dependency: 'Q1', source: 'P1542' });
  });

  it('leaves out an item with no date, and does not walk through it', async () => {
    const undated = TestItems.item('Q2', 'undated', { P2283: [TestItems.link('Q1')] });
    const graph = await collect([TestItems.moment('Q3', 2007, ['Q2']), undated, TestItems.moment('Q1', 1958)], { roots: ['Q3'] });
    expect(graph.undated.has('Q2')).toBe(true);
    expect(graph.has('Q2')).toBe(false);
    expect(graph.has('Q1')).toBe(false);
  });

  it('leaves out an item with no English name', async () => {
    const unnamed = { ...TestItems.moment('Q2', 1991), labels: { ru: { value: 'Декларация' } } };
    const graph = await collect([TestItems.moment('Q3', 2007, ['Q2']), unnamed], { roots: ['Q3'] });
    expect(graph.unnamed.has('Q2')).toBe(true);
    expect(graph.has('Q2')).toBe(false);
  });

  it('uses a date from the curation file', async () => {
    const undated = TestItems.item('Q2', 'undated');
    const graph = await collect([TestItems.moment('Q3', 2007, ['Q2']), undated], {
      roots: ['Q3'],
      entries: { Q2: { date: { year: 1991, precision: 'year' } } },
    });
    expect(graph.has('Q2')).toBe(true);
  });

  it('stops at the most entries allowed', async () => {
    const graph = await collect(
      [TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971, ['Q1']), TestItems.moment('Q1', 1958)],
      { roots: ['Q3'], maxEntries: 2 },
    );
    expect(graph.size).toBe(2);
    expect(graph.stoppedAtLimit).toBe(true);
  });

  it('leaves out an item that came after everything that links to it', async () => {
    const graph = await collect([TestItems.moment('Q3', 2007, ['Q2', 'Q4']), TestItems.moment('Q2', 2009), TestItems.moment('Q4', 1991)], {
      roots: ['Q3'],
    });
    expect(graph.tooLate.has('Q2')).toBe(true);
    expect(graph.has('Q2')).toBe(false);
    expect(graph.has('Q4')).toBe(true);
  });

  it('skips excluded items', async () => {
    const graph = await collect([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971)], {
      roots: ['Q3'],
      exclude: ['Q2'],
    });
    expect(graph.has('Q2')).toBe(false);
  });

  it('adds a period that a gathered moment is part of', async () => {
    const moment = TestItems.item('Q2', 'apollo', { P575: [TestItems.time('+1969-00-00')], P361: [TestItems.link('Q1')] });
    const period = TestItems.item('Q1', 'space race', {
      P580: [TestItems.time('+1957-00-00')],
      P582: [TestItems.time('+1975-00-00')],
    });
    const graph = await collect([moment, period], { roots: ['Q2'] });
    expect(graph.isPeriod('Q1')).toBe(true);
    expect(graph.memberships).toContainEqual({ period: 'Q1', member: 'Q2', source: 'P361' });
  });
});
