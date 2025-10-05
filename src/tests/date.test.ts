import { describe, expect, it } from 'vitest';
import { addDaysISO, daysBetweenInclusive, formatDateLocal } from '../lib/date';

describe('date helpers', () => {
  it('adds days correctly', () => {
    expect(addDaysISO('2024-01-01', 5)).toBe('2024-01-06');
  });

  it('computes inclusive ranges', () => {
    expect(daysBetweenInclusive('2024-01-01', '2024-01-03')).toBe(3);
  });

  it('formats date for locale', () => {
    expect(formatDateLocal('2024-01-03')).toBe('3 Jan 2024');
  });
});
