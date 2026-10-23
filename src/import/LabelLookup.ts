import { WikidataSource } from './WikidataSource';

/** The labels of the items that entries only mention, such as their location and what they are an instance of. */
export class LabelLookup {
  private readonly labels = new Map<string, string>();

  constructor(private readonly source: WikidataSource) {}

  async load(ids: readonly string[]): Promise<void> {
    const missing = [...new Set(ids)].filter((id) => !this.labels.has(id));
    for (const [id, entity] of await this.source.entities(missing)) {
      if (entity.label) {
        this.labels.set(id, entity.label);
      }
    }
  }

  label(id: string): string | undefined {
    return this.labels.get(id);
  }
}
