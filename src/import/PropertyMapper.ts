import { WikidataEntity } from './WikidataEntity';

/** A link read from an item's own statements: this item depends on `target`. */
export interface PropertyLink {
  target: string;
  property: string;
}

/**
 * Which Wikidata properties the import reads, and what each one means
 * (DES-IMP-005). The hardware properties were added after checking the
 * original iPhone, which lists its parts with them rather than with "uses".
 */
export class PropertyMapper {
  /** The item depends on what these point at. */
  static readonly DEPENDS_ON = [
    'P2283', 'P144', 'P1547', 'P828',
    'P618', 'P5307', 'P9192', 'P479', 'P2935', 'P306', 'P880',
  ];

  /** "Has part(s)": the parts of a moment are its dependencies, and the parts of a period are its members. */
  static readonly HAS_PARTS = 'P527';

  /** What these point at depends on the item: they are read backwards, from the query service. */
  static readonly ENABLED = ['P1542', 'P1536'];

  static readonly PART_OF = 'P361';
  static readonly SIGNIFICANT_EVENT = 'P793';

  static readonly MOMENT_DATE = ['P575', 'P571', 'P585', 'P577', 'P619'];
  static readonly PERIOD_START = ['P580', 'P571'];
  static readonly PERIOD_END = ['P582', 'P576'];
  static readonly LOCATION = ['P276', 'P495', 'P17'];
  static readonly TAGS = ['P31', 'P279'];

  /** English names of the properties, for the report. */
  static readonly NAMES: Record<string, string> = {
    P2283: 'uses',
    P144: 'based on',
    P1547: 'depends on software',
    P828: 'has cause',
    P618: 'source of energy',
    P5307: 'display technology',
    P9192: 'sensors',
    P479: 'input device',
    P2935: 'connector',
    P306: 'operating system',
    P880: 'CPU',
    P527: 'has part(s)',
    P1542: 'has effect',
    P1536: 'immediate cause of',
    P361: 'part of',
    P793: 'significant event',
    P575: 'time of discovery or invention',
    P571: 'inception',
    P585: 'point in time',
    P577: 'publication date',
    P619: 'launch date',
    P580: 'start time',
    P582: 'end time',
    P576: 'dissolved, abolished or demolished date',
    curation: 'the curation file',
  };

  /** A period has a start or end time. Anything else is a moment. */
  isPeriod(entity: WikidataEntity): boolean {
    return entity.has('P580') || entity.has('P582');
  }

  /** What the item depends on, from its own statements. */
  dependencies(entity: WikidataEntity, isPeriod: boolean): PropertyLink[] {
    const properties = isPeriod ? PropertyMapper.DEPENDS_ON : [...PropertyMapper.DEPENDS_ON, PropertyMapper.HAS_PARTS];
    return properties.flatMap((property) => entity.items(property).map((target) => ({ target, property })));
  }

  /** The members a period lists for itself. */
  members(entity: WikidataEntity): PropertyLink[] {
    return [PropertyMapper.HAS_PARTS, PropertyMapper.SIGNIFICANT_EVENT].flatMap((property) =>
      entity.items(property).map((target) => ({ target, property })),
    );
  }

  /** The larger things the item says it is part of. */
  partOf(entity: WikidataEntity): string[] {
    return entity.items(PropertyMapper.PART_OF);
  }

  location(entity: WikidataEntity): string | undefined {
    return PropertyMapper.LOCATION.map((p) => entity.items(p)[0]).find((id) => id !== undefined);
  }

  tags(entity: WikidataEntity): string[] {
    return [...new Set(PropertyMapper.TAGS.flatMap((p) => entity.items(p)))].slice(0, 3);
  }

  static nameOf(property: string): string {
    return PropertyMapper.NAMES[property] ?? property;
  }
}
