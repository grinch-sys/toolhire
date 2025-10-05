import { z } from 'zod';
import { customerSchema, dbSchema, hireSchema, maintenanceSchema, toolSchema, userSchema } from './types';

export const importSchema = z.object({
  tools: z.array(toolSchema).optional(),
  customers: z.array(customerSchema).optional(),
  hires: z.array(hireSchema).optional(),
  maintenance: z.array(maintenanceSchema).optional(),
  users: z.array(userSchema).optional()
});

export const exportSchema = dbSchema;

export type ImportPayload = z.infer<typeof importSchema>;
