import { notFound } from "next/navigation"; import { emptyLegs } from "@/data/empty-legs"; import { operators } from "@/data/operators"; import { EmptyLegDetail } from "@/components/empty-leg-detail";
export function generateStaticParams(){return emptyLegs.map(l=>({id:l.id}))}
export default async function EmptyLegPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const leg=emptyLegs.find(l=>l.id===id);if(!leg)notFound();const op=operators.find(o=>o.id===leg.operatorId)!;return <EmptyLegDetail leg={leg} operator={op}/>}
