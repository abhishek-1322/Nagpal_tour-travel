import type { StaticImageData } from "next/image";
import amritsar from "@/public/images/amritsar.jpg";
import chandigarh from "@/public/images/chandigarh.jpg";
import delhi from "@/public/images/delhi.jpg";
import manali from "@/public/images/manali.jpg";
import haridwar from "@/public/images/haridwar.jpg";
import rishikesh from "@/public/images/rishikesh.jpg";
import sedan from "@/public/images/sedan.jpg";
import suv from "@/public/images/suv.jpg";
import innova from "@/public/images/innova.jpg";
import outstation from "@/public/images/outstation.jpg";
import airport from "@/public/images/airport.jpg";
import family from "@/public/images/family.jpg";
import local from "@/public/images/local.jpg";

export const site = {
  name: "Nagpal Tour & Travels",
  url: "https://nagpaltourandtravels.vercel.app",
  phoneDisplay: "+91 98789 67987",
  phoneE164: "+919878967987",
  whatsapp: "919878967987",
  address: "House No. 88, Apple Villa, Ludhiana, Punjab",
  instagram: "https://www.instagram.com/nagpal_tour_travels",
  facebook: "https://www.facebook.com/share/12FocN4MWau/?mibextid=wwXIfr",
  payOnline: "/pay",
  terms: "/terms",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("House No. 88, Apple Villa, Ludhiana, Punjab"),
};

export function waLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const tripTypes = [
  { id: "t-one", value: "One way", label: "One way" },
  { id: "t-round", value: "Round trip", label: "Round trip" },
  { id: "t-local", value: "Local", label: "Local" },
  { id: "t-air", value: "Airport transfer", label: "Airport" },
  { id: "t-tour", value: "Multi-day tour", label: "Tour" },
] as const;

export const vehicles = ["Sedan", "SUV", "Innova"] as const;
export type Vehicle = (typeof vehicles)[number];

export const services: { title: string; text: string; cta: string; trip: string; img: StaticImageData; icon: "mountain" | "plane" | "family" | "city" }[] = [
  { title: "Outstation taxi", text: "One way and round trips from Ludhiana to anywhere in India, on your schedule.", cta: "Request outstation taxi", trip: "One way", img: outstation, icon: "mountain" },
  { title: "Airport pick & drop", text: "24-hour transfers to Chandigarh, Amritsar and Delhi airports, timed to your flight.", cta: "Book airport transfer", trip: "Airport transfer", img: airport, icon: "plane" },
  { title: "Family & hill tours", text: "Multi-day holidays to Himachal, Uttarakhand and J&K with stops where you want them.", cta: "Plan a family tour", trip: "Multi-day tour", img: family, icon: "family" },
  { title: "Local rides", text: "Hourly and full-day cabs around Ludhiana for weddings, shopping and meetings.", cta: "Book a local ride", trip: "Local", img: local, icon: "city" },
];

export type Route = {
  slug: string;
  to: string;
  state: string;
  km: number;
  time: string;
  blurb: string;
  img: StaticImageData;
  tag: string;
  via: string;
  intro: string;
  highlights: string[];
  bestTime: string;
  car: string;
  stop: string;
  faq: { q: string; a: string }[];
};

