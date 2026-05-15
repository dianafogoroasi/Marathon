import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const napoli = await prisma.event.upsert({
    where: { privateToken: "napoli-2026-marathon" },
    update: {},
    create: {
      name: "Maratona di Napoli 2026",
      location: "Napoli, Italia",
      raceDate: new Date("2026-10-25T08:00:00.000Z"),
      registrationDeadline: new Date("2026-08-31T23:59:59.000Z"),
      description:
        "Corriamo insieme la Maratona di Napoli! Percorso panoramico lungo il lungomare partenopeo. Partenza da Piazza del Plebiscito.",
      privateToken: "napoli-2026-marathon",
    },
  });

  const barcellona = await prisma.event.upsert({
    where: { privateToken: "barcellona-2027-marathon" },
    update: {},
    create: {
      name: "Maratona di Barcellona 2027",
      location: "Barcellona, Spagna",
      raceDate: new Date("2027-03-14T08:00:00.000Z"),
      registrationDeadline: new Date("2026-12-31T23:59:59.000Z"),
      description:
        "La Zurich Marató de Barcelona! Uno dei percorsi più belli d'Europa attraverso il centro storico e il lungomare.",
      privateToken: "barcellona-2027-marathon",
    },
  });

  console.log("Seed completato:");
  console.log(`  Napoli:     /events/${napoli.privateToken}`);
  console.log(`  Barcellona: /events/${barcellona.privateToken}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
