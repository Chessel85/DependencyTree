import { describe, expect, it } from 'vitest';
import { WikidataEntity } from '../../src/import/WikidataEntity';
import { TestItems } from './TestItems';

describe('WikidataEntity', () => {
  it('uses the label for all languages when there is no English one', () => {
    const entity = new WikidataEntity({ id: 'Q48493', labels: { mul: { value: 'iOS' } } });
    expect(entity.label).toBe('iOS');
  });

  it('uses only the preferred statements when there are any', () => {
    const entity = new WikidataEntity(
      TestItems.item('Q1', 'a', { P2283: [TestItems.link('Q2'), TestItems.link('Q3', 'preferred')] }),
    );
    expect(entity.items('P2283')).toEqual(['Q3']);
  });

  it('never uses deprecated statements', () => {
    const entity = new WikidataEntity(
      TestItems.item('Q1', 'a', { P2283: [TestItems.link('Q2', 'deprecated'), TestItems.link('Q3')] }),
    );
    expect(entity.items('P2283')).toEqual(['Q3']);
  });
});
