import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/store";
import { useDB } from "@/lib/store";
import { img } from "@/lib/images";
import { priceText, sizeText } from "@/lib/format";
import { toggleCompare } from "./compare";
import { cn } from "@/lib/utils";

export function IllustrativeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-sm bg-navy-deep/75 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-primary-foreground backdrop-blur",
        className,
      )}
    >
      Illustrative image
    </span>
  );
}

export function ProjectCard({ p, layout = "grid" }: { p: Project; layout?: "grid" | "list" }) {
  const { compare } = useDB();
  const inCompare = compare.includes(p.id);
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        layout === "list" && "sm:grid sm:grid-cols-[18rem_1fr]",
      )}
    >
      <Link to="/projects/$slug" params={{ slug: p.slug }} className="relative block aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-56">
        <img
          src={img(p.images[0])}
          alt={`${p.name} — illustrative image`}
          loading="lazy"
          width={1200}
          height={800}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <IllustrativeBadge className="absolute left-3 top-3" />
        <span className="absolute bottom-3 left-3 rounded-sm bg-gold px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-foreground">
          {p.city}
        </span>
      </Link>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-serif text-2xl text-primary">
          <Link to="/projects/$slug" params={{ slug: p.slug }} className="hover:text-gold">
            {p.name}
          </Link>
        </h3>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gold" /> {p.location}
        </p>
        <dl className="grid grid-cols-2 gap-3 border-y py-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium">{p.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pricing</dt>
            <dd className="font-medium">{priceText(p)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Plot sizes</dt>
            <dd className="font-medium">{sizeText(p)}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/projects/$slug" params={{ slug: p.slug }}>
              View details <ArrowUpRight />
            </Link>
          </Button>
          <Button size="sm" variant="outline" aria-pressed={inCompare} onClick={() => toggleCompare(p.id)}>
            {inCompare ? <Check /> : <Plus />} {inCompare ? "Comparing" : "Compare"}
          </Button>
        </div>
      </div>
    </article>
  );
}
