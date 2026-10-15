import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

vi.mock('@/server/auth', () => ({
  auth: vi.fn(),
}));

const mockAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>;

vi.mock('@/server/db', () => ({
  db: {
    organization: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('/api/organizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should create organization when authenticated', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrg = {
        id: 'org-1',
        name: 'Test ONG',
        slug: 'test-ong',
        description: null,
        phone: null,
        email: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.organization.create).mockResolvedValue(mockOrg);

      const request = new Request('http://localhost/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test ONG',
          slug: 'test-ong',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('Test ONG');
      expect(db.organization.create).toHaveBeenCalledWith({
        data: {
          name: 'Test ONG',
          slug: 'test-ong',
          description: undefined,
          phone: undefined,
          email: undefined,
          users: { connect: { id: 'user-1' } },
        },
      });
    });

    it('should return 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const request = new Request('http://localhost/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test ONG',
          slug: 'test-ong',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const request = new Request('http://localhost/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'A', // Too short
          slug: 'test-ong',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should return 400 for unknown fields', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const request = new Request('http://localhost/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test ONG',
          slug: 'test-ong',
          unknownField: 'should fail',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET', () => {
    it('should return organizations for authenticated user', async () => {
      const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
        expires: '2025-12-31',
      };
      mockAuth.mockResolvedValue(mockSession);

      const mockOrgs = [
        { id: 'org-1', name: 'ONG 1', slug: 'ong-1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'org-2', name: 'ONG 2', slug: 'ong-2', createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(db.organization.findMany).mockResolvedValue(mockOrgs);

      const request = new Request('http://localhost/api/organizations');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
    });

    it('should return 401 when not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const request = new Request('http://localhost/api/organizations');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });
  });
});
