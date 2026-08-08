import type { Metadata } from "next"; import { EmptyLegsList } from "@/components/empty-legs-list";
export const metadata: Metadata={title:"Empty legs",description:"Vuelos privados de reposicionamiento con ahorro visible y operadores verificados."};
export default function EmptyLegsPage(){return <EmptyLegsList/>}
