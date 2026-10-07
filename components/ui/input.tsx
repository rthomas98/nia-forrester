"use client";

// Relume primitive (components/ui/input.tsx), vendored via the Relume Library MCP.
// Adaptation: sunken wine field, cream text and a visible champagne focus state.
import * as React from "react";

import { cn } from "@/lib/utils";

const fieldBase =
  "rounded-form border border-scheme-border bg-wine-sunken text-cream placeholder:text-taupe/70 transition-all duration-200 focus-visible:border-champagne focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-champagne/40 aria-invalid:border-rose disabled:cursor-not-allowed disabled:opacity-50";

function Input({
  className,
  type,
  icon,
  iconPosition = "left",
  prefix,
  prefixPosition = "left",
  variant = "primary",
  ...props
}: React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  prefix?: string;
  prefixPosition?: "left" | "right";
  variant?: "primary" | "secondary";
}) {
  return (
    <div className="relative flex w-full items-center">
      {icon && iconPosition === "left" && <div className="absolute left-3">{icon}</div>}
      {prefix && prefixPosition === "left" && (
        <div className="min-h-11 shrink-0 border-y border-l border-scheme-border px-3 py-2">
          {prefix}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex size-full align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium",
          fieldBase,
          variant === "secondary" && "border-cream/40 placeholder:text-cream/60",
          "min-h-11 px-3 py-2",
          icon && (iconPosition === "left" ? "pr-3 pl-11" : "pr-11 pl-3"),
          prefix && "grow-1",
          className,
        )}
        {...props}
      />
      {icon && iconPosition === "right" && <div className="absolute right-3">{icon}</div>}
      {prefix && prefixPosition === "right" && (
        <div className="min-h-11 shrink-0 border-y border-r border-scheme-border px-3 py-2">
          {prefix}
        </div>
      )}
    </div>
  );
}

export { Input, fieldBase };
