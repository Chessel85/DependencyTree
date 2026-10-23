import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { Entry } from '../core/model/Entry';
import { LinkKind } from '../core/model/LinkKind';
import { Moment } from '../core/model/Moment';
import { Period } from '../core/model/Period';
import { ImportedGraph } from './ImportedGraph';
import { ImportLog } from './ImportLog';
import { PropertyMapper } from './PropertyMapper';

/**
 * Writes the import report as Markdown (DES-IMP-003, DES-IMP-007). Every
 * list is a table, which is easier to move through with a screen reader.
 */
export class ImportReport {
  private readonly formatter = new DateFormatter();

  constructor(
    private readonly graph: ImportedGraph,
    private readonly record: DatasetRecord,
    private readonly log: ImportLog,
    private readonly when: Date,
  ) {}

  render(): string {
    return [
      '# Wikidata import report',
      '',
      `Made on ${this.when.toISOString().slice(0, 10)}. The seed file is data/seed.json, and the corrections are in data/curation.json.`,
      '',
      ...this.summary(),
      ...this.byProperty(),
      ...this.undated(),
      ...this.section(
        'Items left out for coming later',
        "These were reached only from entries that certainly came before them, so they can't be what those entries depended on, were caused by or were influenced by, and the walk doesn't go through them.",
        ['Wikidata ID', 'Name'],
        [...this.graph.tooLate.values()].map((e) => [e.id, e.label ?? '(no English label)']),
      ),
      ...this.section(
        'Items left out for having no English name',
        'These have no English label and no English Wikipedia article, so they are left out. The curation file can name them.',
        ['Wikidata ID', 'Description'],
        [...this.graph.unnamed.values()].map((e) => [e.id, e.description ?? '']),
      ),
      ...this.periods(),
      ...this.section(
        'Items imported as moments instead of periods',
        'Wikidata gives these as periods, but none of their events or parts falls on their start or end date, so they are moments at their start date. The curation file can name their start and end moments.',
        ['Item', 'No real moment found for'],
        this.log.notPeriods.map((n) => [n.name, n.missing]),
      ),
      ...this.section(
        'Links moved to one of a period\'s moments',
        'These link to a whole period, so one of its moments is used instead (DES-REL-007): the end moment when the period is a cause, and otherwise the start moment. The curation file can choose the other end.',
        ['Later', 'Link', 'Earlier', 'Period moved to', 'Property'],
        this.log.moved.map((n) => [n.later, n.kind, n.earlier, n.ends.map((e) => `${e.period}, its ${e.end}`).join(' and '), this.property(n.source)]),
      ),
      ...this.section(
        'Links that broke the predates rule',
        'Each earlier end certainly came after the later one, so the link is left out (DES-REL-002).',
        ['Later', 'Its date', 'Link', 'Earlier', 'Its date', 'Property'],
        this.log.predates.map((n) => [n.later, n.laterDate, n.kind, n.earlier, n.earlierDate, this.property(n.source)]),
      ),
      ...this.section(
        'Circular links',
        'Each circle is broken by leaving out the link that closes it (DES-REL-005).',
        ['Moments around the circle', 'Link left out', 'Property'],
        this.log.cycles.map((n) => [n.moments.join(', then '), `${n.removed.later} ${n.removed.kind} ${n.removed.earlier}`, this.property(n.removed.source)]),
      ),
      ...this.section(
        'Entries outside their period',
        'Each entry certainly falls outside the period\'s dates, so it is left out of the period (DES-DATA-006).',
        ['Period', 'Entry'],
        this.log.outsidePeriod.map((n) => [n.period, n.member]),
      ),
      ...this.section(
        'Notes on the curation file',
        'Corrections that had no effect, which may be out of date.',
        ['Number', 'Note'],
        this.log.curation.map((note, i) => [String(i + 1), note]),
      ),
      ...this.entries(),
    ].join('\n');
  }

  private summary(): string[] {
    const periods = this.record.periods ?? [];
    const links = this.record.moments.flatMap((m) => m.links ?? []);
    const count = (kind: LinkKind) => String(links.filter((l) => l.kind === kind).length);
    const outside = this.graph.links.filter((l) => !this.graph.has(l.later) || !this.graph.has(l.earlier)).length;
    return this.table(
      'Summary',
      '',
      ['What', 'Count'],
      [
        ['Wikidata items in the seed set', String(this.graph.size)],
        ['Moments', String(this.record.moments.length)],
        ['Periods', String(periods.length)],
        ['Depends-on links in the seed file', count(LinkKind.DependsOn)],
        ['Caused-by links in the seed file', count(LinkKind.CausedBy)],
        ['Influenced-by links in the seed file', count(LinkKind.InfluencedBy)],
        ['Ideas', String(this.record.moments.filter((m) => m.idea).length)],
        ['Items left out for having no English name', String(this.graph.unnamed.size)],
        ['Items left out for having no date', String(this.graph.undated.size)],
        ['Items left out for coming later than what links to them', String(this.graph.tooLate.size)],
        ['Links read to items outside the seed set', String(outside)],
        ['Stopped at the most entries allowed', this.graph.stoppedAtLimit ? 'Yes' : 'No'],
      ],
    );
  }

