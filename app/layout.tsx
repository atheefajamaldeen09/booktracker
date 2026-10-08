import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { DEFAULT_THEME, themeInitScript } from "@/lib/themes";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BookTracker",
  description: "Your personal reading companion",
};

export const viewport: Viewport = {
  themeColor: "#17100b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The inline script swaps data-theme before React hydrates, hence suppressHydrationWarning
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Navigation />
        {/*
          On mobile: padding at top so content clears the top bar
          On desktop: margin on left so content clears the side nav
        */}
        <main id="main-content" className="page-enter">
          {children}
        </main>

        <style>{`
          #main-content {
            min-height: 100vh;
            padding: 40px 40px 48px;
            max-width: 100vw;
            overflow-x: hidden;
          }
          @media (min-width: 768px) {
            #main-content {
              margin-left: 230px;
            }
          }
          @media (max-width: 767px) {
            #main-content {
              margin-left: 0;
              padding: 80px 16px 32px;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
