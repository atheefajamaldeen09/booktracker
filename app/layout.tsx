import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { DEFAULT_THEME, themeInitScript } from "@/lib/themes";
import { getRole } from "@/lib/auth/server";
import { ViewerProvider } from "@/components/Viewer";
import ServiceWorker from "@/components/ServiceWorker";

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
  applicationName: "BookTracker",
  // Opened from an iPhone home screen it runs full screen, like an app
  appleWebApp: { capable: true, title: "BookTracker", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#17100b",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // owner, guest (view-only link) or null on the private/unlock screens
  const role = await getRole();

  return (
    // The inline script swaps data-theme before React hydrates, hence suppressHydrationWarning
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      data-role={role ?? "none"}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ServiceWorker />
        <ViewerProvider role={role}>
          <Navigation />
          {/*
            On mobile: padding at top so content clears the top bar
            On desktop: margin on left so content clears the side nav
          */}
          <main id="main-content" className="page-enter">
            {role === "guest" && (
              <div className="guest-banner" role="status">
                <span aria-hidden>👀</span> You&apos;re visiting as a guest — have a look around. Nothing here can be
                changed.
              </div>
            )}
            {children}
          </main>
        </ViewerProvider>

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
