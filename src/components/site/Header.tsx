import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/lib/store";
import { telHref } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/compare", label: "Compare" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="BrajProperty.in home">
      <span className="grid size-10 place-items-center rounded-full border border-gold font-serif text-xl text-gold">
        B
      </span>
      <span className="leading-tight">
        <span className={cn("block font-serif text-xl font-semibold", light ? "text-primary-foreground" : "text-primary")}>
          BrajProperty<span className="text-gold">.in</span>
        </span>
        <span className={cn("block text-[0.65rem] uppercase tracking-[0.25em]", light ? "text-primary-foreground/70" : "text-muted-foreground")}>
          Property in Vrindavan
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { settings, compare } = useDB();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b bg-background/90 backdrop-blur transition-shadow",
        scrolled ? "shadow-soft" : "border-transparent",
      )}
    >
      <div className="container-x flex h-18 items-center justify-between gap-4 py-3">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary data-[status=active]:after:absolute data-[status=active]:after:-bottom-1.5 data-[status=active]:after:left-0 data-[status=active]:after:h-px data-[status=active]:after:w-full data-[status=active]:after:bg-gold"
            >
              {n.label}
              {n.to === "/compare" && compare.length > 0 && (
                <span className="ml-1 rounded-full bg-gold px-1.5 text-[0.65rem] text-gold-foreground">{compare.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <a href={telHref(settings.phone)}>
              <Phone /> {settings.phone}
            </a>
          </Button>
          <Button asChild size="sm">
            <Link to="/contact" hash="enquire">Enquire</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background lg:hidden">
          <div className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="border-b py-3 font-serif text-lg last:border-0 data-[status=active]:text-gold"
              >
                {n.label}
                {n.to === "/compare" && compare.length > 0 ? ` (${compare.length})` : ""}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <a href={telHref(settings.phone)}>
                  <Phone /> Call
                </a>
              </Button>
              <Button asChild>
                <Link to="/contact" hash="enquire" onClick={() => setOpen(false)}>
                  Enquire
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
