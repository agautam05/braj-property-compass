import { toast } from "sonner";
import { update, getDB } from "@/lib/store";

export function toggleCompare(id: string) {
  const cur = getDB().compare;
  if (cur.includes(id)) {
    update((d) => ({ ...d, compare: d.compare.filter((x) => x !== id) }));
    toast("Removed from comparison");
    return;
  }
  if (cur.length >= 3) {
    toast.error("You can compare up to three projects", { description: "Remove one to add another." });
    return;
  }
  update((d) => ({ ...d, compare: [...d.compare, id] }));
  toast.success("Added to comparison");
}

export function clearCompare() {
  update((d) => ({ ...d, compare: [] }));
}
