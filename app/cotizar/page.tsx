import type { Metadata } from "next";
import { QuoteFlow } from "@/components/quote-flow";
export const metadata: Metadata = { title: "Cotizar un jet", description: "Recibe tres propuestas comparables de operadores verificados." };
export default function QuotePage(){ return <QuoteFlow/>; }
