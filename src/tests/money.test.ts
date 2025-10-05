import { describe, expect, it } from 'vitest';
import { averageMoney, formatMoneyFromPence, parseMoneyToPence, sumMoney } from '../lib/money';

describe('money helpers', () => {
  it('formats GBP values', () => {
    expect(formatMoneyFromPence(1234)).toBe('£12.34');
  });

  it('parses GBP strings', () => {
    expect(parseMoneyToPence('12.34')).toBe(1234);
  });

  it('sums values', () => {
    expect(sumMoney([100, 200, 300])).toBe(600);
  });

  it('averages values', () => {
    expect(averageMoney([100, 200, 300])).toBe(200);
  });
});
