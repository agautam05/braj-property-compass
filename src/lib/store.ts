import { useSyncExternalStore } from "react";

export type Project = {
  id: string;
  slug: string;
  name: string;
  location: string;
  city: "Mathura" | "Vrindavan";
  type: string;
  summary: string;
  /** Indicative price in lakh; null = on enquiry */
  priceMinLakh: number | null;
  priceMaxLakh: number | null;
  sizeMinSqYd: number | null;
  sizeMaxSqYd: number | null;
  amenities: string;
  approvals: string;
  images: string[];
  featured: boolean;
  order: number;
};

export type InventoryItem = {
  id: string;
  projectId: string;
  unit: string;
  sizeSqYd: number;
  facing: string;
  status: "Available" | "On hold" | "Booked";
  indicativePriceLakh: number | null;
  sample: boolean;
};

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Visit scheduled",
  "Negotiation",
  "Closed – won",
  "Closed – lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectId: string;
  budget: string;
  message: string;
  source: string;
  status: LeadStatus;
  notes: { at: string; text: string }[];
  createdAt: string;
  demo: boolean;
};

export const VISIT_STATUSES = ["Requested", "Confirmed", "Completed", "Cancelled"] as const;
export type Visit = {
  id: string;
  name: string;
  phone: string;
  projectId: string;
  date: string;
  time: string;
  status: (typeof VISIT_STATUSES)[number];
  notes: string;
  createdAt: string;
  demo: boolean;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Active" | "Inactive";
  verificationNote: string;
  terms: string;
};

export const GALLERY_CATEGORIES = ["Township", "Plots", "Homes", "Interiors", "Landscape"] as const;
export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: (typeof GALLERY_CATEGORIES)[number];
  illustrative: boolean;
};

export type Faq = { id: string; q: string; a: string };

export type Content = {
  heroHeadline: string;
  heroSubtitle: string;
  aboutIntro: string;
  aboutBody: string;
  ctaTitle: string;
  ctaText: string;
  faqs: Faq[];
};

export type Settings = {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress: string;
  priceRange: string;
  sizeRange: string;
  showRanges: boolean;
};

export type DB = {
  projects: Project[];
  inventory: InventoryItem[];
  leads: Lead[];
  visits: Visit[];
  offers: Offer[];
  gallery: GalleryItem[];
  content: Content;
  settings: Settings;
  compare: string[];
};

const ON_ENQUIRY = "Details available on enquiry";

function project(
  order: number,
  slug: string,
  name: string,
  location: string,
  city: "Mathura" | "Vrindavan",
  images: string[],
): Project {
  return {
    id: `p-${slug}`,
    slug,
    name,
    location,
    city,
    type: "Residential plots",
    summary: `${name} is listed by BrajProperty.in at ${location}. Current plot sizes, pricing, approvals and availability are shared on enquiry after verification with the project team.`,
    priceMinLakh: null,
    priceMaxLakh: null,
    sizeMinSqYd: null,
    sizeMaxSqYd: null,
    amenities: ON_ENQUIRY,
    approvals: "Subject to document verification",
    images,
    featured: true,
    order,
  };
}

