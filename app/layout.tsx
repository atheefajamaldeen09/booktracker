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
      <body 
        style={{ 
          backgroundColor: "#1C1009", 
          margin: 0,
          padding: 0,
          overflowX: "hidden", // 👈 ADD THIS
          width: "100%", // 👈 ADD THIS
        }}
      >
        <Navigation />
        {/* 
          On mobile: padding at bottom so content clears the bottom nav 
          On desktop: margin on left so content clears the side nav
        */}
        <main
          id="main-content"
          style={{ 
            backgroundColor: "#1C1009", 
            minHeight: "100vh", 
            padding: "32px",
            maxWidth: "100vw", // 👈 ADD THIS
            boxSizing: "border-box", // 👈 ADD THIS
            overflowX: "hidden", // 👈 ADD THIS
          }}
        >
          {children}
        </main>

        <style>{`
          * {
            box-sizing: border-box;
          }
          
          html {
            overflow-x: hidden;
            width: 100%;
          }
          
          @media (min-width: 768px) {
            #main-content {
              margin-left: 210px;
              padding-bottom: 32px;
            }
          }
          @media (max-width: 767px) {
            #main-content {
              margin-left: 0;
              padding-top: 72px; 
              padding-bottom: 24px; 
              padding-left: 16px; 
              padding-right: 16px; 
            }
          }
        `}</style>
      </body>
    </html>
  );
}