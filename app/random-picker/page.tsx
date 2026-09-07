import { Suspense } from "react";
import RandomPickerContent from "./RandomPickerContent";

export default function RandomPickerPage() {
  return (
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
          <p style={{ color: "#A89070", fontSize: "16px" }}>
            Loading picker...
          </p>
        </div>
      }
    >
      <RandomPickerContent />
    </Suspense>
  );
}