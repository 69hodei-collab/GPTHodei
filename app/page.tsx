import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, Globe2, Plane, ShieldCheck, Users } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { AnimatedNumber } from "@/components/animated-number";
import { heroImage, aircraftImage, cabinImage } from "@/data/aviation";
import { emptyLegs } from "@/data/empty-legs";
import { RouteVisual } from "@/components/route-visual";
import { RouteMap } from "@/components/route-map";

export default function Home() {
  return <>
    <section className="relative min-h-[760px] overflow-hidden border-b hairline lg:min-h-[720px]">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]"><Image src={heroImage} alt="Jet privado en plataforma al atardecer" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" /><div className="absolute inset-0 bg-[#0A0B0F]/55 lg:bg-[#0A0B0F]/20" /></div>
      <div className="container-blajet relative flex min-h-[760px] flex-col justify-center pb-48 pt-20 lg:min-h-[720px] lg:pb-32">
        <div className="max-w-3xl"><p className="eyebrow animate-rise">Aviación privada, reimaginada</p><h1 className="display mt-5 max-w-2xl text-[3.3rem] text-[#F2EFE8] sm:text-7xl lg:text-[5.5rem]">El jet privado, por fin a tu alcance.</h1><p className="mt-7 max-w-lg text-base leading-7 text-[#D5D1C8] sm:text-lg">Cotiza a medida, aprovecha un empty leg o comparte un vuelo. Tres maneras de despegar, una sola experiencia impecable.</p></div>
        <div className="absolute inset-x-4 bottom-8 lg:right-auto lg:w-[min(1180px,calc(100vw-64px))]"><HomeSearch /></div>
      </div>
    </section>

    <section className="container-blajet py-24 lg:py-30">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Tres formas de volar</p><h2 className="display mt-5 text-5xl sm:text-6xl">La libertad de elegir cómo viajas.</h2><p className="mt-6 max-w-md text-sm leading-7 text-muted">Desde un avión enteramente a tu medida hasta una plaza compartida. Sin opacidad, sin llamadas interminables.</p></div>
        <div className="grid border-t hairline">
          {[
            ["01", "Charter a medida", "Tú eliges la ruta, el horario y el avión. Tres operadores compiten por ofrecerte la mejor propuesta.", "/cotizar", "Desde 5.400 €"],
            ["02", "Empty legs", "Aprovecha el regreso vacío de un jet verificado con ahorros de hasta el 60%.", "/empty-legs", "Desde 620 €/plaza"],
            ["03", "Pooling", "Comparte gastos con viajeros afines. Cuantos más se unen, menos paga cada uno.", "/pools", "Desde 950 €/plaza"],
          ].map(([n,title,text,href,price]) => <Link href={href} key={n} className="group grid gap-4 border-b hairline py-7 sm:grid-cols-[48px_1fr_auto] sm:items-center"><span className="font-serif text-xl text-champagne">{n}</span><div><h3 className="font-serif text-2xl group-hover:text-champagne">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{text}</p></div><div className="flex items-center justify-between gap-5 sm:block sm:text-right"><p className="tabular text-xs text-muted">{price}</p><ArrowRight className="mt-2 ml-auto text-champagne transition-transform group-hover:translate-x-1" size={19} /></div></Link>)}
        </div>
      </div>
    </section>

    <section className="bg-surface py-24">
      <div className="container-blajet"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Oportunidades en movimiento</p><h2 className="display mt-4 text-5xl">Empty legs ahora.</h2></div><Link href="/empty-legs" className="btn-secondary">Ver todos <ArrowRight size={15} /></Link></div>
        <div className="mt-10 grid gap-px overflow-hidden border hairline bg-line lg:grid-cols-3">{emptyLegs.slice(0,3).map((leg, index) => <Link href={`/empty-legs/${leg.id}`} key={leg.id} className="group bg-canvas">
          <div className="relative aspect-[16/9] overflow-hidden"><Image src={leg.image} alt={leg.aircraft} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><span className="absolute left-4 top-4 bg-[#0A0B0F]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F2EFE8]">Sale en {leg.departureHours} h</span></div>
          <div className="p-6"><RouteVisual from={leg.from} to={leg.to} compact /><p className="mt-5 text-xs text-muted">{leg.date} · {leg.time} · {leg.aircraft}</p><div className="mt-6 flex items-end justify-between border-t hairline pt-5"><div><span className="text-3xl font-semibold tabular">{leg.seatPrice.toLocaleString("es-ES")}</span> <small className="text-muted">€/plaza</small></div><span className="text-xs text-success">−{Math.round((1-leg.fullPrice/leg.charterPrice)*100)}%</span></div></div>
        </Link>)}</div>
      </div>
    </section>

    <section className="container-blajet grid gap-12 py-24 lg:grid-cols-2 lg:items-center lg:py-30">
      <div className="relative min-h-[520px]"><Image src={cabinImage} alt="Interior refinado de un jet privado" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" /><div className="absolute bottom-0 right-0 w-[78%] bg-raised p-6 shadow-lift sm:w-[58%]"><p className="eyebrow">Pool MAD → IBZ</p><div className="mt-4 flex items-end justify-between"><span className="text-3xl font-semibold tabular">1.520 <small className="text-xs font-normal text-muted">€/plaza</small></span><span className="text-xs text-success">4/8 unidos</span></div><div className="mt-4 h-1 bg-line"><div className="h-full w-1/2 bg-champagne" /></div><p className="mt-3 text-xs text-muted">Se confirma al llegar a 6 viajeros.</p></div></div>
      <div className="lg:pl-10"><p className="eyebrow">El efecto BlaJet</p><h2 className="display mt-5 text-5xl sm:text-6xl">Cada viajero que se une hace el vuelo más accesible.</h2><p className="mt-6 max-w-lg text-base leading-7 text-muted">Los pools convierten una ruta compartida en una decisión inteligente. Ves quién viaja, qué reglas aplican y cómo baja tu precio antes de confirmar.</p><div className="mt-8 grid gap-4 text-sm sm:grid-cols-2"><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-success" /> Perfiles verificados</p><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-success" /> Precio transparente</p><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-success" /> Operadores con AOC</p><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-success" /> Concierge humano</p></div><Link href="/pools" className="btn-primary mt-9">Explorar pools <ArrowRight size={15} /></Link></div>
    </section>

    <section className="bg-surface py-24"><div className="container-blajet grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-center"><div><p className="eyebrow">Radar BlaJet</p><h2 className="display mt-5 text-5xl">Europa, en movimiento.</h2><p className="mt-5 text-sm leading-7 text-muted">Rutas activas y reposicionamientos disponibles en la red. Pasa sobre cada ciudad para seguir el movimiento del marketplace.</p><Link href="/ahorro" className="btn-secondary mt-7">Calcular mi ahorro <ArrowRight size={14}/></Link></div><RouteMap/></div></section>

    <section className="border-y hairline bg-raised"><div className="container-blajet grid grid-cols-2 divide-x divide-y hairline lg:grid-cols-4 lg:divide-y-0">{[[42,"Operadores verificados",ShieldCheck],[118,"Aviones disponibles",Plane],[380,"Rutas cubiertas",Globe2],[96,"Satisfacción",Gauge]].map(([value,label,Icon]) => { const I=Icon as typeof Plane; return <div key={String(label)} className="p-6 sm:p-9"><I size={19} strokeWidth={1.5} className="text-champagne"/><p className="mt-5 text-4xl font-semibold tabular"><AnimatedNumber value={value as number} />{label === "Satisfacción" && "%"}</p><p className="mt-2 text-xs text-muted">{label as string}</p></div>})}</div></section>

    <section className="container-blajet py-24 text-center"><Users className="mx-auto text-champagne" strokeWidth={1.3} /><p className="eyebrow mt-5">Listo para despegar</p><h2 className="display mx-auto mt-5 max-w-3xl text-5xl sm:text-6xl">Tu próximo vuelo privado empieza con una ruta.</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/cotizar" className="btn-primary">Solicitar cotización</Link><Link href="/como-funciona" className="btn-secondary">Descubrir BlaJet</Link></div></section>
  </>;
}
