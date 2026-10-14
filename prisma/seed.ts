import { db } from '@/server/db';

interface Org {
  id: string;
  name: string;
  slug: string;
}

async function createOrganizations(): Promise<{ ong1: Org; ong2: Org }> {
  const ong1 = await db.organization.upsert({
    where: { slug: 'amigos-dos-animais' },
    update: {},
    create: { name: 'Amigos dos Animais', slug: 'amigos-dos-animais' },
  });

  const ong2 = await db.organization.upsert({
    where: { slug: 'patinhas-felizes' },
    update: {},
    create: { name: 'Patinhas Felizes', slug: 'patinhas-felizes' },
  });

  return { ong1, ong2 };
}

async function createUsers(ong1: Org, ong2: Org) {
  await db.user.upsert({
    where: { email: 'admin@amigosdosanimais.org' },
    update: {},
    create: {
      email: 'admin@amigosdosanimais.org',
      name: 'Maria Silva',
      organizationId: ong1.id,
    },
  });

  await db.user.upsert({
    where: { email: 'admin@patinhasfelizes.org' },
    update: {},
    create: {
      email: 'admin@patinhasfelizes.org',
      name: 'João Santos',
      organizationId: ong2.id,
    },
  });
}

async function createPets(ong1: Org, ong2: Org) {
  const pets = [
    { name: 'Rex', species: 'Cachorro', breed: 'Labrador', age: 3, organizationId: ong1.id },
    { name: 'Mimi', species: 'Gato', breed: 'Siamês', age: 2, organizationId: ong1.id },
    { name: 'Mel', species: 'Cachorro', breed: 'Golden', age: 2, organizationId: ong2.id },
    { name: 'Felix', species: 'Gato', breed: 'Maine Coon', age: 3, organizationId: ong2.id },
  ];

  for (const pet of pets) {
    await db.pet.create({ data: pet });
  }

  return pets.length;
}

async function main() {
  const { ong1, ong2 } = await createOrganizations();
  await createUsers(ong1, ong2);
  const petCount = await createPets(ong1, ong2);
  // eslint-disable-next-line no-console
  console.log(`✅ Seed: 2 orgs, 2 users, ${petCount} pets`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