// Approximate road distances from Ludhiana; fares are always confirmed on WhatsApp.
export const routes: Route[] = [
  {
    slug: "ludhiana-to-amritsar",
    to: "Amritsar",
    state: "Punjab",
    km: 140,
    time: "2.5 hr",
    blurb: "Golden Temple, Wagah Border and Jallianwala Bagh.",
    img: amritsar,
    tag: "Pilgrimage",
    via: "NH44 (GT Road) via Phagwara and Jalandhar",
    intro: "An easy same-day trip along the GT Road. Leave Ludhiana in the morning, pay your respects at the Golden Temple and be back the same night, or stay over for the Wagah Border ceremony.",
    highlights: ["Golden Temple (Sri Harmandir Sahib)", "Jallianwala Bagh", "Wagah–Attari Border retreat ceremony", "Partition Museum", "Gobindgarh Fort", "Sri Guru Ram Dass Jee International Airport"],
    bestTime: "October to March is the most comfortable. Summers are hot, so plan temple visits early morning or late evening.",
    car: "A Sedan suits up to 4 people. Take an Innova for families or groups who want room to relax on the way back.",
    stop: "Dhabas along the GT Road around Jalandhar make a good breakfast stop.",
    faq: [{ q: "Can I do Amritsar as a same-day round trip?", a: "Yes. Most travellers leave Ludhiana early, spend the day in Amritsar and return at night. Tell us if you want to include the evening Wagah Border ceremony so we can plan the timing." }],
  },
  {
    slug: "ludhiana-to-manali",
    to: "Manali",
    state: "Himachal Pradesh",
    km: 300,
    time: "7 hr",
    blurb: "Snow at Solang Valley and the road to Rohtang.",
    img: manali,
    tag: "Hills",
    via: "Kiratpur–Manali highway via Bilaspur, Mandi and Kullu",
    intro: "A scenic drive from the plains of Punjab into the Kullu valley, along the Beas river. Our drivers know the hill roads well and plan around weather and traffic.",
    highlights: ["Solang Valley", "Atal Tunnel and Sissu", "Hadimba Devi Temple", "Old Manali and Mall Road", "Rohtang Pass (permit and season dependent)", "Kullu river rafting"],
    bestTime: "March to June for pleasant weather, December to February for snow. Roads can be affected by heavy rain in July and August.",
    car: "An SUV or Innova is best for hill roads and luggage. A Sedan works for couples travelling light in good weather.",
    stop: "Mandi and the Pandoh dam viewpoint are popular breaks on the way.",
    faq: [{ q: "Can you take us to Rohtang Pass or Sissu?", a: "Yes, subject to the season, road status and the permits required for the area. We'll tell you what's open for your dates when we send the quote." }],
  },
  {
    slug: "ludhiana-to-delhi",
    to: "New Delhi",
    state: "Delhi NCR",
    km: 310,
    time: "5.5 hr",
    blurb: "IGI Airport, business trips and family visits.",
    img: delhi,
    tag: "Airport",
    via: "NH44 via Ambala, Karnal, Panipat and Sonipat",
    intro: "Our most-booked intercity route, for IGI Airport drops, business meetings and family visits. We time airport pickups to your flight, day or night.",
    highlights: ["IGI Airport Terminals 1, 2 and 3", "India Gate and Kartavya Path", "Red Fort and Chandni Chowk", "Qutub Minar", "Akshardham Temple", "Gurugram and Noida drops"],
    bestTime: "Any time of year. October to March is the most pleasant for sightseeing.",
    car: "A Sedan is ideal for airport runs with up to 4 people. Choose an Innova for families with lots of luggage.",
    stop: "The Murthal dhabas near Sonipat are a well-known halfway stop.",
    faq: [{ q: "Do you do night pickups and drops at Delhi airport?", a: "Yes, 24/7. Share your flight number and we'll plan pickup time around it." }],
  },
  {
    slug: "ludhiana-to-chandigarh",
    to: "Chandigarh",
    state: "Chandigarh",
    km: 100,
    time: "2 hr",
    blurb: "Sukhna Lake, Rock Garden and the airport.",
    img: chandigarh,
    tag: "Weekend",
    via: "Samrala and Kharar",
    intro: "A short, frequent run for office trips, hospital visits, airport transfers and weekends in the City Beautiful.",
    highlights: ["Sukhna Lake", "Rock Garden", "Rose Garden", "Chandigarh International Airport (Mohali)", "PGIMER hospital", "Elante Mall"],
    bestTime: "All year round. October to March is the most pleasant.",
    car: "A Sedan is the most economical choice. Take an Innova for larger families.",
    stop: "Most travellers go straight through. The trip is about two hours.",
    faq: [{ q: "Can you wait in Chandigarh and bring us back the same day?", a: "Yes. Book a round trip and the car waits for you. Tell us your expected return time when you ask for the quote." }],
  },
  {
    slug: "ludhiana-to-haridwar",
    to: "Haridwar",
    state: "Uttarakhand",
    km: 340,
    time: "6.5 hr",
    blurb: "Evening Ganga aarti at Har Ki Pauri.",
    img: haridwar,
    tag: "Pilgrimage",
    via: "Ambala, Yamunanagar, Saharanpur and Roorkee",
    intro: "A popular family pilgrimage. Reach in time for the evening Ganga aarti at Har Ki Pauri, and combine it with Rishikesh if you have an extra day.",
    highlights: ["Ganga aarti at Har Ki Pauri", "Mansa Devi Temple (ropeway)", "Chandi Devi Temple", "Bharat Mata Mandir", "Rishikesh, 25 km away"],
    bestTime: "October to April. Expect traffic diversions during the Kanwar Yatra in July.",
    car: "An Innova is the favourite for family pilgrimages. A Sedan suits up to 4 people.",
    stop: "Yamunanagar or Saharanpur make a good halfway break.",
    faq: [{ q: "Can we cover Haridwar and Rishikesh in one trip?", a: "Yes. Most families do both over two days. Ask for a round trip with a night halt and we'll plan the stops." }],
  },
  {
    slug: "ludhiana-to-rishikesh",
    to: "Rishikesh",
    state: "Uttarakhand",
    km: 360,
    time: "7 hr",
    blurb: "Rafting, yoga and the Char Dham gateway.",
    img: rishikesh,
    tag: "Adventure",
    via: "Haridwar",
    intro: "The yoga capital of the world and the start of the Char Dham route. Great for rafting weekends, retreats and spiritual trips.",
    highlights: ["Laxman Jhula and Ram Jhula", "Triveni Ghat evening aarti", "White-water rafting on the Ganga", "Beatles Ashram", "Neelkanth Mahadev Temple", "Gateway to the Char Dham Yatra"],
    bestTime: "September to June. Rafting usually pauses during the July–August monsoon.",
    car: "An SUV or Innova suits groups with luggage or onward hill travel. A Sedan works for a short Rishikesh stay.",
    stop: "Haridwar, 25 km before Rishikesh, is a natural stop.",
    faq: [{ q: "Can you continue to the Char Dham from Rishikesh?", a: "Yes. Tell us your plan and dates and we'll quote a multi-day tour with a hill-ready vehicle." }],
  },
];

