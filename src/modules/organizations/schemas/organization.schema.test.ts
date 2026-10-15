import { describe, it, expect } from 'vitest';
import { createOrganizationSchema, updateOrganizationSchema } from './organization.schema';

describe('Organization Schemas', () => {
  describe('createOrganizationSchema', () => {
    it('should validate valid organization data', () => {
      const validData = {
        name: 'ONG Amigos dos Animais',
        slug: 'amigos-animais',
        description: 'Resgate de animais',
        phone: '11999999999',
        email: 'contato@ong.com',
      };

      const result = createOrganizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require name field', () => {
      const invalidData = {
        slug: 'test-slug',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject name shorter than 2 characters', () => {
      const invalidData = {
        name: 'A',
        slug: 'test-slug',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require slug field', () => {
      const invalidData = {
        name: 'Test ONG',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('slug');
      }
    });

    it('should reject slug with special characters', () => {
      const invalidData = {
        name: 'Test ONG',
        slug: 'invalid slug!@#',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept slug with hyphens', () => {
      const validData = {
        name: 'Test ONG',
        slug: 'my-ong-slug',
      };

      const result = createOrganizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject unknown fields with strict mode', () => {
      const invalidData = {
        name: 'Test ONG',
        slug: 'test-slug',
        unknownField: 'should fail',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should make description optional', () => {
      const validData = {
        name: 'Test ONG',
        slug: 'test-slug',
      };

      const result = createOrganizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate email format when provided', () => {
      const invalidData = {
        name: 'Test ONG',
        slug: 'test-slug',
        email: 'not-an-email',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateOrganizationSchema', () => {
    it('should accept partial updates', () => {
      const partialData = {
        name: 'Updated Name',
      };

      const result = updateOrganizationSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('should reject unknown fields', () => {
      const invalidData = {
        name: 'Updated Name',
        hackerField: 'should fail',
      };

      const result = updateOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
