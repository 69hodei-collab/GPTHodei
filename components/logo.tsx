import Link from "next/link";

export function Logo({ monogram = false }: { monogram?: boolean }) {
  return <Link href="/" aria-label="BlaJet — Inicio" className="group inline-flex items-center gap-3">
    <span className="grid h-8 w-8 place-items-center border border-champagne font-serif text-lg text-champagne transition-colors group-hover:bg-champagne group-hover:text-[#0A0B0F]">B</span>
    {!monogram && <span className="text-sm font-semibold tracking-[.24em]">BLAJET</span>}
  </Link>;
}
