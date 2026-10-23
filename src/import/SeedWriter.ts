import { writeFileSync } from 'node:fs';
import { DatasetRecord } from '../core/data/DatasetReader';

/** Writes the seed file, in the same form as the hand-made sample, so the app can read either. */
export class SeedWriter {
  write(file: string, record: DatasetRecord, when: Date): void {
    const seed = {
      licence: 'CC0-1.0',
      note: `Imported from Wikidata on ${when.toISOString().slice(0, 10)} by npm run import, with data/curation.json applied. Years are astronomical: 1 BCE is 0. Don't edit by hand: correct the curation file and import again.`,
      ...record,
    };
    writeFileSync(file, `${JSON.stringify(seed, null, 2)}\n`);
  }
}
