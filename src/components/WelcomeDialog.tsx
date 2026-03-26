"use client";

import { useState } from "react";
import Image from "next/image";
import { useAudioManager } from "@/components/AudioManager";

export default function WelcomeDialog() {
  const [open, setOpen] = useState(true);
  const { startAudio } = useAudioManager();

  if (!open) return null;

  const handleStart = () => {
    startAudio();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl px-6 pt-8 pb-7 flex flex-col items-center text-center"
        style={{
          background: "linear-gradient(180deg, #2a1200 0%, #0e0700 100%)",
          border: "1px solid rgba(250,184,97,0.35)",
          boxShadow: "0 0 40px rgba(250,140,0,0.25), 0 8px 32px rgba(0,0,0,0.7)",
        }}
      >
        {/* Glow top */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(250,184,97,0.35) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Banner "Selamat Datang!" */}
        <div className="relative mb-4" style={{ width: "min(270px, 72vw)" }}>
          <Image
            src="/images/periode.png"
            alt="Selamat Datang"
            width={240}
            height={49}
            style={{ width: "100%", height: "auto" }}
          />
          <div className="absolute inset-0 flex items-center justify-center -top-1">
            <p
              className="font-extrabold tracking-wide"
              style={{
                fontSize: "clamp(13px, 4vw, 17px)",
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              }}
            >
              Selamat Datang!
            </p>
          </div>
        </div>
        <p className="text-white/70 text-sm mb-6 leading-relaxed">
          Tebak angka hoki kamu dan<br />menangkan hadiah jutaan rupiah!
        </p>

        <button
          onClick={handleStart}
          className="w-full py-3 rounded-2xl font-extrabold text-white text-base tracking-wide transition-transform active:scale-95"
          style={{
            background: "linear-gradient(180deg, #FAB861 0%, #F79009 100%)",
            boxShadow: "0 4px 20px rgba(247,144,9,0.6)",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          ✦ Mulai Bermain ✦
        </button>

        <p className="text-white/30 text-[10px] mt-3">
          Dengan melanjutkan, kamu menyetujui syarat &amp; ketentuan berlaku.
        </p>
      </div>
    </div>
  );
}
