"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

type Participant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  confirmed: boolean;
  declined: boolean;
  coupleLabel: string | null;
  raceType: string | null;
  departureDate: string | null;
  returnDate: string | null;
  hasBib: boolean;
  hasTransport: boolean;
  transportType: string | null;
  transportName: string | null;
  hasHotel: boolean;
  hotelName: string | null;
  hotelAddress: string | null;
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
  outbound: { date: string; from: string; dep: string; arr: string; to: string };
  inbound:  { date: string; from: string; dep: string; arr: string; to: string };
  totalPrice: string;
  bookingUrl: string;
};

type ModalSection = "race" | "travel";

type ParticipantGroup = {
  coupleLabel: string | null;
  members: Participant[];
};

// ── Helpers ────────────────────────────────────────────────────────────────

function isComplete(p: Participant): boolean {
  return p.raceType != null && p.hasTransport && p.hasHotel;
}

function raceLabel(r: string) {
  return r === "maratona" ? "Maratona" : r === "mezza" ? "Mezza" : "Supporto";
}

function fmt(d: string | null | undefined) {
  if (!d) return "?";
  return new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function groupAndSort(participants: Participant[]): ParticipantGroup[] {
  const map = new Map<string, Participant[]>();
  const singles: Participant[] = [];
  for (const p of participants) {
    if (p.coupleLabel) {
      const arr = map.get(p.coupleLabel) ?? [];
      arr.push(p);
      map.set(p.coupleLabel, arr);
    } else {
      singles.push(p);
    }
  }
  const groups: ParticipantGroup[] = [
    ...Array.from(map.entries()).map(([label, members]) => ({ coupleLabel: label, members })),
    ...singles.map(p => ({ coupleLabel: null, members: [p] })),
  ];
  const status = (g: ParticipantGroup) => {
    if (g.members.every(p => p.declined)) return 2;
    if (g.members.some(p => p.confirmed && !p.declined)) return 0;
    return 1;
  };
  return groups.sort((a, b) => status(a) - status(b));
}

function getGroupTravel(members: Participant[]) {
  const wt = members.find(m => m.hasTransport);
  const wh = members.find(m => m.hasHotel);
  const wd = members.find(m => m.departureDate);
  return {
    departureDate: wd?.departureDate ?? null,
    returnDate: wd?.returnDate ?? null,
    hasTransport: members.some(m => m.hasTransport),
    transportType: wt?.transportType ?? null,
    transportName: wt?.transportName ?? null,
    hasHotel: members.some(m => m.hasHotel),
    hotelName: wh?.hotelName ?? null,
  };
}

// ── Event meta & deals ─────────────────────────────────────────────────────

const eventMeta: Record<string, { gradient: string; emoji: string; deal?: Deal }> = {
  "napoli-2026-marathon": {
    gradient: "from-blue-950 via-slate-800 to-slate-900",
    emoji: "🌋",
  },
  "barcellona-2027-marathon": {
    gradient: "from-red-950 via-zinc-800 to-slate-900",
    emoji: "🎨",
    deal: {
      foundOn: "15/05/2026",
      airline: "Ryanair",
      outbound: { date: "Sab 13 Marzo 2027", from: "Venezia M.Polo", dep: "12:20", arr: "14:15", to: "Barcellona El Prat" },
      inbound:  { date: "Lun 15 Marzo 2027", from: "Barcellona El Prat", dep: "13:00", arr: "14:55", to: "Venezia M.Polo" },
      totalPrice: "€86.68",
      bookingUrl: "https://ryanair.com",
    },
  },
};

// ── MemberRow ──────────────────────────────────────────────────────────────

function MemberRow({
  p, cycling, onCycle, onOpenModal,
}: {
  p: Participant;
  cycling: string | null;
  onCycle: (p: Participant) => void;
  onOpenModal: (p: Participant, section: ModalSection) => void;
}) {
  const complete = isComplete(p);
  const circleClass = complete
    ? "bg-green-500 border-green-500 text-white"
    : "bg-orange-500 border-orange-500 text-white";
  const nameClass = complete ? "text-green-300" : "text-white";

  return (
    <div className="flex items-start gap-3">
      <div
        title={complete ? "Tutto completo!" : "Mancano alcune info"}
        className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 ${circleClass}`}
      >
        <span className="text-xs leading-none">✓</span>
      </div>

      <div className="flex-1 min-w-0">
        <span className={`font-medium text-sm ${nameClass}`}>{p.name}</span>

        {p.confirmed && !p.declined && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {/* Race + bib chip */}
            <button
              onClick={() => onOpenModal(p, "race")}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                p.raceType
                  ? (p.hasBib || p.raceType === "supporto")
                    ? "bg-green-500/10 border-green-500/25 text-green-400 hover:border-green-400"
                    : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
                  : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
              }`}
            >
              {p.raceType
                ? `🏅 ${raceLabel(p.raceType)}${p.raceType !== "supporto" ? (p.hasBib ? " · pettorale ✓" : " · pettorale da prendere") : ""}`
                : "⚠️ gara da inserire"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GroupCard ──────────────────────────────────────────────────────────────

function GroupCard({
  group, cycling, onCycle, onOpenModal,
}: {
  group: ParticipantGroup;
  cycling: string | null;
  onCycle: (p: Participant) => void;
  onOpenModal: (p: Participant, section: ModalSection, partnerId?: string) => void;
}) {
  const hasConfirmed = group.members.some(p => p.confirmed && !p.declined);
  const travel = getGroupTravel(group.members);
  const primary = group.members.find(p => p.confirmed && !p.declined) ?? group.members[0];
  const partnerId = group.members.length > 1 ? group.members.find(p => p.id !== primary.id)?.id : undefined;

  const transportIcon = travel.transportType === "treno" ? "🚄" : "✈️";
  const transportChip = travel.hasTransport && travel.transportName
    ? { text: `${transportIcon} ${travel.transportName}`, done: true }
    : { text: travel.hasTransport ? `${transportIcon} trasporto - nome da inserire` : "✈️ Volo/treno da inserire", done: false };

  const hotelChip = travel.hasHotel && travel.hotelName
    ? { text: `🏨 ${travel.hotelName}`, done: true }
    : { text: "🏨 Albergo - da inserire", done: false };

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden ${hasConfirmed ? "border-white/10" : "border-white/5"}`}>
      {/* Couple label + dates */}
      {group.coupleLabel && (
        <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{group.coupleLabel}</span>
          {travel.departureDate && (
            <span className="text-gray-600 text-xs">· 📅 {fmt(travel.departureDate)} → {fmt(travel.returnDate)}</span>
          )}
        </div>
      )}

      {/* Member rows */}
      <div className={`px-4 ${group.coupleLabel ? "pt-1 pb-3" : "py-3"} space-y-3`}>
        {group.members.map(p => (
          <MemberRow key={p.id} p={p} cycling={cycling} onCycle={onCycle} onOpenModal={onOpenModal} />
        ))}
      </div>

      {/* Shared travel chips — only for groups with at least one confirmed */}
      {hasConfirmed && (
        <div className="px-4 pb-3 pt-2 border-t border-white/5 flex flex-wrap gap-2">
          <button
            onClick={() => onOpenModal(primary, "travel", partnerId)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              transportChip.done
                ? "bg-blue-500/10 border-blue-500/25 text-blue-300 hover:border-blue-400"
                : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
            }`}
          >
            {transportChip.text}
          </button>
          <button
            onClick={() => onOpenModal(primary, "travel", partnerId)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              hotelChip.done
                ? "bg-purple-500/10 border-purple-500/25 text-purple-300 hover:border-purple-400"
                : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
            }`}
          >
            {hotelChip.text}
          </button>
        </div>
      )}
    </div>
  );
}

// ── ParticipantModal ───────────────────────────────────────────────────────

function ParticipantModal({
  participant, isNapoli, focusSection, onSave, onClose, onDelete,
}: {
  participant: Participant | null;
  isNapoli: boolean;
  focusSection?: ModalSection;
  onSave: (data: Partial<Participant>) => void;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Partial<Participant>>(
    participant ?? { name: "", confirmed: false, declined: false, hasBib: false, hasTransport: false, hasHotel: false }
  );
  const set = (field: keyof Participant, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  const raceRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (focusSection === "race") raceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (focusSection === "travel") travelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [focusSection]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white">{participant ? "Modifica" : "Aggiungi candidato"}</h2>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Nome */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Nome *</label>
            <input
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              value={form.name ?? ""}
              onChange={e => set("name", e.target.value)}
              placeholder="Nome e cognome"
            />
          </div>

          {/* Gara */}
          <div ref={raceRef}>
            <label className="text-gray-400 text-sm block mb-2">🏃 Partecipo come</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "maratona", label: "Maratona" },
                { value: "mezza",    label: "Mezza" },
                { value: "supporto", label: "Solo supporto" },
              ].map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => set("raceType", form.raceType === opt.value ? null : opt.value)}
                  className={`px-2 py-2 rounded-lg text-sm border transition-colors ${
                    form.raceType === opt.value
                      ? "bg-orange-500 border-orange-500 text-white font-semibold"
                      : "bg-gray-800 border-white/10 text-gray-300 hover:border-orange-400"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Pettorale */}
            <label className="flex items-center gap-3 cursor-pointer mt-3">
              <input type="checkbox" className="w-4 h-4 accent-orange-500"
                checked={form.hasBib ?? false} onChange={e => set("hasBib", e.target.checked)} />
              <div>
                <span className="text-white text-sm">🏅 Ho preso il pettorale</span>
                <p className="text-gray-500 text-xs">Mi sono iscritto/a alla gara ufficiale</p>
              </div>
            </label>
          </div>

          {/* Viaggio */}
          <div ref={travelRef} className="space-y-4 pt-1 border-t border-white/5">
            <p className="text-gray-400 text-sm font-medium pt-2">Viaggio</p>

            {/* Date */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">📅 Date del viaggio</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Partenza</p>
                  <input type="date"
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm"
                    value={form.departureDate ?? (isNapoli ? "2026-10-17" : "2027-03-13")}
                    onChange={e => set("departureDate", e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Ritorno</p>
                  <input type="date"
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm"
                    value={form.returnDate ?? (isNapoli ? "2026-10-19" : "2027-03-15")}
                    onChange={e => set("returnDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Trasporto */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-500"
                  checked={form.hasTransport ?? false} onChange={e => set("hasTransport", e.target.checked)} />
                <span className="text-white text-sm">✈️ Ho prenotato il trasporto</span>
              </label>
              {form.hasTransport && (
                <div className="ml-7 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: "volo", label: "✈️ Volo" }, { value: "treno", label: "🚄 Treno" }].map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => set("transportType", opt.value)}
                        className={`py-1.5 rounded-lg text-sm border transition-colors ${
                          form.transportType === opt.value
                            ? "bg-orange-500 border-orange-500 text-white font-semibold"
                            : "bg-gray-800 border-white/10 text-gray-300 hover:border-orange-400"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 text-sm"
                    placeholder="Compagnia (es. Wizz Air, Italo…)"
                    value={form.transportName ?? ""}
                    onChange={e => set("transportName", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Albergo */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-500"
                  checked={form.hasHotel ?? false} onChange={e => set("hasHotel", e.target.checked)} />
                <span className="text-white text-sm">🏨 Ho prenotato l&apos;albergo</span>
              </label>
              {form.hasHotel && (
                <div className="ml-7 space-y-2">
                  <input
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 text-sm"
                    placeholder="Nome albergo"
                    value={form.hotelName ?? ""}
                    onChange={e => set("hotelName", e.target.value)}
                  />
                  <input
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 text-sm"
                    placeholder="Indirizzo"
                    value={form.hotelAddress ?? ""}
                    onChange={e => set("hotelAddress", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Note (opzionale)</label>
            <textarea
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
              value={form.notes ?? ""}
              onChange={e => set("notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3 justify-between shrink-0">
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

// ── EventPage ──────────────────────────────────────────────────────────────

export default function EventPage() {
  const { token } = useParams<{ token: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    open: boolean;
    participant: Participant | null;
    focusSection?: ModalSection;
    partnerId?: string;
  }>({ open: false, participant: null });
  const [cycling, setCycling] = useState<string | null>(null);
  const [dealOpen, setDealOpen] = useState(false);

  const isNapoli = token === "napoli-2026-marathon";
  const meta = eventMeta[token] ?? { gradient: "from-gray-800 to-gray-700", emoji: "🏃" };

  async function fetchEvent() {
    const res = await fetch(`/api/events/${token}/participants`, { cache: "no-store" });
    if (res.ok) setEvent(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchEvent(); }, [token]);

  async function cycleStatus(p: Participant) {
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
      // Sync travel fields to partner if in a couple
      if (modal.partnerId) {
        const partner = event?.participants.find(p => p.id === modal.partnerId);
        if (partner) {
          await fetch(`/api/participants/${modal.partnerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...partner,
              departureDate: data.departureDate,
              returnDate: data.returnDate,
              hasTransport: data.hasTransport,
              transportType: data.transportType,
              transportName: data.transportName,
              hasHotel: data.hasHotel,
              hotelName: data.hotelName,
              hotelAddress: data.hotelAddress,
            }),
          });
        }
      }
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

  function openModal(p: Participant, section: ModalSection, partnerId?: string) {
    setModal({ open: true, participant: p, focusSection: section, partnerId });
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white/30 animate-pulse text-sm tracking-widest uppercase">Caricamento...</div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
      <p className="text-2xl">Evento non trovato</p>
      <Link href="/" className="text-white/40 hover:text-white transition-colors">← Torna alla home</Link>
    </div>
  );

  const raceDate = new Date(event.raceDate).toLocaleDateString("it-IT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const total = event.participants.length;
  const confirmed = event.participants.filter(p => p.confirmed && !p.declined).length;
  const declined = event.participants.filter(p => p.declined).length;
  const confirmedList = event.participants.filter(p => p.confirmed && !p.declined);
  const support = confirmedList.filter(p => p.raceType === "supporto").length;
  const bib = confirmedList.filter(p => p.hasBib).length;
  const transport = confirmedList.filter(p => p.hasTransport).length;
  const hotel = confirmedList.filter(p => p.hasHotel).length;
  const bibMissing = Math.max(0, confirmed - support - bib);
  const transportMissing = Math.max(0, confirmed - transport);
  const hotelMissing = Math.max(0, confirmed - hotel);

  const confirmedOnly = event.participants.filter(p => p.confirmed && !p.declined);
  const groups = groupAndSort(confirmedOnly);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-white/5 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/30 hover:text-white transition-colors text-sm tracking-wide">← indietro</Link>
          <span className="text-white font-black tracking-[0.2em] text-sm uppercase">Marathon</span>
        </div>
      </header>

      <div className={`relative h-64 bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span className="text-[10rem] font-black text-white/[0.04] tracking-tighter whitespace-nowrap select-none leading-none">
            {event.location.split(",")[0].toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-7">
          <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-2">Maratona</p>
          <h1 className="text-4xl font-black tracking-tight leading-none">{event.location.split(",")[0]}</h1>
          <p className="text-white/40 text-sm mt-2">{raceDate}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Description — prominent */}
        {event.description && (
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-5">
            <p className="text-white text-base leading-relaxed">{event.description}</p>
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/10">
              {isNapoli && (
                <a href="https://maps.google.com/?q=Piazza+del+Plebiscito,+Napoli" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-medium">
                  📍 Apri su Maps
                </a>
              )}
              {event.officialUrl && (
                <a href={event.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="text-orange-400 hover:underline font-medium">
                  Sito ufficiale →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-900 border border-white/8 rounded-xl p-4 space-y-3">
          <p className="text-white/80 text-base">
            <span className="text-white/40">1.</span> <span className="text-white">Conferma la tua presenza</span> — clicca il pallino accanto al tuo nome: <span className="text-white/70">una volta</span> per confermare ✓, <span className="text-red-400/80">due volte</span> per segnare che non vieni ✕
          </p>
          <p className="text-white/40 text-sm pl-4 space-y-0.5">
            <span className="inline-flex items-center gap-1.5 mr-3"><span className="inline-block w-4 h-4 rounded-full bg-green-500 shrink-0" /> <span>= tutte le info inserite</span></span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-4 rounded-full bg-orange-500 shrink-0" /> <span>= mancano ancora alcune info</span></span>
          </p>
          <p className="text-white/80 text-base">
            <span className="text-white/40">2.</span> <span className="text-white">Inserisci i tuoi dettagli</span> — clicca i pulsanti colorati sotto il tuo nome per indicare a che gara ti sei iscritto, se hai già il pettorale, come ti sposti e dove dormi. Diventano <span className="text-green-400">verdi ✓</span> man mano che compili
          </p>
          <p className="text-white/80 text-base">
            <span className="text-white/40">3.</span> <span className="text-white">Non ti trovi in lista?</span> — clicca <span className="text-white font-semibold">+ Aggiungi candidato</span> in fondo alla pagina
          </p>
          {meta.deal && (
            <p className="text-white/80 text-base">
              <span className="text-white/40">4.</span> <span className="text-white">Offerta volo</span> — verifica in fondo alla pagina la migliore offerta trovata da Diana 🙂
            </p>
          )}
        </div>

        {/* Stats — row 1: partecipazione */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Candidati",   value: total,     color: "text-white",      bg: "bg-gray-900 border-white/10" },
              { label: "Confermati",  value: confirmed, color: "text-white",      bg: "bg-white/5 border-white/10" },
              { label: "Non vengono", value: declined,  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30" },
            ].map(s => (
              <div key={s.label} className={`border rounded-xl p-3 text-center ${s.bg}`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Stats — row 2: logistica */}
          <div className="grid grid-cols-4 gap-2">
            <div className="border rounded-xl p-3 text-center bg-gray-900 border-white/10">
              <div className="text-2xl font-bold text-white">{support}</div>
              <div className="text-gray-500 text-xs leading-tight">Supporto</div>
              <div className="text-gray-600 text-xs mt-0.5">non corrono</div>
            </div>
            <div className="border rounded-xl p-3 text-center bg-gray-900 border-white/10">
              <div className="text-2xl font-bold text-white">{bib}</div>
              <div className="text-gray-500 text-xs leading-tight">Pettorale</div>
              {bibMissing > 0
                ? <div className="text-yellow-500 text-xs mt-0.5">mancano {bibMissing}</div>
                : <div className="text-green-500 text-xs mt-0.5">completo ✓</div>}
            </div>
            <div className="border rounded-xl p-3 text-center bg-gray-900 border-white/10">
              <div className="text-2xl font-bold text-white">{transport}</div>
              <div className="text-gray-500 text-xs leading-tight">Trasporto</div>
              {transportMissing > 0
                ? <div className="text-yellow-500 text-xs mt-0.5">mancano {transportMissing}</div>
                : <div className="text-green-500 text-xs mt-0.5">completo ✓</div>}
            </div>
            <div className="border rounded-xl p-3 text-center bg-gray-900 border-white/10">
              <div className="text-2xl font-bold text-white">{hotel}</div>
              <div className="text-gray-500 text-xs leading-tight">Albergo</div>
              {hotelMissing > 0
                ? <div className="text-yellow-500 text-xs mt-0.5">mancano {hotelMissing}</div>
                : <div className="text-green-500 text-xs mt-0.5">completo ✓</div>}
            </div>
          </div>
        </div>

        {/* Grouped list */}
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-4">Lista partecipanti</h2>
          <div className="space-y-3">
            {groups.map(group => (
              <GroupCard
                key={group.coupleLabel ?? group.members[0].id}
                group={group}
                cycling={cycling}
                onCycle={cycleStatus}
                onOpenModal={openModal}
              />
            ))}
          </div>
        </div>

        {/* Flight deal — in fondo alla pagina */}
        {meta.deal && (
          <div className="rounded-2xl overflow-hidden border border-yellow-400/40 shadow-lg shadow-yellow-400/10">
            <button
              onClick={() => setDealOpen(v => !v)}
              className="w-full bg-yellow-400/10 px-5 py-3 flex items-center justify-between hover:bg-yellow-400/15 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-yellow-400 text-lg">✈️</span>
                <span className="text-yellow-400 font-bold text-sm tracking-wide uppercase truncate">
                  Super Offerta {meta.deal.airline} — {meta.deal.totalPrice} a/r · trovata il {meta.deal.foundOn}
                </span>
              </div>
              <span className="text-yellow-400 text-sm ml-3 shrink-0">{dealOpen ? "▲" : "▼"}</span>
            </button>
            {dealOpen && (
              <div className="bg-gray-900 p-5 space-y-4">
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
            )}
          </div>
        )}
      </div>

      {modal.open && (
        <ParticipantModal
          participant={modal.participant}
          isNapoli={isNapoli}
          focusSection={modal.focusSection}
          onSave={handleSave}
          onClose={() => setModal({ open: false, participant: null })}
        />
      )}
    </main>
  );
}