export function seed(): DB {
  const projects: Project[] = [
    project(1, "banke-bihari-orchid", "Banke Bihari Orchid", "Behind Aggarwal Restaurant, Mathura", "Mathura", ["villa", "park", "interior"]),
    project(2, "banke-bihari-dham", "Banke Bihari Dham", "Rukmani Vihar, Vrindavan", "Vrindavan", ["street", "hero", "park"]),
    project(3, "braj-anand-vatika", "Braj Anand Vatika", "Satoha–Naugaon Road, Mathura", "Mathura", ["plots", "park", "street"]),
    project(4, "banke-bihari-kunj", "Banke Bihari Kunj", "Ramtal, Jait Road, Vrindavan", "Vrindavan", ["park", "villa", "plots"]),
    project(5, "braj-lotus-greens", "Braj Lotus Greens", "Mathura–Govardhan Road", "Mathura", ["plots", "hero", "interior"]),
    project(6, "banke-bihari-greens", "Banke Bihari Greens", "Opposite Char Dham Temple, Vrindavan", "Vrindavan", ["hero", "street", "villa"]),
  ];

  const facings = ["East", "North", "West", "North-East"];
  const statuses: InventoryItem["status"][] = ["Available", "On hold", "Available", "Booked"];
  const inventory: InventoryItem[] = projects.flatMap((p, pi) =>
    [0, 1].map((i) => ({
      id: `inv-${pi}-${i}`,
      projectId: p.id,
      unit: `SAMPLE-${String.fromCharCode(65 + pi)}${i + 1}`,
      sizeSqYd: [100, 150, 200, 250][(pi + i) % 4],
      facing: facings[(pi + i) % 4],
      status: statuses[(pi + i) % 4],
      indicativePriceLakh: null,
      sample: true,
    })),
  );

  const leadSeed: [string, number, LeadStatus, string, number][] = [
    ["Demo Lead A", 0, "New", "Website enquiry", 1],
    ["Demo Lead B", 1, "Contacted", "WhatsApp", 2],
    ["Demo Lead C", 2, "Qualified", "Phone call", 3],
    ["Demo Lead D", 3, "Visit scheduled", "Site visit form", 4],
    ["Demo Lead E", 4, "Negotiation", "Website enquiry", 6],
    ["Demo Lead F", 5, "New", "Website enquiry", 7],
    ["Demo Lead G", 0, "Closed – lost", "Walk-in", 9],
    ["Demo Lead H", 2, "Closed – won", "Referral", 12],
  ];
  const base = Date.UTC(2026, 10, 5, 10, 0, 0);
  const leads: Lead[] = leadSeed.map(([name, pi, status, source, daysAgo], i) => ({
    id: `lead-${i}`,
    name: `${name} (fictional)`,
    phone: `+91 90000 0000${i}`,
    email: "",
    projectId: projects[pi].id,
    budget: ["₹25–50 lakh", "₹50 lakh–₹1 crore", "Up to ₹25 lakh", "₹1–2 crore"][i % 4],
    message: "Fictional demo enquiry for dashboard preview.",
    source,
    status,
    notes: [],
    createdAt: new Date(base - daysAgo * 86400000).toISOString(),
    demo: true,
  }));

  const visits: Visit[] = [
    ["Demo Visitor A", 3, "2026-11-08", "11:00", "Confirmed"],
    ["Demo Visitor B", 1, "2026-11-09", "16:00", "Requested"],
    ["Demo Visitor C", 2, "2026-11-01", "10:30", "Completed"],
  ].map(([name, pi, date, time, status], i) => ({
    id: `visit-${i}`,
    name: `${name} (fictional)`,
    phone: `+91 90000 1000${i}`,
    projectId: projects[pi as number].id,
    date: date as string,
    time: time as string,
    status: status as Visit["status"],
    notes: "Demo record",
    createdAt: new Date(base - i * 86400000).toISOString(),
    demo: true,
  }));

  const offers: Offer[] = [
    {
      id: "offer-gold",
      title: "Gold coin offer (5–10 g) — as seen on poster",
      description: "Promotional gold offer referenced on printed poster.",
      status: "Draft",
      verificationNote: "Pending client verification. Do not publish until terms, eligibility and validity are confirmed in writing.",
      terms: "Terms not yet supplied.",
    },
  ];

  const gallery: GalleryItem[] = [
    { id: "g1", src: "hero", title: "Tree-lined township avenue", category: "Township", illustrative: true },
    { id: "g2", src: "plots", title: "Planned plotted layout", category: "Plots", illustrative: true },
    { id: "g3", src: "villa", title: "Contemporary villa exterior", category: "Homes", illustrative: true },
    { id: "g4", src: "street", title: "Residential street at dusk", category: "Homes", illustrative: true },
    { id: "g5", src: "interior", title: "Living room interior", category: "Interiors", illustrative: true },
    { id: "g6", src: "park", title: "Landscaped community green", category: "Landscape", illustrative: true },
  ];

  const content: Content = {
    heroHeadline: "अपने सपनों की प्रॉपर्टी, अब ब्रज की पावन भूमि पर।",
    heroSubtitle:
      "Residential plots and projects across Mathura and Vrindavan — explore six projects and get verified details on enquiry.",
    aboutIntro: "Property in Vrindavan — serving Mathura and Vrindavan.",
    aboutBody:
      "BrajProperty.in helps buyers explore residential projects across Mathura and Vrindavan. We share current pricing, plot availability and project documents on enquiry, and encourage every buyer to independently verify approvals, title and ownership before booking.",
    ctaTitle: "Planning to buy in Braj?",
    ctaText: "Share your requirement and our team will call you back with current details.",
    faqs: [
      { id: "f1", q: "Which areas do you cover?", a: "We list projects in Mathura and Vrindavan, including locations on Jait Road, Rukmani Vihar, Satoha–Naugaon Road and Mathura–Govardhan Road." },
      { id: "f2", q: "What is the price range?", a: "Indicatively, listings across our projects range from about ₹15 lakh to ₹2 crore. Prices vary by project, plot and date — please confirm current price and availability with us." },
      { id: "f3", q: "What plot sizes are available?", a: "Indicatively, plots range from 60 to 500 sq yd across projects. Exact sizes for each project are shared on enquiry." },
      { id: "f4", q: "Are the projects approved?", a: "Approval, title and ownership status must be verified from original documents. We will share available documents on request; please verify independently before booking." },
      { id: "f5", q: "Can I visit the site?", a: "Yes. Use the site visit form or call us to schedule a visit at a convenient time." },
    ],
  };

  const settings: Settings = {
    brandName: "BrajProperty.in",
    tagline: "Property in Vrindavan",
    phone: "+91 96908 77877",
    whatsapp: "+91 93067 22034",
    email: "",
    officeAddress: "",
    priceRange: "₹15 lakh – ₹2 crore",
    sizeRange: "60 – 500 sq yd",
    showRanges: true,
  };

  return { projects, inventory, leads, visits, offers, gallery, content, settings, compare: [] };
}

const KEY = "brajproperty-demo-v1";
const SERVER: DB = seed();
let state: DB | null = null;
const listeners = new Set<() => void>();

function load(): DB {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...seed(), ...(JSON.parse(raw) as Partial<DB>) } : seed();
  } catch {
    state = seed();
  }
  return state;
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function getDB(): DB {
  return typeof window === "undefined" ? SERVER : load();
}

export function update(fn: (d: DB) => DB) {
  state = fn(load());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked */
  }
  listeners.forEach((l) => l());
}

export function resetDemo() {
  state = seed();
  window.localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useDB(): DB {
  return useSyncExternalStore(subscribe, load, () => SERVER);
}

export const seedProjects = SERVER.projects;

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
}

export const ON_ENQUIRY_TEXT = ON_ENQUIRY;
