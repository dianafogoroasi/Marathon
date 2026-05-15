import Link from "next/link";
import { prisma } from "@/lib/prisma";

const eventMeta: Record<string, { gradient: string; emoji: string; landmarks: string; raceDate: string }> = {
  "napoli-2026-marathon": {
    gradient: "from-blue-900 via-blue-700 to-orange-500",
    emoji: "🌋",
    landmarks: "Vesuvio · Lungomare · Castel dell'Ovo",
    raceDate: "25 Ottobre 2026",
  },
  "barcellona-2027-marathon": {
    gradient: "from-red-900 via-yellow-700 to-orange-400",
    emoji: "🏛️",
    landmarks: "Sagrada Família · Barceloneta · Las Ramblas",
    raceDate: "14 Marzo 2027",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await prisma.event.findMany({
    include: {
      participants: { select: { confirmed: true } },
    },
    orderBy: { raceDate: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-orange-500/30 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
            O
          </div>
          <div>
            <span className="font-bold text-orange-400 tracking-wide">OLLSCARS</span>
            <span className="text-gray-400 text-sm ml-2">Running Club</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Le nostre <span className="text-orange-400">Maratone</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Seleziona un evento per vedere la lista e aggiornare la tua adesione
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const meta = eventMeta[event.privateToken];
          if (!meta) return null;
          const total = event.participants.length;
          const confirmed = event.participants.filter((p) => p.confirmed).length;

          return (
            <Link key={event.privateToken} href={`/events/${event.privateToken}`} className="group block select-none">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20">
                <div className={`h-52 bg-gradient-to-br ${meta.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <span className="text-6xl mb-2">{meta.emoji}</span>
                    <h2 className="text-3xl font-bold drop-shadow-lg">{event.location.split(",")[0]}</h2>
                    <p className="text-white/80 text-sm mt-1">{meta.landmarks}</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white">{event.name}</h3>
                      <p className="text-gray-400 text-sm">📅 {meta.raceDate}</p>
                    </div>
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/30 shrink-0 ml-2">
                      {new Date(event.raceDate).getFullYear()}
                    </span>
                  </div>

                  {/* Confirmed count */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-orange-400">{confirmed}</span>
                        <p className="text-gray-500 text-xs">confermati</p>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-400">{total}</span>
                        <p className="text-gray-500 text-xs">candidati</p>
                      </div>
                    </div>
                    <span className="text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                      Vai all&apos;evento →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <footer className="text-center text-gray-600 text-xs pb-8">
        <a href="https://www.ollscars.it" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
          🏃 ollscars.it
        </a>
      </footer>
    </main>
  );
}
