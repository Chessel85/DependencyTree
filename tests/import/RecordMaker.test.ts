import { describe, expect, it } from 'vitest';
import { DatasetRecord } from '../../src/core/data/DatasetReader';
import { Curation, CurationRecord } from '../../src/import/Curation';
import { CurationApplier } from '../../src/import/CurationApplier';
import { EntryDates } from '../../src/import/EntryDates';
import { ImportLog } from '../../src/import/ImportLog';
import { LabelLookup } from '../../src/import/LabelLookup';
import { PropertyMapper } from '../../src/import/PropertyMapper';
import { RecordMaker } from '../../src/import/RecordMaker';
import { SeedCollector } from '../../src/import/SeedCollector';
import { WikidataEntityRecord } from '../../src/import/WikidataEntity';
import { FakeWikidataSource, TestItems } from './TestItems';

async function make(items: WikidataEntityRecord[], record: CurationRecord): Promise<{ data: DatasetRecord; log: ImportLog }> {
  const source = new FakeWikidataSource(items);
  const curation = new Curation(record);
  const mapper = new PropertyMapper();
  const dates = new EntryDates(curation, mapper);
  const log = new ImportLog();
  const graph = await new SeedCollector(source, mapper, dates, curation).collect();
  new CurationApplier(curation, log).apply(graph);
  const labels = new LabelLookup(source);
  const maker = new RecordMaker(curation, mapper, dates, labels, log);
  await labels.load(maker.mentionedItems(graph));
  return { data: maker.make(graph), log };
}

const coldWar = TestItems.item('Q1', 'Cold War', {
  P580: [TestItems.time('+1947-00-00')],
  P582: [TestItems.time('+1991-12-25', 11)],
  P793: [TestItems.link('Q10'), TestItems.link('Q11'), TestItems.link('Q12')],
});
const truman = TestItems.item('Q10', 'Truman Doctrine', { P585: [TestItems.time('+1947-03-12', 11)] });
const resignation = TestItems.item('Q11', 'Gorbachev resigns', { P585: [TestItems.time('+1991-12-25', 11)] });
const apollo = TestItems.item('Q12', 'Apollo 11', { P619: [TestItems.time('+1969-07-16', 11)] });
const coldWarItems = [coldWar, truman, resignation, apollo];

describe('RecordMaker', () => {
  it('names entries and gives them address-friendly IDs, keeping the Wikidata ID', async () => {
    const { data } = await make([TestItems.item('Q9', 'lithium-ion battery', { P575: [TestItems.time('+1991-00-00')] })], {
      roots: ['Q9'],
    });
    expect(data.moments[0]).toMatchObject({
      id: 'lithium-ion-battery',
      name: 'Lithium-ion battery',
      description: 'About lithium-ion battery.',
      wikidata: 'Q9',
    });
    expect(data.start).toBe('lithium-ion-battery');
  });

  it('keeps a name that starts with a small letter on purpose', async () => {
    const { data } = await make([TestItems.item('Q9', 'iPhone', { P575: [TestItems.time('+2007-00-00')] })], { roots: ['Q9'] });
    expect(data.moments[0].name).toBe('iPhone');
  });

  it('starts and ends a period with the real events on its start and end dates (DES-IMP-008)', async () => {
    const { data } = await make(coldWarItems, { roots: ['Q1'] });
    expect(data.periods![0]).toMatchObject({ id: 'cold-war', start: 'truman-doctrine', end: 'gorbachev-resigns', contains: [] });
    // Apollo 11 is not on either date, and nothing else reaches it, so it isn't fetched.
    expect(data.moments.map((m) => m.id).sort()).toEqual(['gorbachev-resigns', 'truman-doctrine']);
  });

  it('imports a period with no real start moment as a moment at its start date, and notes it', async () => {
    const lonely = TestItems.item('Q1', 'Walkie-talkie', { P580: [TestItems.time('+1940-00-00')] });
    const { data, log } = await make([lonely], { roots: ['Q1'] });
    expect(data.periods).toEqual([]);
    expect(data.moments[0]).toMatchObject({ id: 'walkie-talkie', date: { year: 1940, precision: 'year' } });
    expect(log.notPeriods).toEqual([{ name: 'Walkie-talkie', missing: 'start' }]);
  });

  it('uses the start and end moments the curation file names', async () => {
    const { data } = await make(coldWarItems, { roots: ['Q1'], entries: { Q1: { startMoment: 'Q12' } } });
    expect(data.periods![0]).toMatchObject({ start: 'apollo-11', end: 'gorbachev-resigns' });
  });

  it('moves a dependency on a whole period to its start moment, and notes it', async () => {
    const treaty = TestItems.moment('Q2', 1990, ['Q1']);
    const { data, log } = await make([treaty, ...coldWarItems], { roots: ['Q2'] });
    expect(data.moments.find((m) => m.id === 'q2')!.dependsOn).toEqual(['truman-doctrine']);
    expect(log.moved).toEqual([{ dependent: 'Q2', dependency: 'Cold War', source: 'P2283', periods: ['Cold War'] }]);
  });

  it('records where each dependency came from', async () => {
    const { data } = await make([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971), TestItems.moment('Q1', 1958)], {
      roots: ['Q3'],
      addLinks: [{ dependent: 'Q3', dependency: 'Q1' }],
    });
    expect(data.moments.find((m) => m.id === 'q3')!.linkSources).toEqual({ q2: 'P2283', q1: 'curation' });
  });

  it('notes a curated link that Wikidata now has', async () => {
    const { log } = await make([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971)], {
      roots: ['Q3'],
      addLinks: [{ dependent: 'Q3', dependency: 'Q2' }],
    });
    expect(log.curation).toHaveLength(1);
  });
});
