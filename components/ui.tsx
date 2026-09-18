import type { ReactNode } from "react";
import Image from "next/image";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const coverSizes = {
  path: {
    cover: "h-[124px] w-[84px] p-[10px_9px]",
    title: "text-[13px]",
    author: "text-[7px]",
  },
  shelf: {
    cover: "h-[194px] w-[132px] p-[13px_11px]",
    title: "text-[17px]",
    author: "text-[8px]",
  },
  progress: {
    cover: "h-[152px] w-[104px] p-[12px_10px]",
    title: "text-[16px]",
    author: "text-[8px]",
  },
  library: {
    cover: "h-[176px] w-[120px] p-[12px_10px]",
    title: "text-[15px]",
    author: "text-[8px]",
  },
  featured: {
    cover: "h-56 w-[152px] p-[13px]",
    title: "text-[19px]",
    author: "text-[9px]",
  },
} as const;

export function BookCover({
  title,
  gradient,
  size = "shelf",
  footer,
  className,
  src,
  sizes,
}: {
  title: string;
  gradient: string;
  size?: keyof typeof coverSizes;
  footer?: ReactNode;
  className?: string;
  src?: string | null;
  sizes?: string;
}) {
  const sizing = coverSizes[size];

  return (
    <div
      className={joinClasses(
        "relative flex flex-none flex-col justify-between overflow-hidden rounded-[3px] ring-1 ring-white/20 shadow-[0_26px_46px_-22px_rgba(53,5,73,0.52),0_8px_18px_-8px_rgba(53,5,73,0.24)] transition duration-300 ease-out hover:-translate-y-1.5 hover:-rotate-1 hover:scale-[1.02] hover:shadow-[0_34px_54px_-22px_rgba(53,5,73,0.6)]",
        gradient,
        sizing.cover,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`Cover of ${title}`}
          fill
          sizes={sizes ?? (size === "featured" ? "152px" : "120px")}
          className="object-cover"
        />
      ) : (
        <>
          <div
            className={joinClasses(
              "font-sans font-semibold uppercase tracking-[0.14em] text-[rgba(196,185,203,0.8)]",
              sizing.author,
            )}
          >
            Nia Forrester
          </div>
          <div>
            <div
              className={joinClasses(
                "font-serif font-medium leading-[1.05] text-[var(--color-brand-surface)]",
                sizing.title,
              )}
            >
              {title}
            </div>
            {footer}
          </div>
        </>
      )}
    </div>
  );
}

export function ImageSlot({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "flex flex-col items-center justify-center gap-3 bg-[linear-gradient(150deg,var(--color-brand-surface)_0%,var(--color-soft-lavender)_55%,var(--color-cool-teal)_130%)]",
        className,
      )}
    >
      <span className="flex size-[54px] items-center justify-center rounded-full bg-[rgba(53,5,73,0.14)] font-serif text-2xl font-medium italic text-[var(--color-deep-plum)]">
        N
      </span>
      <span className="px-6 text-center font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(53,5,73,0.55)]">
        {label}
      </span>
    </div>
  );
}

export function Avatar({
  initials,
  color,
  size = "md",
  className,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "flex flex-none items-center justify-center rounded-full font-sans font-bold text-[var(--color-brand-surface)]",
        size === "sm" ? "size-9 text-[11px]" : "size-[42px] text-[13px]",
        color,
        className,
      )}
    >
      {initials}
    </div>
  );
}
