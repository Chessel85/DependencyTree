import { WikidataEntity } from './WikidataEntity';

/** A statement found by looking backwards: `subject` has `property` pointing at `target`. */
export interface ReverseLink {
  subject: string;
  target: string;
}

/** Where the import gets Wikidata items from: the live service, a cache of it, or saved test data. */
export interface WikidataSource {
  /** The items with these IDs, keyed by the ID asked for. Items that don't exist are left out. */
  entities(ids: readonly string[]): Promise<Map<string, WikidataEntity>>;

  /** The items that have `property` pointing at any of the targets. */
  linksTo(property: string, targets: readonly string[]): Promise<ReverseLink[]>;
}
