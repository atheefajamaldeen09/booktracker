"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { X } from "lucide-react";

type Props = {
  onResult: (isbn: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    const startScanning = async () => {
      try {
        await codeReader.decodeFromVideoDevice(
          null,
          videoRef.current!,
          (result, err) => {
            if (result && scanning) {
              setScanning(false);
              const text = result.getText();
              if (/^\d{10}$|^\d{13}$/.test(text)) {
                onResult(text);
              } else {
                setError(
                  "This does not look like a book barcode. Please try again."
                );
                setScanning(true);
              }
            }
            if (err && err.name !== "NotFoundException") {
              console.error(err);
            }
          }
        );
      } catch {
        setError(
          "Could not access camera. Please make sure you have given camera permission."
        );
      }
    };

    startScanning();

    return () => {
      readerRef.current?.reset();
    };
  }, [onResult, scanning]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => {
          readerRef.current?.reset();
          onClose();
        }}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#F5ECD7",
        }}
      >
        <X size={18} />
      </button>

      <h2
        style={{
          color: "#C8813A",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Scan Book Barcode
      </h2>
      <p
        style={{
          color: "#A89070",
          fontSize: "13px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Point your camera at the barcode on the back of the book
      </p>

      {/* Camera View */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "2px solid #C8813A",
        }}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", display: "block" }}
          autoPlay
          muted
          playsInline
        />

        {/* Scanning overlay line */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "2px",
              backgroundColor: "#C8813A",
              opacity: 0.8,
              animation: "scan 2s ease-in-out infinite",
            }}
          />
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateY(-60px); opacity: 0.4; }
            50% { transform: translateY(0px); opacity: 1; }
            100% { transform: translateY(60px); opacity: 0.4; }
          }
        `}</style>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#3D1A1A",
            border: "1px solid #8B3A3A",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#F5ECD7",
            fontSize: "13px",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}