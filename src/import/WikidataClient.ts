import { WikidataEntity, WikidataEntityRecord } from './WikidataEntity';
import { ReverseLink, WikidataSource } from './WikidataSource';

const API = 'https://www.wikidata.org/w/api.php';
const SPARQL = 'https://query.wikidata.org/sparql';
const BATCH = 50;
const ENTITY = 'http://www.wikidata.org/entity/';

/** Reads items from the live Wikidata service: the wbgetentities API, and the query service for reverse links. */
export class WikidataClient implements WikidataSource {
  /** Wikidata asks every tool to say who it is and how to reach its author. */
  constructor(private readonly userAgent: string) {}

  async entities(ids: readonly string[]): Promise<Map<string, WikidataEntity>> {
    const found = new Map<string, WikidataEntity>();
    for (let i = 0; i < ids.length; i += BATCH) {
      const batch = ids.slice(i, i + BATCH);
      const address = new URL(API);
      address.search = new URLSearchParams({
        action: 'wbgetentities',
        ids: batch.join('|'),
        props: 'labels|descriptions|claims|sitelinks',
        sitefilter: 'enwiki',
        languages: 'en|mul',
        format: 'json',
      }).toString();
      const body = (await this.fetchJson(address)) as { entities: Record<string, WikidataEntityRecord & { missing?: string }> };
      for (const id of batch) {
        const record = body.entities[id];
        if (record && record.missing === undefined) {
          found.set(id, new WikidataEntity(record));
        }
      }
    }
    return found;
  }

  async linksTo(property: string, targets: readonly string[]): Promise<ReverseLink[]> {
    const links: ReverseLink[] = [];
    for (let i = 0; i < targets.length; i += BATCH) {
      const values = targets.slice(i, i + BATCH).map((t) => `wd:${t}`).join(' ');
      const query = `SELECT ?subject ?target WHERE { VALUES ?target { ${values} } ?subject wdt:${property} ?target . }`;
      const address = new URL(SPARQL);
      address.search = new URLSearchParams({ query, format: 'json' }).toString();
      const body = (await this.fetchJson(address)) as {
        results: { bindings: { subject: { value: string }; target: { value: string } }[] };
      };
      for (const row of body.results.bindings) {
        if (row.subject.value.startsWith(ENTITY)) {
          links.push({ subject: row.subject.value.slice(ENTITY.length), target: row.target.value.slice(ENTITY.length) });
        }
      }
    }
    return links;
  }

  private async fetchJson(address: URL): Promise<unknown> {
    const response = await fetch(address, { headers: { 'User-Agent': this.userAgent, Accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`Wikidata answered ${response.status} ${response.statusText} for ${address}`);
    }
    return response.json();
  }
}
