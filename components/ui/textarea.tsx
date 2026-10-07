// Relume primitive (components/ui/textarea.tsx), vendored via the Relume Library MCP.
// Adaptation: shares the Input field styling (sunken wine field, champagne focus).
import * as React from "react";

import { cn } from "@/lib/utils";
import { fieldBase } from "@/components/ui/input";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("flex w-full", fieldBase, "min-h-11 p-3", className)}
      {...props}
    />
  );
}

export { Textarea };
