import type { Project } from "./store";

export function formatLakh(v: number | null | undefined): string {
  if (v == null) return "On enquiry";
  if (v >= 100) return `₹${(v / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })} crore`;
  return `₹${v.toLocaleString("en-IN")} lakh`;
}

export function priceText(p: Project) {
  if (p.priceMinLakh == null && p.priceMaxLakh == null) return "Price on enquiry";
  return `${formatLakh(p.priceMinLakh)} – ${formatLakh(p.priceMaxLakh)} (indicative)`;
}

export function sizeText(p: Project) {
  if (p.sizeMinSqYd == null && p.sizeMaxSqYd == null) return "Details available on enquiry";
  return `${p.sizeMinSqYd ?? "?"} – ${p.sizeMaxSqYd ?? "?"} sq yd`;
}

export const digits = (phone: string) => phone.replace(/\D/g, "");
export const telHref = (phone: string) => `tel:+${digits(phone)}`;
export const waHref = (phone: string, msg: string) =>
  `https://wa.me/${digits(phone)}?text=${encodeURIComponent(msg)}`;
export const mapHref = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export const BUDGETS: { id: string; label: string; min: number; max: number }[] = [
  { id: "u25", label: "Up to ₹25 lakh", min: 0, max: 25 },
  { id: "25-50", label: "₹25–50 lakh", min: 25, max: 50 },
  { id: "50-100", label: "₹50 lakh–₹1 crore", min: 50, max: 100 },
  { id: "100-200", label: "₹1–2 crore", min: 100, max: 200 },
];
export const SIZES: { id: string; label: string; min: number; max: number }[] = [
  { id: "s100", label: "Up to 100 sq yd", min: 0, max: 100 },
  { id: "s200", label: "100–200 sq yd", min: 100, max: 200 },
  { id: "s300", label: "200–300 sq yd", min: 200, max: 300 },
  { id: "s500", label: "300–500 sq yd", min: 300, max: 500 },
];

/** Projects with unknown values are kept (they may fit) — flagged by caller. */
export function overlaps(aMin: number | null, aMax: number | null, bMin: number, bMax: number) {
  if (aMin == null && aMax == null) return true;
  const lo = aMin ?? aMax ?? 0;
  const hi = aMax ?? aMin ?? 0;
  return lo <= bMax && hi >= bMin;
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;
