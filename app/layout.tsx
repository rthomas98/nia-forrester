import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { ConvexClientProvider } from "@/app/convex-client-provider";
import { getToken } from "@/lib/auth-server";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-cormorant",
    display: "swap",
});
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#2a0f18",
    colorScheme: "dark",
};

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
                url: "/images/nia-full-body-pensive.jpeg",
                width: 1536,
                height: 2048,
                alt: "Nia Forrester",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nia Forrester | Novels, Serials, Essays & Events",
        description: "The serials, the essays, and the whole backlist. Every story starts here.",
        images: ["/images/nia-full-body-pensive.jpeg"],
    },
};
export default async function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    const initialToken = await getToken();
    // Dark is the only theme, so it is server-rendered and never switched on the client.
    return (<html lang="en" className={`${cormorant.variable} ${inter.variable} ${manrope.variable} scheme-dark bg-wine-page`}>
      <body className="m-0 min-h-screen overflow-x-hidden bg-wine-page font-sans text-regular text-body antialiased selection:bg-champagne selection:text-wine-sunken">
        <ConvexClientProvider initialToken={initialToken}>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
            {process.env.VERCEL ? <Analytics /> : null}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>);
}
