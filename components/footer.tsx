import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return <footer className="mt-30 border-t hairline bg-surface">
    <div className="container-blajet grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
      <div><Logo /><p className="mt-5 max-w-sm text-sm leading-6 text-muted">Acceso inteligente a la aviación privada. Operadores verificados, precios claros y tres formas de volar.</p></div>
      <div><p className="eyebrow mb-4">Explora</p><div className="grid gap-3 text-sm"><Link href="/cotizar">Charter a medida</Link><Link href="/empty-legs">Empty legs</Link><Link href="/pools">Pooling</Link><Link href="/black">BlaJet Black</Link></div></div>
      <div><p className="eyebrow mb-4">BlaJet</p><div className="grid gap-3 text-sm"><Link href="/como-funciona">Cómo funciona</Link><Link href="/faq">Preguntas frecuentes</Link><Link href="/operadores">Para operadores</Link><Link href="/legal">Legal y privacidad</Link></div></div>
    </div>
    <div className="container-blajet flex flex-col gap-2 border-t hairline py-6 text-xs text-muted sm:flex-row sm:justify-between"><span>© 2026 BlaJet. Demo de producto.</span><span>Operaciones sujetas a disponibilidad y normativa aplicable.</span></div>
  </footer>;
}
