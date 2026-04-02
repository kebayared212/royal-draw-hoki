"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SlotColumn from "./SlotColumn";
import SoundToggle from "./SoundToggle";
import { useKdReady } from "./KdReadyContext";
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

async function fetchResultWithRetry(
  periodeNumber: string,
  retries = 5,
): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`/api/game/result?periode=${periodeNumber}`);
      const data = await res.json();
      if (data.nomor) return data.nomor;
    } catch {
      /* retry */
    }
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
}: Props) {
  const router = useRouter();
  const [currentNumbers, setCurrentNumbers] = useState(initialNumbers);
  const [spinKey, setSpinKey] = useState(0);
  const [resultFetched, setResultFetched] = useState(false);
  const [cellH, setCellH] = useState(0);
  const cellsRef = useRef<HTMLDivElement>(null);
  const { muted, toggleMute, playStop, playWin } = useSlotSound();
  const { ready } = useKdReady();

  // Measure cell height from the container
  useEffect(() => {
    const measure = () => {
      if (cellsRef.current) setCellH(cellsRef.current.clientHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Start spin when welcome dialog is dismissed
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setSpinKey((k) => k + 1), 300);
    return () => clearTimeout(t);
  }, [ready]);

  // Sound effects per spin
  useEffect(() => {
    if (spinKey <= 0) return;
    const digits = currentNumbers.split("");
    const totalDuration = 2.2 + (digits.length - 1) * 0.5;

    // playStop per digit landing
    const landingTimers = digits.map((_, i) =>
      setTimeout(() => playStop(), (2.2 + i * 0.5) * 1000),
    );
    // playWin after all digits land
    const winTimer = setTimeout(() => playWin(), (totalDuration + 0.3) * 1000);

    return () => {
      landingTimers.forEach(clearTimeout);
      clearTimeout(winTimer);
    };
  }, [spinKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch for result time and fetch new result
  useEffect(() => {
    if (!isActive || !countdownTargetMs || resultFetched) return;
    const check = () => {
      if (Date.now() >= countdownTargetMs) {
        setResultFetched(true);
        fetchResultWithRetry(periodeNumber).then((nomor) => {
          if (nomor) {
            setCurrentNumbers(nomor);
            setSpinKey((k) => k + 1);
          }
        });
      }
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [isActive, countdownTargetMs, periodeNumber, resultFetched]);

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 120_000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSpin = () => {
    setSpinKey((k) => k + 1);
  };

  const digits = currentNumbers.split("").map(Number);

  // Countdown
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!periodeEndMs || !isActive) return;
    const tick = () => {
      const diff = periodeEndMs - Date.now();
      if (diff <= 0) { setCountdown("00:00:00"); return; }
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
          <div ref={cellsRef} className="kd-slot-cells">
            {spinKey > 0 && cellH > 0 &&
              digits.map((digit, i) => (
                <div key={i} className="kd-slot-cell">
                  <SlotColumn
                    key={`${spinKey}-${i}`}
                    targetDigit={digit}
                    index={i}
                    cellH={cellH}
                  />
                </div>
              ))}
          </div>
          <div className="kd-periode">
            Periode:{" "}
            <span className="text-[#fff70c] font-semibold">{periode}</span>
          </div>
        </div>
      </div>

      {isActive && countdown && (
        <p className="text-white/80 font-montserrat text-sm">
          Tutup dalam:{" "}
          <span className="text-white/80 font-semibold">{countdown}</span>
        </p>
      )}

      {process.env.NODE_ENV === "development" && (
        <button
          onClick={handleSpin}
          className="px-10 py-3 rounded-full font-montserrat font-bold text-white text-lg uppercase tracking-wider transition-all cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #e74c3c, #c0392b)",
            boxShadow: "0 4px 20px rgba(231, 76, 60, 0.5)",
            border: "2px solid rgba(241, 196, 15, 0.3)",
          }}
        >
          SPIN
        </button>
      )}
    </div>
  );
}
