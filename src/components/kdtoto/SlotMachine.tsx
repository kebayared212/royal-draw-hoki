"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import SlotColumn from "./SlotColumn";
import SoundToggle from "./SoundToggle";
import { useKdReady } from "./KdReadyContext";
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

// ---- Sound engine (Web Audio API) ----
function useKdSound() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const rollerBufRef = useRef<AudioBuffer | null>(null);
  const landingBufsRef = useRef<(AudioBuffer | null)[]>(new Array(8).fill(null));
  const rollerNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  // Preload audio
  useEffect(() => {
    async function loadBuf(url: string) {
      const ctx = getCtx();
      const res = await fetch(url);
      const arr = await res.arrayBuffer();
      return ctx.decodeAudioData(arr);
    }
    loadBuf("/audio/spin_reels.WAV").then((b) => { rollerBufRef.current = b; }).catch(() => {});
    for (let i = 0; i < 8; i++) {
      loadBuf(`/audio/${i + 1}.wav`).then((b) => { landingBufsRef.current[i] = b; }).catch(() => {});
    }
  }, [getCtx]);

  const playRoller = useCallback((duration: number) => {
    if (muted) return;
    const ctx = getCtx();
    const buf = rollerBufRef.current;
    if (!buf) return;
    const run = () => {
      try { rollerNodeRef.current?.stop(); } catch { /* ok */ }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.7, ctx.currentTime + duration - 0.4);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      gain.connect(ctx.destination);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(gain);
      src.start(ctx.currentTime);
      src.stop(ctx.currentTime + duration);
      rollerNodeRef.current = src;
    };
    if (ctx.state === "suspended") ctx.resume().then(run).catch(() => {}); else run();
  }, [muted, getCtx]);

  const playLanding = useCallback((digitIndex: number) => {
    if (muted) return;
    const ctx = getCtx();
    const buf = landingBufsRef.current[Math.min(digitIndex, 7)];
    if (!buf) return;
    const run = () => {
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      gain.connect(ctx.destination);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(gain);
      src.start(ctx.currentTime);
    };
    if (ctx.state === "suspended") ctx.resume().then(run).catch(() => {}); else run();
  }, [muted, getCtx]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMute, playRoller, playLanding };
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
  const { muted, toggleMute, playRoller, playLanding } = useKdSound();
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

  // Sound effects per spin — same pattern as GameBlock
  useEffect(() => {
    if (spinKey <= 0) return;
    const digits = currentNumbers.split("");
    const totalDuration = 2.2 + (digits.length - 1) * 0.5 + 0.3;

    const rollerTimer = setTimeout(() => playRoller(totalDuration), 0);
    const landingTimers = digits.map((_, i) =>
      setTimeout(() => playLanding(i), (2.2 + i * 0.5) * 1000),
    );
    return () => {
      clearTimeout(rollerTimer);
      landingTimers.forEach(clearTimeout);
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
        <p className="text-white/60 font-montserrat text-sm">
          Tutup dalam:{" "}
          <span className="text-[#fff70c] font-semibold">{countdown}</span>
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
