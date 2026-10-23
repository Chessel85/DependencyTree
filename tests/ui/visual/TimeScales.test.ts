import { describe, expect, it } from 'vitest';
import { CompressedTimeScale } from '../../../src/ui/visual/CompressedTimeScale';
import { LinearTimeScale } from '../../../src/ui/visual/LinearTimeScale';
import { SlotTimeScale } from '../../../src/ui/visual/SlotTimeScale';
import { TickPicker } from '../../../src/ui/visual/TickPicker';
import { TestMoments } from '../../TestMoments';

const battery = TestMoments.moment('battery', 1800);
const phone = TestMoments.moment('phone', 1876);
const chip = TestMoments.moment('chip', 1971);

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

describe('CompressedTimeScale', () => {
  it('gives recent years more room than distant ones', () => {
    const scale = new CompressedTimeScale(1800, 2026, 1000, 0);
    const old = scale.x(phone) - scale.x(battery);
    const recent = scale.x(TestMoments.moment('later', 2007)) - scale.x(chip);
    expect(old / 76).toBeLessThan(recent / 36);
    expect(scale.todayX).toBe(1000);
  });

  it('puts the future to the right of today', () => {
    const scale = new CompressedTimeScale(1800, 2026, 1000, 0);
    expect(scale.x(TestMoments.moment('games', 2028))).toBeGreaterThan(scale.todayX);
  });
});

describe('SlotTimeScale', () => {
  it('gives each moment its own column, as wide as its box', () => {
    const scale = new SlotTimeScale([battery, phone, chip], () => 100, 10, 5);
    expect([battery, phone, chip].map((m) => scale.x(m))).toEqual([5, 115, 225]);
    expect(scale.todayX).toBe(335);
    expect(scale.span()).toBeUndefined();
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
