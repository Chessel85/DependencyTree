import { describe, expect, it } from 'vitest';
import { EntryIndex } from '../../../src/core/find/EntryIndex';
import { Moment } from '../../../src/core/model/Moment';
import { OngoingStop } from '../../../src/core/model/OngoingStop';
import { TestMoments } from '../../TestMoments';

function named(id: string, name: string, description = ''): Moment {
  const m = TestMoments.moment(id, 2000);
  return new Moment(id, name, m.date, description, []);
}

const iphone = named('iphone', 'iPhone', 'The first smartphone of the iPhone line.');
const battery = named('battery', 'Lithium-ion battery', 'A rechargeable battery.');
const soyuz = named('soyuz', 'Apollo–Soyuz', 'A joint spaceflight.');
const reykjavik = named('reykjavik', 'Reykjavík Summit', 'A meeting about smartphone-free diplomacy.');
const index = new EntryIndex([soyuz, iphone, battery, reykjavik, new OngoingStop()]);

describe('EntryIndex', () => {
  it('lists every entry that can be visited, in alphabetical order, when nothing is typed', () => {
    expect(index.search('').map((e) => e.id)).toEqual(['soyuz', 'iphone', 'battery', 'reykjavik']);
    expect(index.size).toBe(4);
  });

  it('ignores capitals and accents', () => {
    expect(index.search('REYKJAVIK').map((e) => e.id)).toEqual(['reykjavik']);
    expect(index.search('apollo soyuz').map((e) => e.id)).toEqual(['soyuz']);
  });

  it('needs every word to match', () => {
    expect(index.search('lithium battery').map((e) => e.id)).toEqual(['battery']);
    expect(index.search('lithium phone')).toEqual([]);
  });

  it('puts name matches before description matches', () => {
    expect(index.search('smartphone').map((e) => e.id)).toEqual(['iphone', 'reykjavik']);
    expect(index.search('phone').map((e) => e.id)).toEqual(['iphone', 'reykjavik']);
    expect(index.search('rechargeable').map((e) => e.id)).toEqual(['battery']);
  });
});
