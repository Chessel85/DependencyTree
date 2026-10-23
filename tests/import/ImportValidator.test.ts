import { describe, expect, it } from 'vitest';
import { DatasetRecord, MomentRecord } from '../../src/core/data/DatasetReader';
import { ImportLog } from '../../src/import/ImportLog';
import { ImportValidator } from '../../src/import/ImportValidator';

function moment(id: string, year: number, dependsOn: string[] = []): MomentRecord {
  return {
    id,
    name: id,
    date: { year, precision: 'year' },
    description: '',
    tags: [],
    dependsOn,
    linkSources: Object.fromEntries(dependsOn.map((d) => [d, 'P2283'])),
  };
}

function validate(record: DatasetRecord): ImportLog {
  const log = new ImportLog();
  new ImportValidator(log).validate(record);
  return log;
}

describe('ImportValidator', () => {
  it('leaves out a dependency that came later, and notes it', () => {
    const record: DatasetRecord = { moments: [moment('iphone', 2007, ['ios-2']), moment('ios-2', 2008)] };
    const log = validate(record);
    expect(record.moments[0].dependsOn).toEqual([]);
    expect(record.moments[0].linkSources).toEqual({});
    expect(log.predates).toEqual([
      { dependent: 'iphone', dependency: 'ios-2', source: 'P2283', dependentDate: '2007', dependencyDate: '2008' },
    ]);
  });

  it('breaks a circle of dependencies by leaving out the link that closes it', () => {
    const record: DatasetRecord = { moments: [moment('a', 1990, ['b']), moment('b', 1990, ['a'])] };
    const log = validate(record);
    expect(log.cycles).toHaveLength(1);
    const links = record.moments.flatMap((m) => m.dependsOn!.map((d) => `${m.id}>${d}`));
    expect(links).toHaveLength(1);
  });

  it('leaves out of a period an entry that falls outside it', () => {
    const record: DatasetRecord = {
      moments: [moment('start', 1947), moment('end', 1991), moment('inside', 1969), moment('after', 1992)],
      periods: [{ id: 'cold-war', name: 'Cold War', description: '', tags: [], start: 'start', end: 'end', contains: ['inside', 'after'] }],
    };
    const log = validate(record);
    expect(record.periods![0].contains).toEqual(['inside']);
    expect(log.outsidePeriod).toEqual([{ period: 'Cold War', member: 'after' }]);
  });
});
