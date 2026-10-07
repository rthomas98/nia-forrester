"use client";

// Relume primitive (components/ui/label.tsx), vendored via the Relume Library MCP.
// Adaptation: Manrope label type in the body colour.
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  children,
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  children?: React.ReactNode;
  className?: string;
  htmlFor?: string;
  onClick?: React.MouseEventHandler<HTMLLabelElement>;
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-ui text-small font-semibold text-cream select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );
}

export { Label };
