import { BaseRepository } from '@/modules/shared/repositories/base.repository';
import { Organization } from '@/modules/shared/types/organization';

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    super('organization');
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.model.findUnique({
      where: { slug },
    });
  }

  async findByUser(userId: string): Promise<Organization[]> {
    return this.model.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
