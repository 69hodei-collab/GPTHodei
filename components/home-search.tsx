"use client";

import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { airports } from "@/data/aviation";

export function HomeSearch() {
  const router = useRouter(); const [from, setFrom] = useState("MAD"); const [to, setTo] = useState("IBZ"); const [passengers, setPassengers] = useState("4");
  return <div className="raised grid overflow-hidden shadow-lift md:grid-cols-[1fr_1fr_.85fr_.65fr_auto]">
    <label className="relative border-b hairline p-4 md:border-b-0 md:border-r"><span className="field-label"><MapPin size={12} className="mr-1 inline" /> Origen</span><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-0 bg-transparent p-0 text-sm font-semibold focus:ring-0">{airports.map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}</select></label>
    <label className="relative border-b hairline p-4 md:border-b-0 md:border-r"><span className="field-label"><MapPin size={12} className="mr-1 inline" /> Destino</span><select value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-0 bg-transparent p-0 text-sm font-semibold focus:ring-0">{airports.map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}</select></label>
    <label className="border-b hairline p-4 md:border-b-0 md:border-r"><span className="field-label"><CalendarDays size={12} className="mr-1 inline" /> Salida</span><input type="date" defaultValue="2026-08-23" className="w-full border-0 bg-transparent p-0 text-sm font-semibold focus:ring-0" /></label>
    <label className="border-b hairline p-4 md:border-b-0 md:border-r"><span className="field-label"><Users size={12} className="mr-1 inline" /> Viajeros</span><select value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full border-0 bg-transparent p-0 text-sm font-semibold focus:ring-0">{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}</select></label>
    <button onClick={() => router.push(`/cotizar?from=${from}&to=${to}&pax=${passengers}`)} className="flex min-h-16 items-center justify-center gap-2 bg-champagne px-6 text-xs font-bold uppercase tracking-[.12em] text-[#0A0B0F] hover:brightness-110">Cotizar <ArrowRight size={16} /></button>
  </div>;
}
