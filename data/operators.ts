export type Operator = {
  id: string; name: string; base: string; region: string; aoc: string; rating: number;
  fleetSize: number; fleet: string[]; policy: string; emptyLegPolicy: string;
};

export const operators: Operator[] = [
  {
    id: "aerocruz", name: "AeroCruz Charter", base: "Ciudad de México", region: "México y conexiones internacionales", aoc: "MX-AOC-ACX-0417", rating: 4.9,
    fleetSize: 13, fleet: ["XA-ACR · Citation Latitude", "XA-JET · Challenger 350", "XA-CRZ · Gulfstream G500"],
    policy: "Cancelación del pasajero hasta 2 h antes. Si cancela el operador, el importe pasa íntegro al wallet BlaJet.",
    emptyLegPolicy: "Publica con 72 h de antelación y actualiza disponibilidad cada 15 min. Asientos con pasaporte y selfie. No opera cabotaje dentro de EE. UU.",
  },
  {
    id: "lacbleu", name: "Lac Bleu Aviation", base: "Ginebra · Niza", region: "Europa y Mediterráneo", aoc: "CH-AOC-LBA-228", rating: 4.8,
    fleetSize: 9, fleet: ["HB-LBA · Praetor 600", "HB-NCE · Falcon 2000LXS", "HB-SKY · Challenger 650"],
    policy: "Reprogramación sin coste hasta 24 h antes. Cancelación sujeta a posicionamiento confirmado.",
    emptyLegPolicy: "Especialista en Baleares y Costa Azul de mayo a septiembre. Confirmación operativa 6 h antes.",
  },
  {
    id: "senda", name: "Senda Air", base: "Madrid · Cascais", region: "Península Ibérica", aoc: "ES-AOC-SDA-119", rating: 4.9,
    fleetSize: 7, fleet: ["EC-SDA · Phenom 300E", "EC-LUZ · Citation CJ4", "CS-SND · HondaJet Elite II"],
    policy: "Cambios flexibles hasta 12 h antes. Crédito BlaJet válido durante 12 meses cuando el operador cancela.",
    emptyLegPolicy: "Light jets para rutas domésticas de España y Portugal. Mascotas admitidas con aviso previo.",
  },
];
