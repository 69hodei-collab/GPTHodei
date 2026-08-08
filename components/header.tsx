"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDemo } from "./demo-provider";
import { Logo } from "./logo";

const nav = [["Cotizar", "/cotizar"], ["Empty legs", "/empty-legs"], ["Pools", "/pools"], ["Cómo funciona", "/como-funciona"]];

export function Header() {
  const { demo, toggleDemo } = useDemo();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  return <header className="sticky top-0 z-50 border-b hairline bg-canvas/90 backdrop-blur-xl">
    <div className="container-blajet flex h-16 items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
        {nav.map(([label, href]) => <Link key={href} href={href} className="text-xs font-semibold tracking-wide text-muted hover:text-champagne">{label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={toggleDemo} aria-pressed={demo} className={`hidden min-h-9 items-center gap-2 border px-3 text-[10px] font-bold uppercase tracking-[.14em] sm:flex ${demo ? "border-champagne text-champagne" : "hairline text-muted"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${demo ? "bg-success" : "bg-muted"}`} /> Demo {demo ? "activo" : "off"}
        </button>
        <button onClick={() => setDark(!dark)} className="grid h-9 w-9 place-items-center border hairline text-muted hover:border-champagne hover:text-champagne" aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
        <Link href={demo ? "/dashboard" : "/dashboard?onboarding=1"} className="hidden min-h-9 items-center border hairline px-3 text-xs font-semibold hover:border-champagne sm:flex">{demo ? "Carlos M." : "Acceder"}</Link>
        <button onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center border hairline lg:hidden" aria-label="Abrir menú">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    {open && <nav className="container-blajet grid gap-1 border-t hairline py-3 lg:hidden" aria-label="Navegación móvil">
      {nav.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} className="border-b hairline px-1 py-3 text-sm">{label}</Link>)}
      <Link href="/dashboard" className="px-1 py-3 text-sm text-champagne">Panel de Carlos M.</Link>
    </nav>}
  </header>;
}
