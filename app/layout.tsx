import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "BookTracker",
  description: "Your personal reading companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#1C1009", margin: 0 }}>
        <Navigation />
        {/* 
          On mobile: padding at bottom so content clears the bottom nav 
          On desktop: margin on left so content clears the side nav
        */}
        <main
          id="main-content"
          style={{ backgroundColor: "#1C1009", minHeight: "100vh", padding: "32px" }}
        >
          {children}
        </main>

        <style>{`
          @media (min-width: 768px) {
            #main-content {
              margin-left: 210px;
              padding-bottom: 32px;
            }
          }
          @media (max-width: 767px) {
            #main-content {
              margin-left: 0;
              padding-bottom: 100px;
            }
          }
        `}</style>
      </body>
    </html>
  );
}