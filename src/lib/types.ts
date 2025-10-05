import { z } from 'zod';

export type ID = string;

export type ToolStatus = 'available' | 'hired' | 'repair' | 'lost';
export type HireStatus = 'open' | 'overdue' | 'closed';
export type UserRole = 'admin' | 'staff' | 'viewer';

export const moneySchema = z
  .number({ required_error: 'Amount required' })
  .int('Money values must be in whole pence');

export const dateStringSchema = z
  .string({ required_error: 'Date required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Date must be YYYY-MM-DD');

export const toolSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name required'),
  sku: z.string().optional(),
  category: z.string().optional(),
  dailyRatePence: moneySchema,
  condition: z.enum(['Good', 'Fair', 'Needs service']).optional(),
  status: z.enum(['available', 'hired', 'repair', 'lost']),
  lastServicedDate: dateStringSchema.optional(),
  notes: z.string().optional(),
  createdAt: dateStringSchema
});

export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name required'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  createdAt: dateStringSchema
});

export const hireSchema = z.object({
  id: z.string(),
  toolId: z.string(),
  customerId: z.string(),
  startDate: dateStringSchema,
  dueDate: dateStringSchema,
  returnDate: dateStringSchema.optional(),
  dailyRatePenceAtHire: moneySchema,
  depositPence: moneySchema,
  status: z.enum(['open', 'overdue', 'closed']),
  totalPricePence: moneySchema.optional(),
  notes: z.string().optional(),
  createdAt: dateStringSchema
});

export const maintenanceSchema = z.object({
  id: z.string(),
  toolId: z.string(),
  issue: z.string().min(1),
  dateReported: dateStringSchema,
  dateFixed: dateStringSchema.optional(),
  notes: z.string().optional()
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'staff', 'viewer']),
  email: z.string().email()
});

export const dbSchema = z.object({
  tools: z.array(toolSchema),
  customers: z.array(customerSchema),
  hires: z.array(hireSchema),
  maintenance: z.array(maintenanceSchema),
  users: z.array(userSchema)
});

export type Tool = z.infer<typeof toolSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Hire = z.infer<typeof hireSchema>;
export type Maintenance = z.infer<typeof maintenanceSchema>;
export type User = z.infer<typeof userSchema>;
export type DB = z.infer<typeof dbSchema>;
