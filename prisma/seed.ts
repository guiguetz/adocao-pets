import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create organizations
  const ong1 = await prisma.organization.upsert({
    where: { slug: "amigos-dos-animais" },
    update: {},
    create: {
      name: "Amigos dos Animais",
      slug: "amigos-dos-animais",
    },
  });

  const ong2 = await prisma.organization.upsert({
    where: { slug: "patinhas-felizes" },
    update: {},
    create: {
      name: "Patinhas Felizes",
      slug: "patinhas-felizes",
    },
  });

  console.log(`✅ Organizations created: ${ong1.name}, ${ong2.name}`);

  // Create users (admins for each ONG)
  const user1 = await prisma.user.upsert({
    where: { email: "admin@amigosdosanimais.org" },
    update: {},
    create: {
      email: "admin@amigosdosanimais.org",
      name: "Maria Silva",
      organizationId: ong1.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@patinhasfelizes.org" },
    update: {},
    create: {
      email: "admin@patinhasfelizes.org",
      name: "João Santos",
      organizationId: ong2.id,
    },
  });

  console.log(`✅ Users created: ${user1.name}, ${user2.name}`);

  // Create pets for ONG 1
  const petsOng1 = [
    {
      name: "Rex",
      species: "Cachorro",
      breed: "Labrador",
      age: 3,
      description: "Dócil e brincalhão. Adora crianças.",
      organizationId: ong1.id,
    },
    {
      name: "Mimi",
      species: "Gato",
      breed: "Siamês",
      age: 2,
      description: "Calma e carinhosa. Ideal para apartamento.",
      organizationId: ong1.id,
    },
    {
      name: "Thor",
      species: "Cachorro",
      breed: "Pastor Alemão",
      age: 4,
      description: "Fiel e protetor. Precisa de espaço.",
      organizationId: ong1.id,
    },
    {
      name: "Luna",
      species: "Gato",
      breed: "Persa",
      age: 1,
      description: "Tranquila e independente.",
      organizationId: ong1.id,
    },
    {
      name: "Bob",
      species: "Cachorro",
      breed: "Vira-lata",
      age: 5,
      description: "Muito amoroso. Resgatado da rua.",
      organizationId: ong1.id,
    },
  ];

  // Create pets for ONG 2
  const petsOng2 = [
    {
      name: "Mel",
      species: "Cachorro",
      breed: "Golden Retriever",
      age: 2,
      description: "Alegre e obediente. Ótima companhia.",
      organizationId: ong2.id,
    },
    {
      name: "Felix",
      species: "Gato",
      breed: "Maine Coon",
      age: 3,
      description: "Curioso e brincalhão.",
      organizationId: ong2.id,
    },
    {
      name: "Nina",
      species: "Cachorro",
      breed: "Poodle",
      age: 1,
      description: "Pequena e cheia de energia.",
      organizationId: ong2.id,
    },
    {
      name: "Simba",
      species: "Gato",
      breed: "Laranja",
      age: 4,
      description: "Gentil e preguiçoso. Adora dormir.",
      organizationId: ong2.id,
    },
    {
      name: "Max",
      species: "Cachorro",
      breed: "Bulldog",
      age: 3,
      description: "Calmo e leal. Bom com outros animais.",
      organizationId: ong2.id,
    },
  ];

  for (const pet of [...petsOng1, ...petsOng2]) {
    await prisma.pet.create({ data: pet });
  }

  console.log(`✅ ${petsOng1.length + petsOng2.length} pets created`);

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });