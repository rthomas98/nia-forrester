// Relume primitive (components/ui/badge.tsx), vendored via the Relume Library MCP.
// Adaptation: Wine palette variants and Manrope uppercase label type.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-badge px-2.5 py-[0.175rem] font-ui text-[0.6875rem] leading-[1.5] font-semibold tracking-[0.12em] uppercase focus:outline-none",
  {
    variants: {
      variant: {
        default: "border border-champagne/40 bg-transparent text-champagne",
        alternate: "border border-cabernet bg-cabernet text-cream",
        outline: "border border-scheme-border bg-transparent text-body",
        alert: "border border-rose/60 bg-rose/15 text-cream",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
