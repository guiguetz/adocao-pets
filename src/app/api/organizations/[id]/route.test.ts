import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from './route';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

vi.mock('@/server/auth', () => ({
  auth: vi.fn(),
}));

const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>;

vi.mock('@/server/db', () => ({
  db: {
    organization: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('/api/organizations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return organization when user is member', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [{ id: 'user-1' }],
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await GET({} as Request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Test ONG');
    });

    it('should return 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await GET({} as Request, { params });
      expect(response.status).toBe(401);
    });

    it('should return 403 when user is not member', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [], // No users matching current user (filtered by where clause)
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await GET({} as Request, { params });
      expect(response.status).toBe(403);
    });

    it('should return 404 when organization not found', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);
      vi.mocked(db.organization.findUnique).mockResolvedValue(null);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await GET({} as Request, { params });
      expect(response.status).toBe(404);
    });
  });

  describe('PUT', () => {
    it('should update organization when user is owner', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [{ id: 'user-1' }],
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const updatedOrg = { ...mockOrg, name: 'Updated ONG' };
      vi.mocked(db.organization.update).mockResolvedValue(updatedOrg);

      const request = new Request('http://localhost/api/organizations/org-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated ONG' }),
      });

      const params = Promise.resolve({ id: 'org-1' });
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Updated ONG');
    });

    it('should return 403 when user is not owner', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [], // No users matching current user
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const request = new Request('http://localhost/api/organizations/org-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated ONG' }),
      });

      const params = Promise.resolve({ id: 'org-1' });
      const response = await PUT(request, { params });
      expect(response.status).toBe(403);
    });

    it('should return 400 for invalid update data', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [{ id: 'user-1' }],
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const request = new Request('http://localhost/api/organizations/org-1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unknownField: 'should fail' }),
      });

      const params = Promise.resolve({ id: 'org-1' });
      const response = await PUT(request, { params });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE', () => {
    it('should delete organization when user is owner', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [{ id: 'user-1' }],
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);
      vi.mocked(db.organization.delete).mockResolvedValue(mockOrg);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await DELETE({} as Request, { params });

      expect(response.status).toBe(204);
      expect(db.organization.delete).toHaveBeenCalledWith({ where: { id: 'org-1' } });
    });

    it('should return 403 when user is not owner', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [], // No users matching current user
      };
      vi.mocked(db.organization.findUnique).mockResolvedValue(mockOrg);

      const params = Promise.resolve({ id: 'org-1' });
      const response = await DELETE({} as Request, { params });
      expect(response.status).toBe(403);
    });
  });
});
