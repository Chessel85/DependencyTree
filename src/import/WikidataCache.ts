import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { WikidataEntity, WikidataEntityRecord } from './WikidataEntity';
import { ReverseLink, WikidataSource } from './WikidataSource';

/**
 * Keeps each Wikidata answer in a folder, so that running the import again
 * doesn't ask Wikidata again, and gives the same result. Pass `refresh` to
 * ask Wikidata afresh and overwrite what is kept.
 */
export class WikidataCache implements WikidataSource {
  constructor(
    private readonly inner: WikidataSource,
    private readonly folder: string,
    private readonly refresh = false,
  ) {
    mkdirSync(join(folder, 'entities'), { recursive: true });
    mkdirSync(join(folder, 'links-to'), { recursive: true });
  }

  async entities(ids: readonly string[]): Promise<Map<string, WikidataEntity>> {
    const found = new Map<string, WikidataEntity>();
    const missing: string[] = [];
    for (const id of ids) {
      const kept = this.read<WikidataEntityRecord>(this.entityFile(id));
      if (kept) {
        found.set(id, new WikidataEntity(kept));
      } else {
        missing.push(id);
      }
    }
    if (missing.length > 0) {
      for (const [id, entity] of await this.inner.entities(missing)) {
        this.write(this.entityFile(id), entity.record);
        found.set(id, entity);
      }
    }
    return new Map(ids.filter((id) => found.has(id)).map((id) => [id, found.get(id)!]));
  }

  async linksTo(property: string, targets: readonly string[]): Promise<ReverseLink[]> {
    const links: ReverseLink[] = [];
    const missing: string[] = [];
    for (const target of targets) {
      const kept = this.read<string[]>(this.linksFile(property, target));
      if (kept) {
        links.push(...kept.map((subject) => ({ subject, target })));
      } else {
        missing.push(target);
      }
    }
    if (missing.length > 0) {
      const fresh = await this.inner.linksTo(property, missing);
      for (const target of missing) {
        const subjects = fresh.filter((l) => l.target === target).map((l) => l.subject);
        this.write(this.linksFile(property, target), subjects);
        links.push(...subjects.map((subject) => ({ subject, target })));
      }
    }
    return links;
  }

  private entityFile(id: string): string {
    return join(this.folder, 'entities', `${id}.json`);
  }

  private linksFile(property: string, target: string): string {
    return join(this.folder, 'links-to', `${property}-${target}.json`);
  }

  private read<T>(file: string): T | undefined {
    if (this.refresh || !existsSync(file)) {
      return undefined;
    }
    return JSON.parse(readFileSync(file, 'utf8')) as T;
  }

  private write(file: string, value: unknown): void {
    writeFileSync(file, JSON.stringify(value));
  }
}
