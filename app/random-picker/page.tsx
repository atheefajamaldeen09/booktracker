import { Suspense } from "react";
import { Caveat } from "next/font/google";
import RandomPickerContent from "./RandomPickerContent";

// Handwriting for the blind date label
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export default function RandomPickerPage() {
  return (
    <div className={hand.variable}>
      <Suspense
        fallback={
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              Loading picker...
            </p>
          </div>
        }
      >
        <RandomPickerContent />
      </Suspense>
    </div>
  );
}
