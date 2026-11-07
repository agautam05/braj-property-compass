import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { update, uid, useDB, type Lead, type Visit } from "@/lib/store";
import { BUDGETS, PHONE_RE } from "@/lib/format";

const base = {
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(PHONE_RE, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().max(120).email("Enter a valid email").or(z.literal("")),
  projectId: z.string(),
  message: z.string().trim().max(1000),
};
const enquirySchema = z.object({ ...base, budget: z.string() });
const visitSchema = z.object({
  ...base,
  date: z.string().min(1, "Choose a preferred date"),
  time: z.string().min(1, "Choose a preferred time"),
});

const selectCls =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function EnquiryForm({
  kind = "enquiry",
  projectId = "",
  defaultMessage = "",
  compact = false,
}: {
  kind?: "enquiry" | "visit";
  projectId?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const { projects } = useDB();
  const [vals, setVals] = useState({
    name: "",
    phone: "",
    email: "",
    projectId,
    budget: "",
    message: defaultMessage,
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setVals((v) => ({ ...v, [k]: e.target.value }));
  const id = (k: string) => `${kind}-${k}-${projectId || "gen"}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = (kind === "visit" ? visitSchema : enquirySchema).safeParse(vals);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      toast.error("Please check the highlighted fields");
      return;
    }
    setErrors({});
    const now = new Date().toISOString();
    const lead: Lead = {
      id: uid("lead"),
      name: vals.name.trim(),
      phone: vals.phone.trim(),
      email: vals.email.trim(),
      projectId: vals.projectId,
      budget: vals.budget,
      message: vals.message.trim(),
      source: kind === "visit" ? "Site visit form" : "Website enquiry",
      status: kind === "visit" ? "Visit scheduled" : "New",
      notes: [],
      createdAt: now,
      demo: true,
    };
    update((d) => {
      const next = { ...d, leads: [lead, ...d.leads] };
      if (kind === "visit") {
        const v: Visit = {
          id: uid("visit"),
          name: lead.name,
          phone: lead.phone,
          projectId: vals.projectId,
          date: vals.date,
          time: vals.time,
          status: "Requested",
          notes: lead.message,
          createdAt: now,
          demo: true,
        };
        next.visits = [v, ...d.visits];
      }
      return next;
    });
    setDone(true);
    toast.success(kind === "visit" ? "Demo visit saved" : "Demo enquiry saved", {
      description: "Saved in this browser only; not sent to the team.",
    });
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-lg border bg-card p-6">
        <CheckCircle2 className="size-8 text-success" />
        <h3 className="font-serif text-2xl text-primary">Thank you, {vals.name.split(" ")[0]}.</h3>
        <p className="text-sm text-muted-foreground">
          {kind === "visit"
            ? "Your demo visit request is saved in this browser only. Call or WhatsApp to arrange a real visit."
            : "Your demo enquiry is saved in this browser only, not sent to the team. Call or WhatsApp for a real enquiry."}
        </p>
        <Button variant="outline" size="sm" onClick={() => { setDone(false); setVals((v) => ({ ...v, name: "", phone: "", email: "", message: defaultMessage })); }}>
          Submit another
        </Button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${id(k)}-err`} className="mt-1 text-xs text-destructive">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id(k)}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <Label htmlFor={id("name")}>Full name *</Label>
          <Input id={id("name")} value={vals.name} onChange={set("name")} autoComplete="name" className="mt-1.5 bg-card" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <Label htmlFor={id("phone")}>Mobile number *</Label>
          <Input id={id("phone")} value={vals.phone} onChange={set("phone")} inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" className="mt-1.5 bg-card" {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <Label htmlFor={id("email")}>Email (optional)</Label>
          <Input id={id("email")} value={vals.email} onChange={set("email")} type="email" autoComplete="email" className="mt-1.5 bg-card" {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <Label htmlFor={id("project")}>Project</Label>
          <select id={id("project")} aria-label="Project" value={vals.projectId} onChange={set("projectId")} className={`mt-1.5 ${selectCls}`}>
            <option value="">Any / not sure</option>
            {projects.filter((p) => p.published !== false).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {kind === "enquiry" ? (
          <div className={compact ? "" : "sm:col-span-2"}>
            <Label htmlFor={id("budget")}>Budget</Label>
            <select id={id("budget")} aria-label="Budget" value={vals.budget} onChange={set("budget")} className={`mt-1.5 ${selectCls}`}>
              <option value="">Prefer not to say</option>
              {BUDGETS.map((b) => (
                <option key={b.id} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor={id("date")}>Preferred date *</Label>
              <Input id={id("date")} type="date" value={vals.date} onChange={set("date")} className="mt-1.5 bg-card" {...aria("date")} />
              {err("date")}
            </div>
            <div>
              <Label htmlFor={id("time")}>Preferred time *</Label>
              <select id={id("time")} aria-label="Preferred time *" value={vals.time} onChange={set("time")} className={`mt-1.5 ${selectCls}`} {...aria("time")}>
                <option value="">Select</option>
                {["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {err("time")}
            </div>
          </>
        )}
      </div>
      <div>
        <Label htmlFor={id("message")}>Message</Label>
        <Textarea id={id("message")} value={vals.message} onChange={set("message")} rows={compact ? 3 : 4} className="mt-1.5 bg-card" />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {kind === "visit" ? "Request site visit" : "Send enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">
        DEMO MODE: saved in this browser only. Do not enter sensitive personal information.
      </p>
    </form>
  );
}
