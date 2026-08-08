export const airports = [
  ["MAD", "Madrid · Adolfo Suárez"], ["BCN", "Barcelona · El Prat"], ["IBZ", "Ibiza"], ["PMI", "Palma de Mallorca"],
  ["LBG", "París · Le Bourget"], ["GVA", "Ginebra"], ["FAB", "Londres · Farnborough"], ["NCE", "Niza · Côte d’Azur"],
  ["LIN", "Milán · Linate"], ["CUN", "Cancún"], ["MIA", "Miami"], ["DWC", "Dubái · Al Maktoum"],
] as const;

export const jetCategories = [
  { id: "turboprop", name: "Turbohélice", capacity: "6–8", range: "2.400 km", speed: "570 km/h", luggage: "6 maletas", price: 5400 },
  { id: "light", name: "Light jet", capacity: "6–8", range: "3.600 km", speed: "780 km/h", luggage: "7 maletas", price: 7900 },
  { id: "midsize", name: "Midsize", capacity: "8–9", range: "5.400 km", speed: "850 km/h", luggage: "10 maletas", price: 11900 },
  { id: "super", name: "Super midsize", capacity: "9–11", range: "7.200 km", speed: "890 km/h", luggage: "12 maletas", price: 15400 },
  { id: "heavy", name: "Heavy jet", capacity: "12–14", range: "10.500 km", speed: "910 km/h", luggage: "18 maletas", price: 22500 },
  { id: "ultra", name: "Ultra long range", capacity: "14–16", range: "13.500 km", speed: "940 km/h", luggage: "22 maletas", price: 31800 },
];

export const aircraftImage = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=85";
// Recurso deliberadamente estable para que la demo no dependa de una URL de
// fotografía interior que pueda expirar. Puede sustituirse por un activo local.
export const cabinImage = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1400&q=85";
export const heroImage = "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=2000&q=90";
