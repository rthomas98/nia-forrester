// Relume primitive (components/ui/card.tsx), vendored via the Relume Library MCP.
// Adaptation: unused CardHeader/Title/Description/Content/Footer exports removed; the
// transparent variant uses the cream hairline.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("overflow-hidden rounded-card", {
  variants: {
    variant: {
      default: "border border-scheme-border bg-scheme-foreground text-scheme-text",
      raised: "border border-scheme-border bg-wine-raised text-scheme-text",
      sunken: "border border-hairline bg-wine-sunken text-scheme-text",
      transparent: "border border-scheme-border bg-transparent text-scheme-text",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Card, cardVariants };
