import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session;
}

export async function requireOrgOwnership(orgId: string, userId: string): Promise<void> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    include: { users: { where: { id: userId } } },
  });

  if (!org || org.users.length === 0) {
    throw NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
