import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrganizationRepository } from './organization.repository';

// Mock the Prisma client
vi.mock('@/server/db', () => ({
  db: {
    organization: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('OrganizationRepository', () => {
  let repository: OrganizationRepository;

  beforeEach(() => {
    repository = new OrganizationRepository();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with organization model', () => {
      expect(repository).toBeDefined();
      // Access through any to test protected property
      expect((repository as any).modelName).toBe('organization');
    });
  });

  describe('findBySlug', () => {
    it('should find organization by slug', async () => {
      const mockOrg = {
        id: '1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db } = await import('@/server/db');
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const result = await repository.findBySlug('test-ong');

      expect(result).toEqual(mockOrg);
      expect(db.organization.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-ong' },
      });
    });

    it('should return null when slug not found', async () => {
      const { db } = await import('@/server/db');
      vi.mocked(db.organization.findUnique).mockResolvedValue(null);

      const result = await repository.findBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByUser', () => {
    it('should find organizations by user ID', async () => {
      const mockOrgs = [
        {
          id: '1',
          name: 'Test ONG',
          slug: 'test-ong',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { db } = await import('@/server/db');
      vi.mocked(db.organization.findMany).mockResolvedValue(mockOrgs);

      const result = await repository.findByUser('user-123');

      expect(result).toEqual(mockOrgs);
      expect(db.organization.findMany).toHaveBeenCalledWith({
        where: {
          users: {
            some: {
              id: 'user-123',
            },
          },
        },
      });
    });

    it('should return empty array when user has no organizations', async () => {
      const { db } = await import('@/server/db');
      vi.mocked(db.organization.findMany).mockResolvedValue([]);

      const result = await repository.findByUser('user-123');

      expect(result).toEqual([]);
    });
  });
});
