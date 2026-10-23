import { describe, expect, it } from 'vitest';
import { ListKind } from '../../../src/core/navigation/ListKind';
import { RelationshipList } from '../../../src/core/navigation/RelationshipList';
import { TestMoments } from '../../TestMoments';

const entries = Array.from({ length: 25 }, (_, i) => TestMoments.moment(`m${i}`, 1900 + i));

describe('RelationshipList paging', () => {
  it('moves ten entries at a time, stopping at the last', () => {
    const list = new RelationshipList(ListKind.Dependencies, entries);
    expect(list.movePage(1)).toBe(true);
    expect(list.position).toBe(11);
    list.movePage(1);
    list.movePage(1);
    expect(list.position).toBe(25);
    expect(list.movePage(1)).toBe(false);
  });

  it('moves back, stopping at the first', () => {
    const list = new RelationshipList(ListKind.Dependencies, entries);
    list.moveToLast();
    list.movePage(-1);
    expect(list.position).toBe(15);
    list.movePage(-1);
    list.movePage(-1);
    expect(list.position).toBe(1);
  });
});
