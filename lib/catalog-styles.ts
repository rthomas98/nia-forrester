/** Shared Tailwind class strings for the catalog UI (server- and client-safe). */
import { buttonVariants } from "@/components/ui/button";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne";

export const primaryAction = buttonVariants();

export const secondaryAction = buttonVariants({ variant: "secondary" });
