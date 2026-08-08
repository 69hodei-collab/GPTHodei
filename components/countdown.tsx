"use client";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export function Countdown({ hours }: { hours: number }) {
  const [seconds, setSeconds] = useState(hours*3600+47*60+12);
  useEffect(()=>{ const timer=setInterval(()=>setSeconds(v=>Math.max(0,v-1)),1000); return()=>clearInterval(timer);},[]);
  const h=Math.floor(seconds/3600), m=Math.floor((seconds%3600)/60), s=seconds%60;
  const color=h<12?"text-alert border-alert":h<36?"text-champagne border-champagne":"text-muted hairline";
  return <span className={`inline-flex items-center gap-2 border px-2 py-1 text-[10px] font-semibold tabular ${color}`}><Clock3 size={12}/> {String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>;
}
