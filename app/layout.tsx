import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-condensed",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://highfrequency.vip"),
  title: {
    default: "High Frequency Trading — Master the Markets. Build Freedom.",
    template: "%s | High Frequency Trading",
  },
  description:
    "HFT is a movement of disciplined traders and creators building financial freedom. Get the 3ZS strategy, live trade alerts, daily analysis and a private community for $150/month.",
  keywords: [
    "trading community",
    "3ZS strategy",
    "NAS100",
    "trade alerts",
    "trading education",
    "High Frequency Talent",
  ],
  openGraph: {
    title: "High Frequency Trading — Master the Markets. Build Freedom.",
    description:
      "Master the markets with the 3ZS edge. Live alerts, daily analysis, weekly sessions and a private community of traders and creators.",
    siteName: site.name,
    type: "website",
  },
  icons: { icon: "/hft-seal.png", apple: "/hft-seal.png" },
};

export const viewport: Viewport = {
  themeColor: "#030303",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before React hydrates, which is an expected server/client diff.
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint, which is what
            arms the scroll-reveal CSS. Without JS the content just shows. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      {/* Chrome lives in the route-group layouts: app/(marketing) gets the
          public header/footer, app/(app) gets the signed-in shell. */}
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
