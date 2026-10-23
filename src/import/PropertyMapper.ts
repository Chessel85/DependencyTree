import { CauseStrength } from '../core/model/Link';
import { LinkKind } from '../core/model/LinkKind';
import { WikidataEntity } from './WikidataEntity';

/** What a property's links mean: their kind, and for a cause, how direct it is. */
export interface LinkMeaning {
  kind: LinkKind;
  strength?: CauseStrength;
}

/** A link read from a property: one item depends on, was caused by or was influenced by `target`. */
export interface PropertyLink extends LinkMeaning {
  target: string;
  property: string;
}

/**
 * Which Wikidata properties the import reads, and what each one means
 * (DES-IMP-005). The hardware properties were added after checking the
 * original iPhone, which lists its parts with them rather than with "uses".
 */
export class PropertyMapper {
  /** The item depends on, was caused by or was influenced by what these point at. */
  static readonly EARLIER: Record<string, LinkMeaning> = {
    P2283: { kind: LinkKind.DependsOn },
    P144: { kind: LinkKind.DependsOn },
    P1547: { kind: LinkKind.DependsOn },
    P618: { kind: LinkKind.DependsOn },
    P5307: { kind: LinkKind.DependsOn },
    P9192: { kind: LinkKind.DependsOn },
    P479: { kind: LinkKind.DependsOn },
    P2935: { kind: LinkKind.DependsOn },
    P306: { kind: LinkKind.DependsOn },
    P880: { kind: LinkKind.DependsOn },
    P828: { kind: LinkKind.CausedBy },
    P1478: { kind: LinkKind.CausedBy, strength: 'immediate' },
    P1479: { kind: LinkKind.CausedBy, strength: 'contributing' },
    P737: { kind: LinkKind.InfluencedBy },
  };

  /** "Has part(s)": the parts of a moment are its dependencies, and the parts of a period are its members. */
  static readonly HAS_PARTS = 'P527';

  /** What these point at was caused by the item: they are read backwards, from the query service. */
  static readonly LATER: Record<string, LinkMeaning> = {
    P1542: { kind: LinkKind.CausedBy },
    P1536: { kind: LinkKind.CausedBy, strength: 'immediate' },
    P1537: { kind: LinkKind.CausedBy, strength: 'contributing' },
  };

  /**
   * Classes whose instances are ideas rather than events or inventions
   * (DES-DATA-009): ideology, political ideology, political concept,
   * concept, theory, scientific theory, economic theory, doctrine, school of
   * thought, philosophical movement, political movement and religion.
   */
  static readonly IDEA_CLASSES = new Set([
    'Q7257', 'Q12909644', 'Q33104069', 'Q151885', 'Q17737', 'Q3239681',
    'Q1401304', 'Q117850', 'Q1387659', 'Q2915955', 'Q2738074', 'Q9174',
  ]);

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
    P1478: 'has immediate cause',
    P1479: 'has contributing factor',
    P737: 'influenced by',
    P1542: 'has effect',
    P1536: 'immediate cause of',
    P1537: 'contributing factor of',
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

  /** What the item depends on, was caused by or was influenced by, from its own statements. */
  earlierLinks(entity: WikidataEntity, isPeriod: boolean): PropertyLink[] {
    const meanings = Object.entries(PropertyMapper.EARLIER);
    if (!isPeriod) {
      meanings.push([PropertyMapper.HAS_PARTS, { kind: LinkKind.DependsOn }]);
    }
    return meanings.flatMap(([property, meaning]) => entity.items(property).map((target) => ({ target, property, ...meaning })));
  }

  /** The members a period lists for itself, as Wikidata IDs with the property that gave each. */
  members(entity: WikidataEntity): { target: string; property: string }[] {
    return [PropertyMapper.HAS_PARTS, PropertyMapper.SIGNIFICANT_EVENT].flatMap((property) =>
      entity.items(property).map((target) => ({ target, property })),
    );
  }

  /** Whether the item is an instance of one of the idea classes. */
  isIdea(entity: WikidataEntity): boolean {
    return entity.items('P31').some((c) => PropertyMapper.IDEA_CLASSES.has(c));
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
