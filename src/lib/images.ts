import hero from "@/assets/hero.jpg";
import villa from "@/assets/villa.jpg";
import plots from "@/assets/plots.jpg";
import park from "@/assets/park.jpg";
import interior from "@/assets/interior.jpg";
import street from "@/assets/street.jpg";

export const IMAGES: Record<string, string> = { hero, villa, plots, park, interior, street };
export const IMAGE_KEYS = Object.keys(IMAGES);

/** Resolve a stored image reference (built-in key or absolute URL). */
export function img(src: string | undefined): string {
  if (!src) return hero;
  return IMAGES[src] ?? src;
}