  /** How many links each property gave: read from Wikidata, and kept in the seed file after the checks. */
  private byProperty(): string[] {
    const read = new Map<string, number>();
    for (const link of this.graph.links) {
      read.set(link.source, (read.get(link.source) ?? 0) + 1);
    }
    const kept = new Map<string, number>();
    for (const link of this.record.moments.flatMap((m) => m.links ?? [])) {
      kept.set(link.source ?? '', (kept.get(link.source ?? '') ?? 0) + 1);
    }
    const meanings: [string, string][] = [
      ...Object.entries(PropertyMapper.EARLIER).map(([p, m]): [string, string] => [p, this.meaning(m.kind, m.strength)]),
      [PropertyMapper.HAS_PARTS, LinkKind.DependsOn],
      ...Object.entries(PropertyMapper.LATER).map(([p, m]): [string, string] => [p, `${this.meaning(m.kind, m.strength)}, read backwards`]),
      ['curation', 'as the curation file says'],
    ];
    return this.table(
      'Links by property',
      '"Read" counts every link found, including links to items outside the seed set. "Kept" counts the links in the seed file.',
      ['Property', 'Name', 'Gives', 'Read', 'Kept'],
      meanings.map(([p, gives]) => [p, PropertyMapper.nameOf(p), gives, String(read.get(p) ?? 0), String(kept.get(p) ?? 0)]),
    );
  }

  private meaning(kind: LinkKind, strength?: string): string {
    return strength ? `${kind}, ${strength}` : kind;
  }

  /** Each period with the real moments it starts and ends with (DES-IMP-008). */
  private periods(): string[] {
    const name = (id: string) => this.record.moments.find((m) => m.id === id)?.name ?? id;
    return this.section(
      'Periods and their start and end moments',
      '',
      ['Period', 'Starts with', 'Ends with'],
      (this.record.periods ?? []).map((p) => [p.name, name(p.start), p.end ? name(p.end) : 'still going on']),
    );
  }

  private undated(): string[] {
    const pointedAt = (id: string) => this.graph.links.filter((l) => this.graph.canonical(l.earlier) === id && this.graph.has(l.later)).length;
    return this.section(
      'Items left out for having no date',
      'These were reached, but have none of the date properties, so they are left out and not walked through. The curation file can give them a date.',
      ['Wikidata ID', 'Name', 'Seed entries that link to it'],
      [...this.graph.undated.values()].map((e) => [e.id, e.label ?? '(no English label)', String(pointedAt(e.id))]),
    );
  }

  private entries(): string[] {
    const dataset = new DatasetReader().read(this.record);
    const all: Entry[] = [...dataset.graph.allMoments, ...dataset.periods].sort(Entry.byDate);
    return this.table(
      'Entries in the seed file',
      'Oldest first.',
      ['Name', 'Date', 'Earlier links', 'Later links', 'Wikidata ID'],
      all.map((entry) => {
        if (entry instanceof Moment) {
          const record = this.record.moments.find((m) => m.id === entry.id)!;
          return [
            entry.isIdea ? `${entry.name} (idea)` : entry.name,
            this.formatter.written(entry.date),
            String(dataset.graph.earlierLinks(entry).length),
            String(dataset.graph.laterLinks(entry).length),
            record.wikidata ?? 'made by the import',
          ];
        }
        const period = entry as Period;
        const record = this.record.periods!.find((p) => p.id === entry.id)!;
        const end = period.end ? this.formatter.written(period.end.date) : 'present';
        return [`${entry.name} (period)`, `${this.formatter.written(period.start.date)} to ${end}`, '', '', record.wikidata ?? ''];
      }),
    );
  }

  /** A table, or a line saying there is nothing to list. */
  private section(heading: string, intro: string, columns: string[], rows: string[][]): string[] {
    if (rows.length === 0) {
      return [`## ${heading}`, '', 'None.', ''];
    }
    return this.table(heading, intro, columns, rows);
  }

  private table(heading: string, intro: string, columns: string[], rows: string[][]): string[] {
    const cell = (text: string) => text.replace(/\|/g, '\\|');
    return [
      `## ${heading}`,
      '',
      ...(intro ? [intro, ''] : []),
      `| ${columns.join(' | ')} |`,
      `|${columns.map(() => '---').join('|')}|`,
      ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
      '',
    ];
  }

  private property(source: string): string {
    return source === 'curation' ? 'curation file' : `${PropertyMapper.nameOf(source)} (${source})`;
  }
}
