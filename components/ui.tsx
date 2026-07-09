import type { CSSProperties, ReactNode } from "react";

/**
 * A stylized book cover — gradient background, author line on top,
 * italic serif title at the bottom. Sizes vary across the site so
 * width/height and font sizes are passed in.
 */
export function BookCover({
  title,
  gradient,
  width,
  height,
  titleSize,
  authorSize = 8,
  padding = "13px 11px",
  radius = 2,
  footer,
  style,
  className = "nf-cover-hover",
}: {
  title: string;
  gradient: string;
  width: number;
  height: number;
  titleSize: number;
  authorSize?: number;
  padding?: string;
  radius?: number;
  footer?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: radius,
        boxShadow: "var(--shadow-book)",
        background: gradient,
        padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: authorSize,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(244,227,215,0.8)",
          fontWeight: 600,
        }}
      >
        Nia Forrester
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: titleSize,
            lineHeight: 1.05,
            color: "var(--st-soft-cream)",
          }}
        >
          {title}
        </div>
        {footer}
      </div>
    </div>
  );
}

/**
 * Placeholder for the design's image slots (author portrait, community
 * photo, academy banner). Renders a soft branded frame until a real
 * photo is dropped into /public/images.
 */
export function ImageSlot({
  label,
  style,
}: {
  label: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        // caller style first so the slot's layout/branding always wins
        ...style,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background:
          "linear-gradient(150deg, var(--bg-3) 0%, var(--st-soft-peach) 55%, var(--st-warm-tan) 130%)",
      }}
    >
      <span
        style={{
          width: 54,
          height: 54,
          borderRadius: 999,
          background: "rgba(31,42,56,0.14)",
          color: "var(--bg-inverse)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 24,
        }}
      >
        N
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(31,42,56,0.55)",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** Circular initials avatar used across community/testimonial sections. */
export function Avatar({
  initials,
  color,
  size = 42,
  fontSize = 13,
  textColor = "var(--st-soft-cream)",
  border,
  style,
}: {
  initials: string;
  color: string;
  size?: number;
  fontSize?: number;
  textColor?: string;
  border?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        flex: "none",
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize,
        border,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
