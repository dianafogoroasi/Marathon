import Link from "next/link";
import { prisma } from "@/lib/prisma";

const eventMeta: Record<string, { gradient: string; emoji: string; landmarks: string[]; raceDate: string }> = {
  "napoli-2026-marathon": {
    gradient: "from-blue-950 via-blue-800 to-orange-600",
    emoji: "🌋",
    landmarks: ["Vesuvio", "Lungomare", "Castel dell'Ovo"],
    raceDate: "18 Ottobre 2026",
  },
  "barcellona-2027-marathon": {
    gradient: "from-red-950 via-red-800 to-yellow-600",
    emoji: "🎨",
    landmarks: ["Sagrada Família", "Barceloneta", "Las Ramblas"],
    raceDate: "14 Marzo 2027",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await prisma.event.findMany({
    include: {
      participants: { select: { confirmed: true, declined: true } },
    },
    orderBy: { raceDate: "asc" },
  });

  const now = new Date();

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/5 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-black">O</div>
            <div>
              <span className="font-black text-white tracking-widest text-sm">OLLSCARS</span>
              <span className="text-gray-500 text-xs ml-2 tracking-wide uppercase">Running Club</span>
            </div>
          </div>
          <span className="text-gray-600 text-xs tracking-wider uppercase">Marathon Trips</span>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-5xl mx-auto px-5 pt-14 pb-10">
        <p className="text-gray-600 text-xs tracking-[0.2em] uppercase mb-3">Le nostre trasferte</p>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
          Corriamo<br/><span className="text-orange-400 italic">insieme.</span>
        </h1>
      </div>

      {/* Event cards */}
      <div className="max-w-5xl mx-auto px-5 pb-20 grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((event) => {
          const meta = eventMeta[event.privateToken];
          if (!meta) return null;

          const total = event.participants.length;
          const confirmed = event.participants.filter(p => p.confirmed && !p.declined).length;
          const pct = total > 0 ? Math.round((confirmed / total) * 100) : 0;
          const daysLeft = Math.ceil((new Date(event.raceDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const cityName = event.location.split(",")[0].toUpperCase();

          return (
            <Link key={event.privateToken} href={`/events/${event.privateToken}`} className="group block select-none">
              <div className="relative h-[480px] rounded-3xl overflow-hidden border border-white/8 hover:border-orange-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/15 hover:-translate-y-1">

                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />

                {/* City watermark */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <span className="text-[11rem] font-black text-white/[0.04] tracking-tighter whitespace-nowrap select-none leading-none">
                    {cityName}
                  </span>
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-7">

                  {/* Top row — numero evento + anno */}
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase">
                      Maratona
                    </span>
                    <span className="text-xs font-bold tracking-[0.25em] text-white/30">
                      {new Date(event.raceDate).getFullYear()}
                    </span>
                  </div>

                  {/* Bottom section */}
                  <div className="space-y-6">

                    {/* City + date */}
                    <div>
                      <h2 className="text-6xl font-black tracking-tight leading-none">{event.location.split(",")[0]}</h2>
                      <p className="text-white/50 text-base mt-3 tracking-wide">{meta.raceDate}</p>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-7xl font-black text-orange-400 leading-none">{daysLeft}</span>
                      <span className="text-white/40 text-sm tracking-wider uppercase leading-tight">giorni<br/>al via</span>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-sm text-white/40 mb-2">
                        <span>{confirmed} confermati su {total}</span>
                        <span className="text-orange-400 font-semibold">{pct}%</span>
                      </div>
                      <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-end pt-1">
                      <span className="text-white/60 text-sm group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300 inline-block">
                        Vai all'evento →
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <footer className="text-center text-gray-700 text-xs pb-10 tracking-wider">
        <a href="https://www.ollscars.it" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors uppercase">
          🏃 ollscars.it
        </a>
      </footer>
    </main>
  );
}
