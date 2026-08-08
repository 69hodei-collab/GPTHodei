import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://blajet.com"),
  title: { default: "BlaJet — Aviación privada, a tu alcance", template: "%s · BlaJet" },
  description: "Cotiza un jet privado, encuentra empty legs y comparte vuelos con operadores verificados.",
  openGraph: { title: "BlaJet", description: "Tres formas inteligentes de volar en privado.", url: "https://blajet.com", siteName: "BlaJet", locale: "es_ES", type: "website" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0B0F" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" data-theme="dark" className={`${fraunces.variable} ${manrope.variable}`}><body><DemoProvider><Header /><main>{children}</main><Footer /></DemoProvider></body></html>;
}
