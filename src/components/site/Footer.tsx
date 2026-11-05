import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { useDB } from "@/lib/store";
import { telHref, waHref } from "@/lib/format";
import { Logo } from "./Header";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      <strong className="font-semibold">Disclaimer:</strong> Prices, plot sizes and availability are indicative and
      subject to change — please confirm current details before any decision. Approval, title, ownership and any
      promotional terms require independent verification of original documents. Images are illustrative until real
      project photographs are supplied. Nothing on this website is an offer, guarantee or promise of returns.
    </p>
  );
}

export function Footer() {
  const { settings, projects } = useDB();
  return (
    <footer className="no-print bg-navy-deep text-primary-foreground">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-primary-foreground/70">Serving Mathura and Vrindavan.</p>
        </div>
        <div>
          <h3 className="eyebrow mb-4">Projects</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {projects.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link to="/projects/$slug" params={{ slug: p.slug }} className="hover:text-gold">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {(
              [
                ["/projects", "All projects"],
                ["/compare", "Compare"],
                ["/gallery", "Gallery"],
                ["/about", "About"],
                ["/contact", "Contact"],
                ["/privacy", "Privacy policy"],
                ["/terms", "Terms of use"],
              ] as const
            ).map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li>
              <a href={telHref(settings.phone)} className="flex items-center gap-2 hover:text-gold">
                <Phone className="size-4" /> Call {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={waHref(settings.whatsapp, "Hello BrajProperty.in, I would like details about your projects in Mathura/Vrindavan.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <MessageCircle className="size-4" /> WhatsApp {settings.whatsapp}
              </a>
            </li>
            {settings.email && <li>{settings.email}</li>}
            <li>Office address: {settings.officeAddress || "details available on enquiry"}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x py-6">
          <p className="text-xs leading-relaxed text-primary-foreground/60">
            Prices, sizes and availability are indicative; confirm current details. Approval, title, ownership and
            promotional terms require document verification. Images are illustrative. No assured returns are offered.
          </p>
          <p className="mt-3 text-xs text-primary-foreground/50">
            © 2026 {settings.brandName}. <Link to="/admin" className="underline hover:text-gold">Demo admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
