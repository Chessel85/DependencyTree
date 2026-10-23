import { describe, expect, it } from 'vitest';
import { LinearTimeScale } from '../../../src/ui/visual/LinearTimeScale';
import { TickPicker } from '../../../src/ui/visual/TickPicker';
import { TestMoments } from '../../TestMoments';

const battery = TestMoments.moment('battery', 1800);
const phone = TestMoments.moment('phone', 1876);

describe('LinearTimeScale', () => {
  it('spaces moments in proportion to the years between them', () => {
    const scale = new LinearTimeScale(1800, 2026, 10, 20);
    expect(scale.x(battery)).toBe(20);
    expect(scale.x(phone)).toBe(780);
    expect(scale.todayX).toBe(2280);
  });

  it('labels the axis every 25 years', () => {
    const labels = new LinearTimeScale(1800, 1900, 10, 0).ticks().map((t) => t.label);
    expect(labels).toEqual(['1800', '1825', '1850', '1875', '1900']);
  });
});

describe('TickPicker', () => {
  it('leaves out labels that would crowd the one before', () => {
    const kept = new TickPicker(50).pick([
      { x: 0, label: 'a' },
      { x: 30, label: 'b' },
      { x: 60, label: 'c' },
    ]);
    expect(kept.map((t) => t.label)).toEqual(['a', 'c']);
  });

  it('writes years before the Common Era as BCE', () => {
    expect(TickPicker.yearLabel(-508)).toBe('509 BCE');
  });
});
