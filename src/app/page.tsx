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
      <div className="max-w-5xl mx-auto px-5 pt-14 pb-8">
        <p className="text-gray-600 text-xs tracking-[0.2em] uppercase mb-2">Le nostre trasferte</p>
        <h1 className="text-5xl font-black tracking-tight leading-none">
          Corriamo <span className="text-orange-400 italic">insieme.</span>
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

                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{meta.emoji}</span>
                    <span className="bg-white/10 backdrop-blur-md text-white/80 text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/15 tracking-widest">
                      {new Date(event.raceDate).getFullYear()}
                    </span>
                  </div>

                  {/* Bottom section */}
                  <div className="space-y-5">

                    {/* City + landmarks */}
                    <div>
                      <h2 className="text-5xl font-black tracking-tight leading-none">{event.location.split(",")[0]}</h2>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {meta.landmarks.map(l => (
                          <span key={l} className="text-[11px] text-white/50 bg-white/8 px-2.5 py-1 rounded-full border border-white/10">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Date + countdown */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Data gara</p>
                        <p className="text-white font-semibold">{meta.raceDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-400 text-[11px] tracking-wider uppercase mb-0.5">Giorni al via</p>
                        <p className="text-5xl font-black text-orange-400 leading-none">{daysLeft}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-white/40 mb-2">
                        <span>{confirmed} confermati su {total} candidati</span>
                        <span className="text-orange-400 font-semibold">{pct}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
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
