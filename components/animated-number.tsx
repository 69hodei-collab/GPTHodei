"use client";

import { useEffect, useState } from "react";

export function AnimatedNumber({ value, duration = 800, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame = 0; const start = performance.now();
    const tick = (now: number) => { const p = Math.min(1, (now - start) / duration); setShown(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span className="tabular">{shown.toLocaleString("es-ES")}{suffix}</span>;
}
