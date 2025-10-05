import { describe, expect, it } from 'vitest';
import { calculateHireTotal } from '../state/db';

describe('hire calculations', () => {
  it('computes total price based on hire length', () => {
    const total = calculateHireTotal(
      {
        startDate: '2024-03-01',
        dailyRatePenceAtHire: 2500
      },
      '2024-03-03'
    );
    expect(total).toBe(7500);
  });
});
