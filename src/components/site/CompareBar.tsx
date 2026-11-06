import { Link, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/lib/store";
import { clearCompare, toggleCompare } from "./compare";

export function CompareBar() {
  const { compare, projects } = useDB();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!compare.length || path === "/compare") return null;
  const items = projects.filter((p) => compare.includes(p.id) && p.published !== false);
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-primary text-primary-foreground shadow-lift">
      <div className="container-x flex flex-wrap items-center gap-3 py-3">
        <span className="eyebrow">Compare ({compare.length}/3)</span>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((p) => (
            <span key={p.id} className="flex items-center gap-1 rounded-sm bg-primary-foreground/10 px-2 py-1 text-xs">
              {p.name}
              <Button variant="ghost" size="icon" aria-label={`Remove ${p.name} from comparison`} onClick={() => toggleCompare(p.id)}>
                <X className="size-3.5" />
              </Button>
            </span>
          ))}
        </div>
        <Button size="sm" variant="heroOutline" onClick={clearCompare}>
          Clear
        </Button>
        <Button size="sm" variant="gold" asChild>
          <Link to="/compare">Compare now</Link>
        </Button>
      </div>
    </div>
  );
}
