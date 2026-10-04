/**
 * Relume Log In 7 (slug: login7) — also the layout of Relume Sign Up 7 (slug: signup7),
 * whose split-screen markup is identical apart from its form fields. Vendored via the
 * Relume Library MCP.
 * Adaptations: the site navbar/footer replace Relume's absolute logo bar and footer
 * line; the form, links and image are slots so each page keeps its Better Auth
 * handlers (Relume's console.log handler and Google button were removed — the site
 * has no Google sign-in); height fits below the sticky navbar; `next/image` media.
 */
import type { ReactNode } from "react";

export type Login7Props = {
  tagline?: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  image: ReactNode;
};

export const Login7 = ({ tagline, title, description, children, footer, image }: Login7Props) => {
  return (
    <section>
      <div className="relative grid grid-cols-1 justify-center lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-2">
        <div className="relative mx-[5vw] flex items-center justify-center pt-16 pb-16 md:pt-20 md:pb-20 lg:py-20">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6 text-center md:mb-8">
              {tagline ? (
                <p className="mb-3 font-ui text-tiny font-semibold tracking-[0.22em] text-champagne uppercase md:mb-4">{tagline}</p>
              ) : null}
              <h1 className="mb-5 font-display text-h2 font-semibold text-balance text-cream md:mb-6">{title}</h1>
              <div className="text-medium text-pretty text-body">{description}</div>
            </div>
            {children}
            {footer ? (
              <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-1 text-center text-body md:mt-6">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
        <div className="relative hidden overflow-hidden border-l border-hairline bg-scheme-foreground lg:block">{image}</div>
      </div>
    </section>
  );
};
