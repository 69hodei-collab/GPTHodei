import { Plane } from "lucide-react";

export function RouteVisual({ from, to, compact = false }: { from: string; to: string; compact?: boolean }) {
  return <div className={`grid grid-cols-[auto_1fr_auto] items-center ${compact ? "gap-3" : "gap-5"}`}>
    <span className={`font-semibold tabular ${compact ? "text-lg" : "text-2xl"}`}>{from}</span>
    <div className="relative"><div className="route-line" /><Plane size={compact ? 13 : 16} strokeWidth={1.4} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-raised px-0.5 text-champagne" /></div>
    <span className={`font-semibold tabular ${compact ? "text-lg" : "text-2xl"}`}>{to}</span>
  </div>;
}
