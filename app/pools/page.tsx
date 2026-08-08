import type { Metadata } from "next"; import { PoolsList } from "@/components/pools-list";
export const metadata:Metadata={title:"Pools de vuelos",description:"Comparte los gastos de un jet privado con viajeros verificados."}; export default function PoolsPage(){return <PoolsList/>}
