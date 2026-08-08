"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoUser } from "@/data/user";

type DemoState = {
  demo: boolean; toggleDemo: () => void; wallet: number; miles: number; alerts: string[]; reservations: string[];
  addAlert: (route: string) => void; reserve: (label: string, price: number) => void;
};

const Context = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [demo, setDemo] = useState(true);
  const [wallet, setWallet] = useState(demoUser.wallet);
  const [miles, setMiles] = useState(demoUser.miles);
  const [alerts, setAlerts] = useState<string[]>(demoUser.alerts);
  const [reservations, setReservations] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = window.localStorage.getItem("blajet-demo");
    if (params.get("demo") === "0") setDemo(false);
    else if (params.get("demo") === "1" || stored === null) setDemo(true);
    else setDemo(stored === "true");
  }, []);

  const value = useMemo(() => ({
    demo, wallet, miles, alerts, reservations,
    toggleDemo: () => setDemo((current) => { const next = !current; window.localStorage.setItem("blajet-demo", String(next)); return next; }),
    addAlert: (route: string) => setAlerts((current) => current.includes(route) ? current : [...current, route]),
    reserve: (label: string, price: number) => { setReservations((current) => [...current, label]); setWallet((current) => Math.max(0, current - Math.min(current, price))); setMiles((current) => current + Math.round(price)); },
  }), [demo, wallet, miles, alerts, reservations]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("useDemo debe usarse dentro de DemoProvider");
  return value;
}
