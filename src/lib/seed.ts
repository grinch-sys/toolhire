import type { DB } from './types';
import { todayISO, addDaysISO } from './date';

const today = todayISO();

export const seedData: DB = {
  tools: [
    {
      id: 'tool-1',
      name: 'Cordless Drill',
      sku: 'CDR-001',
      category: 'Power Tools',
      dailyRatePence: 1500,
      condition: 'Good',
      status: 'available',
      lastServicedDate: addDaysISO(today, -30),
      notes: 'Includes two batteries.',
      createdAt: addDaysISO(today, -120)
    },
    {
      id: 'tool-2',
      name: 'Cement Mixer',
      sku: 'CMX-043',
      category: 'Construction',
      dailyRatePence: 3200,
      condition: 'Fair',
      status: 'hired',
      lastServicedDate: addDaysISO(today, -10),
      createdAt: addDaysISO(today, -200)
    }
  ],
  customers: [
    {
      id: 'cust-1',
      name: 'Alex Johnson',
      phone: '07123 456789',
      email: 'alex@example.com',
      company: 'Johnson Builders',
      createdAt: addDaysISO(today, -180)
    },
    {
      id: 'cust-2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      createdAt: addDaysISO(today, -90)
    }
  ],
  hires: [
    {
      id: 'hire-1',
      toolId: 'tool-2',
      customerId: 'cust-1',
      startDate: addDaysISO(today, -2),
      dueDate: addDaysISO(today, 2),
      dailyRatePenceAtHire: 3200,
      depositPence: 1000,
      status: 'open',
      createdAt: addDaysISO(today, -2)
    }
  ],
  maintenance: [
    {
      id: 'maint-1',
      toolId: 'tool-1',
      issue: 'Battery replacement',
      dateReported: addDaysISO(today, -40),
      dateFixed: addDaysISO(today, -35)
    }
  ],
  users: []
};
