"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SlotColumn from "./SlotColumn";
import SoundToggle from "./SoundToggle";
import { useSlotSound } from "@/hooks/useSlotSound";
import Image from "next/image";

interface Props {
  numbers: string;
  periode: string;
  periodeNumber: string;
  countdownTargetMs: number;
  periodeEndMs: number;
  isActive: boolean;
  resultPeriodeNumber: string;
}

async function fetchResultWithRetry(periodeNumber: string, retries = 5): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`/api/game/result?periode=${periodeNumber}`);
      const data = await res.json();
      if (data.nomor) return data.nomor;
    } catch { /* retry */ }
    if (i < retries - 1) await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

export default function SlotMachine({
  numbers: initialNumbers,
  periode,
  periodeNumber,
  countdownTargetMs,
  periodeEndMs,
  isActive,
  resultPeriodeNumber,
}: Props) {
  const router = useRouter();
  const [currentNumbers, setCurrentNumbers] = useState(initialNumbers);
  const [spinning, setSpinning] = useState(false);
  const [, setStoppedCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [resultFetched, setResultFetched] = useState(false);
  const { muted, toggleMute, playTick, playStop, playWin } = useSlotSound();

  // Initial spin on mount
  useEffect(() => {
    setMounted(true);
    setTimeout(() => setSpinning(true), 500);
  }, []);

  // Watch for result time and fetch new result
  useEffect(() => {
    if (!isActive || !countdownTargetMs || resultFetched) return;

    const check = () => {
      if (Date.now() >= countdownTargetMs) {
        setResultFetched(true);
        fetchResultWithRetry(periodeNumber).then((nomor) => {
          if (nomor) {
            setCurrentNumbers(nomor);
            setStoppedCount(0);
            setSpinning(true);
          }
        });
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [isActive, countdownTargetMs, periodeNumber, resultFetched]);

  // Periodic refresh for admin changes
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 120_000);
    return () => clearInterval(interval);
  }, [router]);

  const handleColumnStopped = useCallback(() => {
    setStoppedCount((prev) => {
      const next = prev + 1;
      if (next >= 8) {
        setSpinning(false);
        playWin();
      }
      return next;
    });
  }, [playWin]);

  const handleSpin = () => {
    if (spinning) return;
    setStoppedCount(0);
    setSpinning(true);
  };

  const digits = currentNumbers.split("").map(Number);

  // Countdown display
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!periodeEndMs || !isActive) return;
    const tick = () => {
      const diff = periodeEndMs - Date.now();
      if (diff <= 0) {
        setCountdown("00:00:00");
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCountdown(`${h}:${m}:${s}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [periodeEndMs, isActive]);

  return (
    <div className="flex flex-col items-center gap-6">
      <SoundToggle muted={muted} onToggle={toggleMute} />

      <div className="w-full max-w-[700px] mx-auto relative">
        <div className="kd-image-frame">
          <Image
            src="/images/kdtoto/logo.webp"
            alt="Slot Machine"
            width={700}
            height={400}
            className="w-full h-auto block"
            priority
          />
          <div className="kd-slot-cells">
            {mounted &&
              digits.map((digit, index) => (
                <div key={index} className="kd-slot-cell">
                  <SlotColumn
                    targetDigit={digit}
                    index={index}
                    spinning={spinning}
                    onStopped={handleColumnStopped}
                    onTick={playTick}
                    onStop={playStop}
                  />
                </div>
              ))}
          </div>
          <div className="kd-periode">
            Periode: <span className="text-[#fff70c] font-semibold">{periode}</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {isActive && countdown && (
        <p className="text-white/60 font-montserrat text-sm">
          Tutup dalam: <span className="text-[#fff70c] font-semibold">{countdown}</span>
        </p>
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="px-10 py-3 rounded-full font-montserrat font-bold text-white text-lg uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: spinning
            ? "linear-gradient(180deg, #7a2018, #5a1510)"
            : "linear-gradient(180deg, #e74c3c, #c0392b)",
          boxShadow: spinning ? "none" : "0 4px 20px rgba(231, 76, 60, 0.5)",
          border: "2px solid rgba(241, 196, 15, 0.3)",
        }}
      >
        {spinning ? "Spinning..." : "SPIN"}
      </button>
    </div>
  );
}
