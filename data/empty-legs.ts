import { aircraftImage, cabinImage } from "./aviation";

export type EmptyLeg = {
  id: string; from: string; to: string; date: string; time: string; duration: string; aircraft: string; operatorId: string;
  seats: number; seatPrice: number; fullPrice: number; charterPrice: number; seatEligible: boolean; bidEnabled: boolean; departureHours: number; image: string;
};

export const emptyLegs: EmptyLeg[] = [
  { id: "mad-ibz-0814", from: "MAD", to: "IBZ", date: "14 AGO", time: "18:40", duration: "1 h 05 min", aircraft: "Phenom 300E", operatorId: "senda", seats: 6, seatPrice: 890, fullPrice: 5200, charterPrice: 8900, seatEligible: true, bidEnabled: true, departureHours: 29, image: aircraftImage },
  { id: "gva-nce-0812", from: "GVA", to: "NCE", date: "12 AGO", time: "09:20", duration: "55 min", aircraft: "Praetor 600", operatorId: "lacbleu", seats: 8, seatPrice: 740, fullPrice: 6800, charterPrice: 12400, seatEligible: true, bidEnabled: false, departureHours: 8, image: cabinImage },
  { id: "bcn-pmi-0816", from: "BCN", to: "PMI", date: "16 AGO", time: "16:10", duration: "50 min", aircraft: "Citation CJ4", operatorId: "senda", seats: 7, seatPrice: 620, fullPrice: 4300, charterPrice: 7600, seatEligible: true, bidEnabled: true, departureHours: 53, image: aircraftImage },
  { id: "nce-lbg-0818", from: "NCE", to: "LBG", date: "18 AGO", time: "11:30", duration: "1 h 25 min", aircraft: "Falcon 2000LXS", operatorId: "lacbleu", seats: 10, seatPrice: 1180, fullPrice: 9800, charterPrice: 17700, seatEligible: false, bidEnabled: true, departureHours: 77, image: cabinImage },
];
