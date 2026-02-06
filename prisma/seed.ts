import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
];

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

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

  const now = new Date();
  const events = [
    {
      id: "seed-event-1",
      title: "Noche de Jazz Underground",
      description: "Sesión en vivo con bandas locales. Ambiente íntimo, barra y buena música.",
      category: "música",
      dateTime: addDays(now, 5),
      location: "Bar La Cueva, Centro",
      image: PLACEHOLDER_IMAGES[0],
      price: "Gratis",
      priceCents: 0,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-2",
      title: "Expo de Arte Independiente",
      description: "Exposición de artistas emergentes. Pintura, escultura y fotografía. Inauguración con vino.",
      category: "arte",
      dateTime: addDays(now, 12),
      location: "Galería El Sótano",
      image: PLACEHOLDER_IMAGES[1],
      price: "$15.000",
      priceCents: 15000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-3",
      title: "Festival de Cine Alternativo",
      description: "Proyecciones al aire libre. Cortos y documentales independientes. Bring your blanket.",
      category: "cine",
      dateTime: addDays(now, 7),
      location: "Parque de los Artistas",
      image: PLACEHOLDER_IMAGES[2],
      price: "$8.000",
      priceCents: 8000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-4",
      title: "Obra: El último tren",
      description: "Teatro de cámara. Una historia sobre despedidas y nuevos comienzos. Duración 70 min.",
      category: "teatro",
      dateTime: addDays(now, 14),
      location: "Sala Negra, Teatro Municipal",
      image: PLACEHOLDER_IMAGES[3],
      price: "$25.000",
      priceCents: 25000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-5",
      title: "Concierto Electrónico Nocturno",
      description: "DJ sets y live acts. Sonido envolvente, luces y vibes. +18.",
      category: "música",
      dateTime: addDays(now, 3),
      location: "Warehouse 7",
      image: PLACEHOLDER_IMAGES[4],
      price: "$35.000",
      priceCents: 35000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-6",
      title: "Feria del Libro Independiente",
      description: "Editoriales pequeñas, fanzines y trueque de libros. Charlas con autores.",
      category: "literatura",
      dateTime: addDays(now, 21),
      location: "Casa de la Cultura",
      image: PLACEHOLDER_IMAGES[5],
      price: "Gratis",
      priceCents: 0,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-7",
      title: "Ritual — Noche de Performance",
      description: "Performance art, danza y música en vivo. Una noche inmersiva.",
      category: "arte",
      dateTime: addDays(now, 10),
      location: "Espacio Oculto",
      image: PLACEHOLDER_IMAGES[6],
      price: "$20.000",
      priceCents: 20000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-8",
      title: "Festival Urbano 2025",
      description: "Hip hop, rap en vivo, graffiti y breakdance. Escenario principal y zona de workshops.",
      category: "festival",
      dateTime: addDays(now, 28),
      location: "Plaza Central",
      image: PLACEHOLDER_IMAGES[7],
      price: "$45.000",
      priceCents: 45000,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-9",
      title: "Ciclo de Documentales Sociales",
      description: "Proyección y debate. Temas: migración, medio ambiente y memoria.",
      category: "cultura",
      dateTime: addDays(now, 6),
      location: "Centro Comunal Norte",
      image: PLACEHOLDER_IMAGES[8],
      price: "Entrada libre",
      priceCents: 0,
      organizerId: organizer.id,
    },
    {
      id: "seed-event-10",
      title: "Karaoke Underground",
      description: "Noche de karaoke con repertorio alternativo. Premio al mejor disfraz de artista.",
      category: "música",
      dateTime: addDays(now, 2),
      location: "Pub El Rincón",
      image: PLACEHOLDER_IMAGES[9],
      price: "$5.000",
      priceCents: 5000,
      organizerId: organizer.id,
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: {
        title: ev.title,
        description: ev.description,
        category: ev.category,
        dateTime: ev.dateTime,
        location: ev.location,
        image: ev.image,
        price: ev.price,
        priceCents: ev.priceCents,
      },
      create: {
        ...ev,
        status: "ACTIVE",
      },
    });
  }

  console.log("Seed completado:");
  console.log("- Admin: admin@underground.local / admin123");
  console.log("- Organizador: organizer@underground.local / organizer123");
  console.log("- Usuario: user@underground.local / user123");
  console.log("- Eventos: " + events.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
