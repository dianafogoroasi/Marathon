import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

const initialParticipants = [
  { name: "Diana Fogoroasi" },
  { name: "Marianmonica" },
  { name: "Andrea Ghedin" },
  { name: "Michele Borin" },
  { name: "Flavio Ollscars" },
  { name: "Cristiano Ollscars" },
  { name: "Lorenzo Ostanello" },
  { name: "Pio" },
  { name: "Monika Faber" },
  { name: "Laura Ollscars SL" },
  { name: "Aldo Serafin" },
  { name: "Claudio Deblasio" },
  { name: "Cinzia" },
  { name: "Eisa Finotto" },
  { name: "Matteo Ostanello" },
];

async function main() {
  const napoli = await prisma.event.upsert({
    where: { privateToken: "napoli-2026-marathon" },
    update: {
      officialUrl: "https://www.neapolismarathon.it/marathon/",
    },
    create: {
      name: "Maratona di Napoli 2026",
      location: "Napoli, Italia",
      raceDate: new Date("2026-10-18T08:00:00.000Z"),
      registrationDeadline: new Date("2026-08-31T23:59:59.000Z"),
      description: "Corriamo insieme la Maratona di Napoli! Percorso panoramico lungo il lungomare partenopeo.",
      officialUrl: "https://www.neapolismarathon.it/marathon/",
      privateToken: "napoli-2026-marathon",
    },
  });

  const barcellona = await prisma.event.upsert({
    where: { privateToken: "barcellona-2027-marathon" },
    update: {
      officialUrl: "https://zurichmaratobarcelona.es/en/",
    },
    create: {
      name: "Maratona di Barcellona 2027",
      location: "Barcellona, Spagna",
      raceDate: new Date("2027-03-14T08:00:00.000Z"),
      registrationDeadline: new Date("2026-12-31T23:59:59.000Z"),
      description: "La Zurich Marató de Barcelona! Uno dei percorsi più belli d'Europa.",
      officialUrl: "https://zurichmaratobarcelona.es/en/",
      privateToken: "barcellona-2027-marathon",
    },
  });

  // Add participants to both events (skip if already exist)
  for (const p of initialParticipants) {
    const exists = await prisma.participant.findFirst({
      where: { eventId: napoli.id, name: p.name },
    });
    if (!exists) {
      await prisma.participant.create({ data: { ...p, eventId: napoli.id } });
    }
  }

  for (const p of initialParticipants) {
    const exists = await prisma.participant.findFirst({
      where: { eventId: barcellona.id, name: p.name },
    });
    if (!exists) {
      await prisma.participant.create({ data: { ...p, eventId: barcellona.id } });
    }
  }

  console.log("Seed completato:");
  console.log(`  Napoli (${initialParticipants.length} partecipanti):     /events/${napoli.privateToken}`);
  console.log(`  Barcellona (${initialParticipants.length} partecipanti): /events/${barcellona.privateToken}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
