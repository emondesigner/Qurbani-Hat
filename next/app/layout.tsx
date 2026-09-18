import type { Metadata, Viewport } from "next";
import { Inter, Marcellus } from "next/font/google";

import "./globals.css";

import { Providers } from "@/components/Providers";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DEFAULT_DEV_URL, resolvePublicBaseUrl } from "@/lib/app-url";
import { getServerSession } from "@/lib/session";
import type { SessionBundle } from "@/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

/**
 * Browser-facing base URL for metadata / Open Graph. On Vercel it resolves from
 * BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL; during local development it is
 * http://localhost:3000. `0.0.0.0` is rewritten to `localhost` (see
 * lib/app-url.ts) because browsers refuse to open the wildcard address.
 */
const appUrl = resolvePublicBaseUrl();

function metadataBase(): URL {
  try {
    return new URL(appUrl);
  } catch {
    return new URL(DEFAULT_DEV_URL);
  }
}

const siteDescription =
  "Find healthy cows and goats for Qurbani from a modern and trusted livestock marketplace.";

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "QurbaniHat — Trusted Livestock Marketplace",
    template: "%s | QurbaniHat",
  },
  description: siteDescription,
  applicationName: "QurbaniHat",
  keywords: [
    "QurbaniHat",
    "Qurbani livestock",
    "Eid-ul-Adha",
    "cow for Qurbani",
    "goat for Qurbani",
    "livestock marketplace Bangladesh",
    "cattle booking",
  ],
  authors: [{ name: "QurbaniHat" }],
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "QurbaniHat",
    title: "QurbaniHat — Trusted Livestock Marketplace",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QurbaniHat — Trusted Livestock Marketplace",
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#064E3B",
};

/**
 * Every route is server-rendered on demand because the navbar, footer and
 * protected pages all depend on the visitor's Better Auth session. This keeps
 * authenticated state fresh (no cached "logged out" HTML) and avoids static
 * generation touching request-scoped APIs such as `headers()`.
 */
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server validated session: the first paint already knows the auth state.
  const session = (await getServerSession()) as SessionBundle | null;

  return (
    // suppressHydrationWarning: browser extensions (e.g. password managers,
    // Demoway, Grammarly) inject attributes on <html>/<body> before React
    // hydrates, which otherwise triggers a false "attributes didn't match"
    // hydration error on every route.
    <html
      lang="en"
      className={`${inter.variable} ${marcellus.variable}`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-screen flex-col bg-cream text-ink"
        suppressHydrationWarning
      >
        <Providers initialSession={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}