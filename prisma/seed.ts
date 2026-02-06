import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("admin123", 12);
  const organizerPassword = await hash("organizer123", 12);
  const userPassword = await hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@underground.local" },
    update: {},
    create: {
      email: "admin@underground.local",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@underground.local" },
    update: {},
    create: {
      email: "organizer@underground.local",
      password: organizerPassword,
      name: "Organizador Demo",
      role: "ORGANIZER",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@underground.local" },
    update: {},
    create: {
      email: "user@underground.local",
      password: userPassword,
      name: "Usuario Demo",
      role: "USER",
    },
  });

  const inOneWeek = new Date();
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

  await prisma.event.upsert({
    where: { id: "seed-event-1" },
    update: {},
    create: {
      id: "seed-event-1",
      title: "Noche de Jazz Underground",
      description: "Sesión en vivo con bandas locales. Ambiente íntimo, entrada gratuita.",
      category: "música",
      dateTime: inOneWeek,
      location: "Bar La Cueva, Centro",
      image: null,
      price: "FREE",
      status: "ACTIVE",
      organizerId: organizer.id,
    },
  });

  await prisma.event.upsert({
    where: { id: "seed-event-2" },
    update: {},
    create: {
      id: "seed-event-2",
      title: "Expo de Arte Independiente",
      description: "Exposición de artistas emergentes. Pintura, escultura y fotografía.",
      category: "arte",
      dateTime: inTwoWeeks,
      location: "Galería El Sótano",
      image: null,
      price: "€12.00",
      status: "ACTIVE",
      organizerId: organizer.id,
    },
  });

  console.log("Seed completado:");
  console.log("- Admin: admin@underground.local / admin123");
  console.log("- Organizador: organizer@underground.local / organizer123");
  console.log("- Usuario: user@underground.local / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