export const commonFaq = (r: Route) => [
  { q: `How far is ${r.to} from Ludhiana?`, a: `About ${r.km} km by road, usually ${r.time} of driving via ${r.via}. Traffic, weather and stops can change this.` },
  { q: "Can I book a one-way taxi?", a: "Yes. We offer one way and round trips. One-way fares are confirmed in your quote." },
  { q: "Are tolls and parking included?", a: "Tolls, parking and state taxes are usually charged extra. We list exactly what is included before you book, so there are no surprises." },
];

export const fleet: { name: Vehicle; model: string; tag: string; text: string; seats: string; bags: string; img: StaticImageData; cta: string }[] = [
  { name: "Sedan", model: "Swift Dzire or similar", tag: "Best value", text: "Smooth and economical for city transfers and quick intercity runs.", seats: "4", bags: "2", img: sedan, cta: "Quote a Sedan" },
  { name: "SUV", model: "Mahindra Scorpio or similar", tag: "Hill ready", text: "High ground clearance and space for long drives into the mountains.", seats: "6–7", bags: "3", img: suv, cta: "Quote an SUV" },
  { name: "Innova", model: "Toyota Innova Crysta", tag: "Most comfortable", text: "Captain-style comfort for families and pilgrim groups on long trips.", seats: "7", bags: "4", img: innova, cta: "Quote an Innova" },
];

export const reasons: { title: string; text: string; icon: "clock" | "user" | "calendar" | "rupee" | "globe" | "shield" }[] = [
  { title: "24/7 booking", text: "Call or WhatsApp any time, day or night.", icon: "clock" },
  { title: "Professional drivers", text: "Experienced and courteous, at home on highways and hill roads.", icon: "user" },
  { title: "Always on time", text: "We reach your pickup address before the agreed time.", icon: "calendar" },
  { title: "Clear pricing", text: "Fare, tolls and driver allowance agreed before you travel.", icon: "rupee" },
  { title: "PAN India coverage", text: "Punjab, Himachal, Uttarakhand, Delhi NCR and beyond.", icon: "globe" },
  { title: "Safe & clean cars", text: "Well-kept, air-conditioned cars with roadside assistance.", icon: "shield" },
];
