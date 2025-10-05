import { describe, expect, it } from 'vitest';
import { importSchema } from '../lib/validators';

const validPayload = {
  tools: [
    {
      id: '1',
      name: 'Test Tool',
      dailyRatePence: 1000,
      status: 'available',
      createdAt: '2024-01-01'
    }
  ],
  customers: [
    {
      id: 'c1',
      name: 'Alice',
      createdAt: '2024-01-01'
    }
  ],
  hires: [
    {
      id: 'h1',
      toolId: '1',
      customerId: 'c1',
      startDate: '2024-01-01',
      dueDate: '2024-01-02',
      dailyRatePenceAtHire: 1000,
      depositPence: 500,
      status: 'open',
      createdAt: '2024-01-01'
    }
  ],
  maintenance: [],
  users: []
};

describe('import schema', () => {
  it('accepts valid payloads', () => {
    expect(importSchema.parse(validPayload)).toBeTruthy();
  });

  it('rejects invalid payloads', () => {
    expect(() =>
      importSchema.parse({
        tools: [
          {
            id: '1',
            name: '',
            dailyRatePence: 1000,
            status: 'available',
            createdAt: '2024-01-01'
          }
        ]
      })
    ).toThrow();
  });
});
