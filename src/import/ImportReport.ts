import { DatasetReader, DatasetRecord } from '../core/data/DatasetReader';
import { DateFormatter } from '../core/dates/DateFormatter';
import { Entry } from '../core/model/Entry';
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
        "These were reached only from entries that certainly came before them, so they can't be dependencies, and the walk doesn't go through them.",
        ['Wikidata ID', 'Name'],
        [...this.graph.tooLate.values()].map((e) => [e.id, e.label ?? '(no English label)']),
      ),
      ...this.section(
        'Entries with no English name',
        'These have no English label in Wikidata, so their Wikidata ID is used as the name. The curation file can name them.',
        ['Wikidata ID', 'Description'],
        [...this.graph.entries.values()].filter((e) => !e.label).map((e) => [e.id, e.description ?? '']),
      ),
      ...this.section(
        'Links moved to a period\'s start moment',
        'Wikidata linked these to a whole period, so the period\'s start moment is used instead (DES-REL-007). The curation file can move them to a better moment.',
        ['Dependent', 'Dependency', 'Period moved to its start', 'Property'],
        this.log.moved.map((n) => [n.dependent, n.dependency, n.periods.join(' and '), this.property(n.source)]),
      ),
      ...this.section(
        'Links that broke the predates rule',
        'Each dependency certainly came after the entry that depends on it, so the link is left out (DES-REL-002).',
        ['Dependent', 'Its date', 'Dependency', 'Its date', 'Property'],
        this.log.predates.map((n) => [n.dependent, n.dependentDate, n.dependency, n.dependencyDate, this.property(n.source)]),
      ),
      ...this.section(
        'Circular dependencies',
        'Each circle is broken by leaving out the link that closes it (DES-REL-005).',
        ['Moments around the circle', 'Link left out', 'Property'],
        this.log.cycles.map((n) => [n.moments.join(', then '), `${n.removed.dependent} depends on ${n.removed.dependency}`, this.property(n.removed.source)]),
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
    const dependencies = this.record.moments.reduce((n, m) => n + (m.dependsOn?.length ?? 0), 0);
    const outside = this.graph.links.filter(
      (l) => !this.graph.has(l.dependent) || !this.graph.has(l.dependency),
    ).length;
    return this.table(
      'Summary',
      '',
      ['What', 'Count'],
      [
        ['Wikidata items in the seed set', String(this.graph.size)],
        ['Moments, including start and end moments made for periods', String(this.record.moments.length)],
        ['Periods', String(periods.length)],
        ['Dependencies in the seed file', String(dependencies)],
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
    for (const moment of this.record.moments) {
      for (const source of Object.values(moment.linkSources ?? {})) {
        kept.set(source, (kept.get(source) ?? 0) + 1);
      }
    }
    const properties = [...PropertyMapper.DEPENDS_ON, PropertyMapper.HAS_PARTS, ...PropertyMapper.ENABLED, 'curation'];
    return this.table(
      'Dependencies by property',
      '"Read" counts every link found, including links to items outside the seed set. "Kept" counts the links in the seed file.',
      ['Property', 'Name', 'Read', 'Kept'],
      properties.map((p) => [p, PropertyMapper.nameOf(p), String(read.get(p) ?? 0), String(kept.get(p) ?? 0)]),
    );
  }

  private undated(): string[] {
    const pointedAt = (id: string) => this.graph.links.filter((l) => this.graph.canonical(l.dependency) === id && this.graph.has(l.dependent)).length;
    return this.section(
      'Items left out for having no date',
      'These were reached, but have none of the date properties, so they are left out and not walked through. The curation file can give them a date.',
      ['Wikidata ID', 'Name', 'Seed entries that depend on it'],
      [...this.graph.undated.values()].map((e) => [e.id, e.label ?? '(no English label)', String(pointedAt(e.id))]),
    );
  }

  private entries(): string[] {
    const dataset = new DatasetReader().read(this.record);
    const all: Entry[] = [...dataset.graph.allMoments, ...dataset.periods].sort(Entry.byDate);
    return this.table(
      'Entries in the seed file',
      'Oldest first.',
      ['Name', 'Date', 'Dependencies', 'Enabled', 'Wikidata ID'],
      all.map((entry) => {
        if (entry instanceof Moment) {
          const record = this.record.moments.find((m) => m.id === entry.id)!;
          return [
            entry.name,
            this.formatter.written(entry.date),
            String(dataset.graph.dependenciesOf(entry).length),
            String(dataset.graph.enabledBy(entry).length),
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
