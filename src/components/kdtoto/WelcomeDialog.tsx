"use client";

import { useState } from "react";
import Image from "next/image";
import { useKdReady } from "./KdReadyContext";

export default function KdWelcomeDialog() {
  const [open, setOpen] = useState(true);
  const { start } = useKdReady();

  if (!open) return null;

  const handleStart = () => {
    start();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl px-6 pt-10 pb-7 flex flex-col items-center text-center font-montserrat"
        style={{
          background: "linear-gradient(180deg, #3a0e06 0%, #1a0500 100%)",
          border: "2px solid rgba(241, 196, 15, 0.4)",
          boxShadow:
            "0 0 60px rgba(200, 60, 20, 0.3), 0 0 30px rgba(241, 196, 15, 0.15), 0 12px 40px rgba(0,0,0,0.8)",
        }}
      >
        {/* Top glow */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-28 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(241,196,15,0.25) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* Logo */}
        {/* <div className="mb-4">
          <Image
            src="/images/kdtoto/logo.webp"
            alt="KDTOTO"
            width={280}
            height={160}
            className="w-48 h-auto"
          />
        </div> */}

        {/* Title */}
        <h2
          className="font-jomhuria text-4xl mb-1"
          style={{
            background: "linear-gradient(180deg, #fff70c, #f9e547)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Selamat Datang!
        </h2>

        <p className="text-white text-sm mb-6 leading-relaxed">
          Tebak 8 angka hoki kamu dan
          <br />
          menangkan hadiah hingga ratusan juta!
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl font-bold text-white text-base tracking-wide transition-transform active:scale-95 cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #e74c3c, #b71c1c)",
            boxShadow:
              "0 4px 20px rgba(231, 76, 60, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(241, 196, 15, 0.35)",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          Mulai Bermain
        </button>

        <p className="text-white text-xs mt-3">
          Dengan melanjutkan, kamu menyetujui syarat &amp; ketentuan berlaku.
        </p>

        {/* Corner ornaments */}
        <div
          className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
          style={{
            borderTop: "2px solid rgba(241,196,15,0.4)",
            borderLeft: "2px solid rgba(241,196,15,0.4)",
            borderRadius: "2px 0 0 0",
          }}
        />
        <div
          className="absolute top-3 right-3 w-4 h-4 pointer-events-none"
          style={{
            borderTop: "2px solid rgba(241,196,15,0.4)",
            borderRight: "2px solid rgba(241,196,15,0.4)",
            borderRadius: "0 2px 0 0",
          }}
        />
        <div
          className="absolute bottom-3 left-3 w-4 h-4 pointer-events-none"
          style={{
            borderBottom: "2px solid rgba(241,196,15,0.4)",
            borderLeft: "2px solid rgba(241,196,15,0.4)",
            borderRadius: "0 0 0 2px",
          }}
        />
        <div
          className="absolute bottom-3 right-3 w-4 h-4 pointer-events-none"
          style={{
            borderBottom: "2px solid rgba(241,196,15,0.4)",
            borderRight: "2px solid rgba(241,196,15,0.4)",
            borderRadius: "0 0 2px 0",
          }}
        />
      </div>
    </div>
  );
}
