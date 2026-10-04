import { cn } from "@/lib/utils";

/** The NIA FORRESTER wordmark: spaced uppercase Manrope. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-ui text-[0.9375rem] font-semibold tracking-[0.34em] whitespace-nowrap text-cream uppercase sm:text-base",
        className,
      )}
    >
      Nia Forrester
    </span>
  );
}
