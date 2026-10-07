// Relume primitive (components/ui/button.tsx), vendored via the Relume Library MCP.
// Adaptation: variants restyled to the Wine With Writers dark palette, Manrope uppercase
// labels, 44px minimum target and a visible champagne focus ring.
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-3 rounded-button font-ui text-[0.8125rem] leading-none font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-all duration-200 ease-standard focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "border border-cabernet bg-cabernet text-cream hover:-translate-y-px hover:border-cabernet-hover hover:bg-cabernet-hover active:translate-y-0 active:bg-cabernet-press motion-reduce:hover:translate-y-0",
        alternate:
          "border border-champagne bg-champagne text-wine-sunken hover:-translate-y-px hover:border-champagne-hover hover:bg-champagne-hover motion-reduce:hover:translate-y-0",
        secondary:
          "border border-scheme-border text-scheme-text hover:border-champagne hover:text-champagne",
        "secondary-alt": "border border-cream/40 text-cream hover:border-cream",
        link: "gap-2 tracking-[0.1em] text-champagne underline-offset-4 hover:text-cream hover:underline",
        "link-alt": "gap-2 text-cream hover:text-champagne",
        ghost: "text-body hover:bg-wine-raised hover:text-cream",
        none: "",
      },
      size: {
        default: "min-h-11 px-6 py-3",
        sm: "min-h-11 px-5 py-2",
        link: "min-h-11 p-0",
        icon: "size-11",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {iconLeft && iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight && iconRight}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
