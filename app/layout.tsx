import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { ConvexClientProvider } from "@/app/convex-client-provider";
import { getToken } from "@/lib/auth-server";
import { Analytics } from "@vercel/analytics/next";

function AmbientLineField() {
    return (<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-[24vw] top-[5vh] h-[42vw] min-h-[310px] w-[78vw] min-w-[620px] rotate-12 rounded-[50%] border border-[rgba(53,5,73,0.07)] border-t-[rgba(103,160,175,0.2)] animate-[spin_42s_linear_infinite] motion-reduce:animate-none" />
      <div className="absolute -right-[28vw] top-[24vh] h-[52vw] min-h-[420px] w-[84vw] min-w-[720px] -rotate-12 rounded-[50%] border border-[rgba(190,43,113,0.08)] border-b-[rgba(190,43,113,0.18)] animate-[spin_58s_linear_infinite_reverse] motion-reduce:animate-none" />
      <div className="absolute left-[8vw] top-[64vh] h-[36vw] min-h-[280px] w-[62vw] min-w-[560px] rotate-45 rounded-[50%] border border-[rgba(103,160,175,0.08)] border-r-[rgba(53,5,73,0.14)] animate-[spin_50s_linear_infinite] motion-reduce:animate-none" />
      <div className="absolute inset-x-0 top-[34vh] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(103,160,175,0.16)_35%,rgba(190,43,113,0.12)_66%,transparent_100%)] opacity-60 animate-pulse motion-reduce:animate-none" />
    </div>);
}

export const metadata: Metadata = {
    metadataBase: new URL("https://www.niaforrester.com"),
    title: {
        default: "Nia Forrester | Novels, Serials, Essays & Events",
        template: "%s | Nia Forrester",
    },
    description: "Read Nia Forrester’s novels, serialized fiction, essays, and audio work. Find events, community conversations, and the Writing Studio.",
    authors: [{ name: "Nia Forrester" }],
    creator: "Nia Forrester",
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        siteName: "Nia Forrester",
        title: "Nia Forrester | Novels, Serials, Essays & Events",
        description: "The serials, the essays, and the whole backlist. Every story starts here.",
        url: "/",
        images: [
            {
                url: "/images/nia-hero.jpg",
                width: 1500,
                height: 2000,
                alt: "Nia Forrester",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nia Forrester | Novels, Serials, Essays & Events",
        description: "The serials, the essays, and the whole backlist. Every story starts here.",
        images: ["/images/nia-hero.jpg"],
    },
};
export default async function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    const initialToken = await getToken();
    return (<html lang="en">
      <body className="m-0 overflow-x-hidden bg-[var(--color-soft-lavender)] font-sans text-[var(--color-deep-plum)] antialiased selection:bg-[var(--color-hot-magenta)] selection:text-[var(--color-brand-surface)]">
        <ConvexClientProvider initialToken={initialToken}>
          <AuthProvider>
            <div className="relative isolate min-h-screen bg-[radial-gradient(circle_at_12%_8%,rgba(103,160,175,0.34),transparent_26%),radial-gradient(circle_at_88%_14%,rgba(190,43,113,0.22),transparent_24%),linear-gradient(180deg,var(--color-soft-lavender)_0%,rgba(252,251,252,0.72)_48%,var(--color-soft-lavender)_100%)]">
              <AmbientLineField />
              <div className="relative z-10">
                <SiteHeader />
                {children}
                <SiteFooter />
              </div>
            </div>
            <Analytics />
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>);
}
