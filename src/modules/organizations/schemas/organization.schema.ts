import { z } from 'zod';

export const createOrganizationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .strict();

export const updateOrganizationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
      .optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .strict();
