"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Participant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  confirmed: boolean;
  declined: boolean;
  hasBib: boolean;
  hasTransport: boolean;
  transportType: string | null;
  hasHotel: boolean;
  notes: string | null;
};

type Event = {
  id: string;
  name: string;
  location: string;
  raceDate: string;
  description: string | null;
  officialUrl: string | null;
  participants: Participant[];
};

type Deal = {
  foundOn: string;
  airline: string;
  airlineLogo: string;
  outbound: { date: string; from: string; dep: string; arr: string; to: string };
  inbound: { date: string; from: string; dep: string; arr: string; to: string };
  totalPrice: string;
  bookingUrl: string;
};

const eventMeta: Record<string, { gradient: string; emoji: string; deal?: Deal }> = {
  "napoli-2026-marathon": {
    gradient: "from-blue-900 via-blue-700 to-orange-500",
    emoji: "🌋",
    deal: {
      foundOn: "15/05/2026",
      airline: "Wizz Air",
      airlineLogo: "W",
      outbound: { date: "Sab 17 Ottobre 2026", from: "Venezia VCE", dep: "15:05", arr: "16:25", to: "Napoli NAP" },
      inbound:  { date: "Lun 19 Ottobre 2026", from: "Napoli NAP",  dep: "17:00", arr: "18:20", to: "Venezia VCE" },
      totalPrice: "~€55",
      bookingUrl: "https://wizzair.com",
    },
  },
  "barcellona-2027-marathon": {
    gradient: "from-red-900 via-yellow-700 to-orange-400",
    emoji: "🎨",
    deal: {
      foundOn: "15/05/2026",
      airline: "Ryanair",
      airlineLogo: "R",
      outbound: { date: "Sab 13 Marzo 2027", from: "Venezia M.Polo", dep: "12:20", arr: "14:15", to: "Barcellona El Prat" },
      inbound:  { date: "Lun 15 Marzo 2027", from: "Barcellona El Prat", dep: "13:00", arr: "14:55", to: "Venezia M.Polo" },
      totalPrice: "€86.68",
      bookingUrl: "https://ryanair.com",
    },
  },
};

