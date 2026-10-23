import { writeFileSync } from 'node:fs';
import { Curation } from './Curation';
import { CurationApplier } from './CurationApplier';
import { EntryDates } from './EntryDates';
import { ImportLog } from './ImportLog';
import { ImportReport } from './ImportReport';
import { ImportValidator } from './ImportValidator';
import { LabelLookup } from './LabelLookup';
import { PropertyMapper } from './PropertyMapper';
import { RecordMaker } from './RecordMaker';
import { SeedCollector } from './SeedCollector';
import { SeedWriter } from './SeedWriter';
import { WikidataCache } from './WikidataCache';
import { WikidataClient } from './WikidataClient';

// The Wikidata import (DES-IMP-001). Run with "npm run import", or
// "npm run import -- --refresh" to ask Wikidata afresh instead of using the cache.

const USER_AGENT = 'DependencyTree/0.1 (https://github.com/Chessel85/DependencyTree)';
const CURATION_FILE = 'data/curation.json';
const SEED_FILE = 'data/seed.json';
const REPORT_FILE = 'data/import-report.md';
const CACHE_FOLDER = '.cache/wikidata';

const refresh = process.argv.includes('--refresh');
const when = new Date();
const curation = Curation.read(CURATION_FILE);
const source = new WikidataCache(new WikidataClient(USER_AGENT), CACHE_FOLDER, refresh);
const mapper = new PropertyMapper();
const dates = new EntryDates(curation, mapper);
const log = new ImportLog();

const graph = await new SeedCollector(source, mapper, dates, curation).collect();
new CurationApplier(curation, log).apply(graph);

const labels = new LabelLookup(source);
const maker = new RecordMaker(curation, mapper, dates, labels, log);
await labels.load(maker.mentionedItems(graph));
const record = maker.make(graph);
new ImportValidator(log).validate(record);

new SeedWriter().write(SEED_FILE, record, when);
writeFileSync(REPORT_FILE, new ImportReport(graph, record, log, when).render());
console.log(`Wrote ${SEED_FILE} with ${record.moments.length} moments and ${record.periods?.length ?? 0} periods, and ${REPORT_FILE}.`);
