export type Pool = {
  id: string; kind: "charter" | "owner"; from: string; to: string; date: string; aircraft: string; host: string; verified: boolean;
  rating: number; joined: number; capacity: number; confirmAt: number; total: number; rules: string[]; members: string[];
};

export const pools: Pool[] = [
  { id: "pool-mad-ibz", kind: "charter", from: "MAD", to: "IBZ", date: "23 AGO · 17:30", aircraft: "Phenom 300E", host: "Lucía R.", verified: true, rating: 4.9, joined: 4, capacity: 8, confirmAt: 6, total: 7600, rules: ["Equipaje de cabina + 1 maleta", "Mascotas con acuerdo del grupo", "Confirmación al alcanzar 6 plazas"], members: ["LR", "CM", "AP", "MS"] },
  { id: "pool-bcn-nce", kind: "owner", from: "BCN", to: "NCE", date: "29 AGO · 10:15", aircraft: "Citation Latitude", host: "Álvaro P.", verified: true, rating: 4.8, joined: 3, capacity: 9, confirmAt: 3, total: 9900, rules: ["Vuelo ya confirmado", "Solo equipaje flexible", "Compartición de gastos operativos"], members: ["AP", "IR", "JM"] },
  { id: "pool-gva-pmi", kind: "charter", from: "GVA", to: "PMI", date: "04 SEP · 13:00", aircraft: "Challenger 350", host: "Claire D.", verified: true, rating: 5.0, joined: 5, capacity: 10, confirmAt: 7, total: 14800, rules: ["Catering mediterráneo incluido", "1 maleta por persona", "Cancelación flexible hasta 72 h"], members: ["CD", "SV", "ML", "AR", "PB"] },
];
