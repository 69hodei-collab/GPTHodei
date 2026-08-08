"use client";

import { Check, CreditCard, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useDemo } from "./demo-provider";

export function BookingModal({ open, onClose, title, price }: { open: boolean; onClose: () => void; title: string; price: number }) {
  const [done, setDone] = useState(false); const { reserve } = useDemo();
  if (!open) return null;
  const confirm = () => { reserve(title, price); setDone(true); };
  return <div className="fixed inset-0 z-[80] grid place-items-end bg-black/65 p-0 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Confirmar reserva">
    <div className="raised w-full max-w-lg rounded-t-md p-6 shadow-lift sm:rounded-md sm:p-8">
      <div className="flex items-center justify-between"><span className="eyebrow">Checkout seguro · demo</span><button onClick={onClose} aria-label="Cerrar" className="p-2 text-muted hover:text-ink"><X size={20} /></button></div>
      {done ? <div className="py-10 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-success text-success"><Check /></span><h2 className="display mt-6 text-4xl">Reserva confirmada.</h2><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">Tu itinerario y la documentación KYC están listos en el panel. El concierge te contactará en unos minutos.</p><button onClick={onClose} className="btn-primary mt-7">Continuar</button></div> : <>
        <h2 className="display mt-6 text-4xl">{title}</h2>
        <div className="mt-6 flex items-end justify-between border-y hairline py-5"><span className="text-sm text-muted">Total estimado</span><span className="text-3xl font-semibold tabular">{price.toLocaleString("es-ES")} <small className="text-sm font-normal text-muted">EUR</small></span></div>
        <div className="mt-6 grid gap-3 text-sm text-muted"><p className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-success" /> KYC verificado y operador con AOC validado</p><p className="flex gap-3"><CreditCard size={18} className="shrink-0 text-champagne" /> Visa terminada en 2841 · Wallet aplicado automáticamente</p></div>
        <button onClick={confirm} className="btn-primary mt-8 w-full">Confirmar reserva</button><p className="mt-3 text-center text-[11px] leading-4 text-muted">Simulación de pago. No se realizará ningún cargo real.</p>
      </>}
    </div>
  </div>;
}
