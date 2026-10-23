/** One value or "no value" in a Wikidata statement, as the wbgetentities API gives it. */
export interface WikidataSnak {
  snaktype: string;
  property: string;
  datavalue?: { type: string; value: unknown };
}

/** One Wikidata statement, with its rank and qualifiers. */
export interface WikidataClaim {
  mainsnak: WikidataSnak;
  rank: 'preferred' | 'normal' | 'deprecated';
  qualifiers?: Record<string, WikidataSnak[]>;
}

/** A Wikidata item as the wbgetentities API gives it. */
export interface WikidataEntityRecord {
  id: string;
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  claims?: Record<string, WikidataClaim[]>;
}

/** The ID of the item a snak points at, if it points at one. */
export function itemIdOf(snak: WikidataSnak): string | undefined {
  if (snak.datavalue?.type !== 'wikibase-entityid') {
    return undefined;
  }
  return (snak.datavalue.value as { id: string }).id;
}

/** A Wikidata item, read the way the import needs it. */
export class WikidataEntity {
  constructor(readonly record: WikidataEntityRecord) {}

  get id(): string {
    return this.record.id;
  }

  /** The English label, or else the label for all languages ("mul"), which many items now use instead. */
  get label(): string | undefined {
    const labels = this.record.labels ?? {};
    return (labels.en ?? labels.mul)?.value;
  }

  get description(): string | undefined {
    return this.record.descriptions?.en?.value;
  }

  /**
   * The statements for a property that Wikidata itself would show first:
   * the preferred ones if there are any, otherwise the normal ones.
   * Deprecated statements are never used.
   */
  claims(property: string): WikidataClaim[] {
    const usable = (this.record.claims?.[property] ?? []).filter((c) => c.rank !== 'deprecated');
    const preferred = usable.filter((c) => c.rank === 'preferred');
    return preferred.length > 0 ? preferred : usable;
  }

  has(property: string): boolean {
    return this.claims(property).length > 0;
  }

  /** The IDs of the items this property points at. */
  items(property: string): string[] {
    return this.claims(property)
      .map((c) => itemIdOf(c.mainsnak))
      .filter((id): id is string => id !== undefined);
  }
}