function ParticipantModal({
  participant,
  isNapoli,
  onSave,
  onClose,
  onDelete,
}: {
  participant: Participant | null;
  isNapoli: boolean;
  onSave: (data: Partial<Participant>) => void;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Partial<Participant>>(
    participant ?? { name: "", confirmed: false, hasBib: false, hasTransport: false, hasHotel: false }
  );
  const set = (field: keyof Participant, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {participant ? "Modifica" : "Aggiungi candidato"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Nome *</label>
            <input
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nome e cognome"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email (opzionale)</label>
            <input
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              type="email"
            />
          </div>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm font-medium">Logistica</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-orange-500"
                checked={form.hasBib ?? false} onChange={(e) => set("hasBib", e.target.checked)} />
              <div>
                <span className="text-white text-sm">🏅 Pettorale</span>
                <p className="text-gray-500 text-xs">Mi sono iscritto/a alla gara</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-orange-500"
                checked={form.hasTransport ?? false} onChange={(e) => set("hasTransport", e.target.checked)} />
              <div>
                <span className="text-white text-sm">✈️ Trasporto</span>
                <p className="text-gray-500 text-xs">Ho prenotato {isNapoli ? "volo o treno" : "il volo"}</p>
              </div>
            </label>
            {form.hasTransport && isNapoli && (
              <div className="ml-7">
                <select
                  className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500"
                  value={form.transportType ?? ""}
                  onChange={(e) => set("transportType", e.target.value)}
                >
                  <option value="">Seleziona tipo</option>
                  <option value="volo">✈️ Volo</option>
                  <option value="treno">🚄 Treno</option>
                </select>
              </div>
            )}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-orange-500"
                checked={form.hasHotel ?? false} onChange={(e) => set("hasHotel", e.target.checked)} />
              <div>
                <span className="text-white text-sm">🏨 Albergo</span>
                <p className="text-gray-500 text-xs">Ho prenotato l&apos;albergo</p>
              </div>
            </label>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Note (opzionale)</label>
            <textarea
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3 justify-between">
          <div>
            {onDelete && (
              <button onClick={onDelete}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                Rimuovi
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white border border-white/10 rounded-lg text-sm transition-colors">
              Annulla
            </button>
            <button
              onClick={() => form.name?.trim() && onSave(form)}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-sm font-semibold transition-colors">
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventPage() {
  const { token } = useParams<{ token: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; participant: Participant | null }>({ open: false, participant: null });
  const [cycling, setCycling] = useState<string | null>(null);

  const isNapoli = token === "napoli-2026-marathon";
  const meta = eventMeta[token] ?? { gradient: "from-gray-800 to-gray-700", emoji: "🏃" };

  async function fetchEvent() {
    const res = await fetch(`/api/events/${token}/participants`, { cache: "no-store" });
    if (res.ok) setEvent(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchEvent(); }, [token]);

  async function cycleStatus(p: Participant) {
    // pending → confirmed → declined → pending
    let next: { confirmed: boolean; declined: boolean };
    if (!p.confirmed && !p.declined) next = { confirmed: true, declined: false };
    else if (p.confirmed) next = { confirmed: false, declined: true };
    else next = { confirmed: false, declined: false };

    setCycling(p.id);
    await fetch(`/api/participants/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, ...next }),
    });
    await fetchEvent();
    setCycling(null);
  }

  async function handleSave(data: Partial<Participant>) {
    if (modal.participant) {
      await fetch(`/api/participants/${modal.participant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`/api/events/${token}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModal({ open: false, participant: null });
    fetchEvent();
  }

  async function handleDelete() {
    if (!modal.participant) return;
    await fetch(`/api/participants/${modal.participant.id}`, { method: "DELETE" });
    setModal({ open: false, participant: null });
    fetchEvent();
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-orange-400 animate-pulse text-lg">Caricamento...</div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
      <p className="text-2xl">Evento non trovato</p>
      <Link href="/" className="text-orange-400 hover:underline">← Torna alla home</Link>
    </div>
  );

  const raceDate = new Date(event.raceDate).toLocaleDateString("it-IT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const stats = {
    candidati: event.participants.length,
    confermati: event.participants.filter((p) => p.confirmed).length,
    declinati: event.participants.filter((p) => p.declined).length,
    bib: event.participants.filter((p) => p.hasBib).length,
    transport: event.participants.filter((p) => p.hasTransport).length,
    hotel: event.participants.filter((p) => p.hasHotel).length,
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-orange-500/30 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors mr-1">←</Link>
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">O</div>
          <span className="font-bold text-orange-400 tracking-wide">OLLSCARS</span>
        </div>
      </header>

      <div className={`h-48 bg-gradient-to-br ${meta.gradient} relative`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-5xl mb-1">{meta.emoji}</span>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-white/70 text-sm mt-1">{event.location} · {raceDate}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {event.officialUrl && (
          <div className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <p className="text-gray-400 text-sm">{event.description}</p>
            <a href={event.officialUrl} target="_blank" rel="noopener noreferrer"
              className="text-orange-400 text-sm hover:underline whitespace-nowrap ml-4">
              Sito ufficiale →
            </a>
          </div>
        )}

        {/* Flight deal */}
        {meta.deal && (
          <div className="rounded-2xl overflow-hidden border border-yellow-400/40 shadow-lg shadow-yellow-400/10">
            <div className="bg-yellow-400/10 px-5 py-3 flex items-center justify-between border-b border-yellow-400/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">✈️</span>
                <span className="text-yellow-400 font-bold text-sm tracking-wide uppercase">Super Offerta trovata il {meta.deal.foundOn}</span>
              </div>
              <span className="text-yellow-400/60 text-xs font-medium">{meta.deal.airline}</span>
            </div>
            <div className="bg-gray-900 p-5 space-y-4">
              {/* Outbound */}
              {[meta.deal.outbound, meta.deal.inbound].map((leg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs w-4">{i === 0 ? "→" : "←"}</span>
                  <div className="flex-1">
                    <p className="text-white/50 text-xs mb-1">{leg.date}</p>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <p className="text-white font-bold text-2xl leading-none">{leg.dep}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{leg.from}</p>
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-600 mx-2" />
                      <div className="text-center">
                        <p className="text-white font-bold text-2xl leading-none">{leg.arr}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{leg.to}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs">Totale andata e ritorno</p>
                  <p className="text-yellow-400 font-bold text-4xl leading-none mt-1">{meta.deal.totalPrice}</p>
                  <p className="text-gray-500 text-xs mt-1">a persona · solo volo</p>
                </div>
                <a href={meta.deal.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm px-5 py-3 rounded-xl transition-colors">
                  Prenota ora →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-4 space-y-2">
          <p className="text-white font-semibold text-base">
            <span className="text-orange-400">1.</span> Cercati in lista e clicca il pallino accanto al tuo nome — <span className="text-orange-400">una volta</span> per confermare la tua presenza, <span className="text-red-400">due volte</span> per segnare che non vieni
          </p>
          <p className="text-white font-semibold text-base">
            <span className="text-orange-400">2.</span> Per tracciare pettorale, trasporto e albergo clicca su <span className="text-orange-400 font-bold">Modifica</span> accanto al tuo nome
          </p>
          <p className="text-white font-semibold text-base">
            <span className="text-orange-400">3.</span> Se non ti trovi in lista clicca su <span className="text-orange-400 font-bold">+ Aggiungi candidato</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: "Candidati", value: stats.candidati, color: "text-white", bg: "bg-gray-900 border-white/10" },
            { label: "Confermati", value: stats.confermati, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
            { label: "Non vengono", value: stats.declinati, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
            { label: "Pettorale", value: stats.bib, color: "text-white", bg: "bg-gray-900 border-white/10" },
            { label: "Trasporto", value: stats.transport, color: "text-white", bg: "bg-gray-900 border-white/10" },
            { label: "Albergo", value: stats.hotel, color: "text-white", bg: "bg-gray-900 border-white/10" },
          ].map((s) => (
            <div key={s.label} className={`border rounded-xl p-3 text-center ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Lista candidati</h2>
            <button
              onClick={() => setModal({ open: true, participant: null })}
              className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              + Aggiungi candidato
            </button>
          </div>

          <div className="space-y-2">
            {event.participants.map((p, i) => (
              <div key={p.id}
                className={`bg-gray-900 border rounded-xl px-4 py-3 transition-all ${
                  p.confirmed ? "border-orange-500/30" : p.declined ? "border-red-500/20" : "border-white/10"
                }`}>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-5 text-right shrink-0">{i + 1}</span>

                  {/* Status cycle button: pending → confirmed → declined → pending */}
                  <button
                    onClick={() => cycleStatus(p)}
                    disabled={cycling === p.id}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      p.confirmed
                        ? "bg-orange-500 border-orange-500 text-white"
                        : p.declined
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-600 hover:border-orange-400"
                    } ${cycling === p.id ? "opacity-50" : ""}`}
                    title={p.confirmed ? "Confermato — clicca per segnare Non vengo" : p.declined ? "Non viene — clicca per tornare In attesa" : "In attesa — clicca per confermare"}
                  >
                    {p.confirmed && <span className="text-xs leading-none">✓</span>}
                    {p.declined && <span className="text-xs leading-none">✕</span>}
                  </button>

                  {/* Name */}
                  <span className={`font-medium flex-1 ${p.confirmed ? "text-white" : p.declined ? "text-red-400 line-through" : "text-gray-400"}`}>
                    {p.name}
                  </span>

                  {/* Status badges */}
                  <div className="hidden sm:flex gap-1.5">
                    {p.hasBib && <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">🏅</span>}
                    {p.hasTransport && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                      {p.transportType === "treno" ? "🚄" : "✈️"}
                    </span>}
                    {p.hasHotel && <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🏨</span>}
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => setModal({ open: true, participant: p })}
                    className="text-orange-400 hover:text-orange-300 text-xs border border-orange-500/30 hover:border-orange-400 px-2 py-1 rounded-lg transition-colors shrink-0 ml-1 whitespace-nowrap">
                    Modifica
                  </button>
                </div>

                {/* Mobile badges */}
                {(p.hasBib || p.hasTransport || p.hasHotel) && (
                  <div className="flex sm:hidden gap-1.5 mt-2 ml-14">
                    {p.hasBib && <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">🏅 Pettorale</span>}
                    {p.hasTransport && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">{p.transportType === "treno" ? "🚄 Treno" : "✈️ Volo"}</span>}
                    {p.hasHotel && <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🏨 Albergo</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal.open && (
        <ParticipantModal
          participant={modal.participant}
          isNapoli={isNapoli}
          onSave={handleSave}
          onClose={() => setModal({ open: false, participant: null })}
          onDelete={modal.participant ? handleDelete : undefined}
        />
      )}
    </main>
  );
}
