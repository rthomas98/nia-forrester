import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Nia Forrester — Reader Hub",
  description:
    "The serials, the backlist, the essays, the community, the events — and the writing studio. Every story, finally in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
