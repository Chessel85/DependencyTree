import { WikidataClaim, WikidataEntity, WikidataEntityRecord } from '../../src/import/WikidataEntity';
import { ReverseLink, WikidataSource } from '../../src/import/WikidataSource';

/** Builds small Wikidata items, in the form the wbgetentities API gives them, for tests. */
export class TestItems {
  /** A statement pointing at another item. */
  static link(target: string, rank: WikidataClaim['rank'] = 'normal'): WikidataClaim {
    return {
      mainsnak: { snaktype: 'value', property: '', datavalue: { type: 'wikibase-entityid', value: { id: target } } },
      rank,
    };
  }

  /** A date statement. `time` is in Wikidata's form, such as "+1947-12-00". Precision 9 is a year. */
  static time(time: string, precision = 9, circa = false): WikidataClaim {
    const claim: WikidataClaim = {
      mainsnak: { snaktype: 'value', property: '', datavalue: { type: 'time', value: { time: `${time}T00:00:00Z`, precision } } },
      rank: 'normal',
    };
    if (circa) {
      claim.qualifiers = { P1480: [TestItems.link('Q5727902').mainsnak] };
    }
    return claim;
  }

  static item(id: string, label: string, claims: Record<string, WikidataClaim[]> = {}): WikidataEntityRecord {
    return { id, labels: { en: { value: label } }, descriptions: { en: { value: `about ${label}` } }, claims };
  }

  /** A moment invented in `year`, depending through "uses" on the given items. */
  static moment(id: string, year: number, uses: string[] = []): WikidataEntityRecord {
    return TestItems.item(id, id, {
      P575: [TestItems.time(`+${year}-00-00`)],
      ...(uses.length > 0 ? { P2283: uses.map((t) => TestItems.link(t)) } : {}),
    });
  }
}

/** A Wikidata source answered from items held in memory. */
export class FakeWikidataSource implements WikidataSource {
  readonly asked: string[] = [];
  private readonly items = new Map<string, WikidataEntityRecord>();

  constructor(records: WikidataEntityRecord[]) {
    records.forEach((r) => this.items.set(r.id, r));
  }

  async entities(ids: readonly string[]): Promise<Map<string, WikidataEntity>> {
    this.asked.push(...ids);
    return new Map(ids.filter((id) => this.items.has(id)).map((id) => [id, new WikidataEntity(this.items.get(id)!)]));
  }

  async linksTo(property: string, targets: readonly string[]): Promise<ReverseLink[]> {
    return [...this.items.values()].flatMap((record) =>
      new WikidataEntity(record)
        .items(property)
        .filter((target) => targets.includes(target))
        .map((target) => ({ subject: record.id, target })),
    );
  }
}
