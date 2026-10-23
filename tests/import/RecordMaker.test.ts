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
    expect(data.moments.find((m) => m.id === 'q2')!.links).toEqual([{ to: 'truman-doctrine', kind: 'depends on', source: 'P2283' }]);
    expect(log.moved).toEqual([
      { later: 'Q2', earlier: 'Cold War', kind: 'depends on', source: 'P2283', ends: [{ period: 'Cold War', end: 'start' }] },
    ]);
  });

  it('moves a cause that is a whole period to its end moment (DES-REL-007)', async () => {
    const summit = TestItems.item('Q2', 'summit', { P585: [TestItems.time('+1992-00-00')], P828: [TestItems.link('Q1')] });
    const { data } = await make([summit, ...coldWarItems], { roots: ['Q2'] });
    expect(data.moments.find((m) => m.id === 'summit')!.links).toEqual([{ to: 'gorbachev-resigns', kind: 'caused by', source: 'P828' }]);
  });

  it("uses a cause's start moment when its end came later than the effect", async () => {
    const crisis = TestItems.item('Q2', 'crisis', { P585: [TestItems.time('+1962-00-00')], P828: [TestItems.link('Q1')] });
    const { data } = await make([crisis, ...coldWarItems], { roots: ['Q2'] });
    expect(data.moments.find((m) => m.id === 'crisis')!.links![0].to).toBe('truman-doctrine');
  });

  it('records where each link came from, with its kind and note', async () => {
    const { data } = await make([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971), TestItems.moment('Q1', 1958)], {
      roots: ['Q3'],
      addLinks: [{ later: 'Q3', earlier: 'Q1', kind: 'influenced by', note: 'Why.' }],
    });
    expect(data.moments.find((m) => m.id === 'q3')!.links).toEqual([
      { to: 'q2', kind: 'depends on', source: 'P2283' },
      { to: 'q1', kind: 'influenced by', note: 'Why.', source: 'curation' },
    ]);
  });

  it('notes a curated link that Wikidata now has', async () => {
    const { log } = await make([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971)], {
      roots: ['Q3'],
      addLinks: [{ later: 'Q3', earlier: 'Q2' }],
    });
    expect(log.curation).toHaveLength(1);
  });

  it("adds a curated note to a link Wikidata has, without noting it", async () => {
    const { data, log } = await make([TestItems.moment('Q3', 2007, ['Q2']), TestItems.moment('Q2', 1971)], {
      roots: ['Q3'],
      addLinks: [{ later: 'Q3', earlier: 'Q2', note: 'Why.' }],
    });
    expect(data.moments.find((m) => m.id === 'q3')!.links).toEqual([{ to: 'q2', kind: 'depends on', note: 'Why.', source: 'P2283' }]);
    expect(log.curation).toEqual([]);
  });

  it('marks an item that is an instance of an idea class as an idea (DES-DATA-009)', async () => {
    const idea = TestItems.item('Q2', 'revanchism', { P571: [TestItems.time('+1871-00-00')], P31: [TestItems.link('Q7257')] });
    const war = TestItems.item('Q3', 'war', { P585: [TestItems.time('+1914-00-00')], P828: [TestItems.link('Q2')] });
    const { data } = await make([war, idea], { roots: ['Q3'] });
    expect(data.moments.find((m) => m.id === 'revanchism')!.idea).toBe(true);
    expect(data.moments.find((m) => m.id === 'war')!.idea).toBeUndefined();
  });
});
