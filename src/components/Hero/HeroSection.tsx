"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Balls from "./Balls";
import DiamondBlock from "./DiamondBlock";
const ResultNotification = dynamic(() => import("@/components/ResultNotification"), { ssr: false });
const DevPreview = dynamic(() => import("./DevPreview"), { ssr: false });

const GameBlock = dynamic(() => import("./GameBlock"), { ssr: false });

interface PrizeInfo {
  type: string;
  prize: string;
}

interface HeroSectionProps {
  numbers: string;
  periode: string;
  countdownTargetMs: number;  // result_time (ms) jika aktif, periode_start jika upcoming
  periodeEndMs: number;       // batas akhir tebakan (periode_end)
  periodeNumber: string;
  resultPeriodeNumber: string;
  isActive: boolean;
  prizes: PrizeInfo[];
}


const NOTCH_BG = "#0e0700";

function FlipCard({ value }: { value: string }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: "clamp(46px, 13vw, 64px)",
        height: "clamp(38px, 10.5vw, 54px)",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(250,184,97,0.25), 0 2px 6px rgba(0,0,0,0.6)",
        border: "1px solid rgba(250,184,97,0.35)",
      }}
    >
      {/* Card */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #2a1200 0%, #0e0600 100%)",
          borderRadius: 7,
        }}
      >
        <span
          className="font-black select-none tabular-nums"
          style={{
            fontSize: "clamp(20px, 5.5vw, 30px)",
            color: "#FFEB33",
            lineHeight: 1,
            textShadow: "0 0 8px rgba(255,235,51,0.7)",
          }}
        >
          {value}
        </span>
      </div>
      {/* Left notch */}
      <div
        className="absolute rounded-full"
        style={{
          width: 7,
          height: 7,
          background: NOTCH_BG,
          left: -3.5,
          top: "50%",
          transform: "translateY(-50%)",
          border: "1px solid rgba(250,184,97,0.2)",
        }}
      />
      {/* Right notch */}
      <div
        className="absolute rounded-full"
        style={{
          width: 7,
          height: 7,
          background: NOTCH_BG,
          right: -3.5,
          top: "50%",
          transform: "translateY(-50%)",
          border: "1px solid rgba(250,184,97,0.2)",
        }}
      />
    </div>
  );
}

function DigitPair({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <FlipCard value={String(value).padStart(2, "0")} />
      <span
        className="font-bold uppercase tracking-widest"
        style={{ fontSize: "8px", color: "#FAB861", opacity: 0.7 }}
      >
        {label}
      </span>
    </div>
  );
}

const PHASE_LABEL: Record<string, string> = {
  tutup:    "✦ Tutup Tebakan ✦",
  hasil:    "✦ Menunggu Hasil ✦",
  upcoming: "✦ Periode Berikutnya ✦",
};

function CountdownDisplay({ remaining, phase }: { remaining: number; phase: string }) {
  const total = Math.max(0, Math.floor(remaining / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return (
    <div
      className="mt-3 rounded-2xl px-5 py-3"
      style={{
        background: "linear-gradient(180deg, #1a0c00 0%, #0e0700 100%)",
        border: "1px solid rgba(250,184,97,0.25)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(250,184,97,0.1)",
      }}
    >
      <p
        className="text-center font-bold uppercase tracking-widest mb-3"
        style={{ fontSize: "9px", color: "#FAB861", opacity: 0.7 }}
      >
        {PHASE_LABEL[phase] ?? PHASE_LABEL.hasil}
      </p>
      <div className="flex items-center justify-center gap-2">
        <DigitPair value={h} label="jam" />
        <span
          className="font-black mb-4"
          style={{ fontSize: "clamp(16px, 4.5vw, 22px)", color: "#FAB861", opacity: 0.5 }}
        >
          :
        </span>
        <DigitPair value={m} label="menit" />
        <span
          className="font-black mb-4"
          style={{ fontSize: "clamp(16px, 4.5vw, 22px)", color: "#FAB861", opacity: 0.5 }}
        >
          :
        </span>
        <DigitPair value={s} label="detik" />
      </div>
    </div>
  );
}

async function fetchResultWithRetry(
  periodeNumber: string,
  maxRetries: number,
  delayMs: number,
  onResult: (nomor: string) => void,
  onDone: () => void
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, delayMs));
    try {
      const res = await fetch(`/api/game/result?periode=${periodeNumber}`);
      const data = await res.json() as { nomor: string | null };
      if (data.nomor) {
        onResult(data.nomor);
        break;
      }
    } catch { /* lanjut retry */ }
  }
  onDone();
}

interface NotifState {
  show: boolean;
  status: "win" | "lose" | "no_bet";
  bet: string;
  result: string;
  prize: string;
}

export default function HeroSection({ numbers, periode, countdownTargetMs, periodeEndMs, periodeNumber, resultPeriodeNumber, isActive, prizes }: HeroSectionProps) {
  const router = useRouter();
  const [spinKey, setSpinKey] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [phase, setPhase] = useState("upcoming");
  const [currentNumbers, setCurrentNumbers] = useState(numbers);
  const [notif, setNotif] = useState<NotifState>({ show: false, status: "no_bet", bet: "", result: "", prize: "" });
  const pendingNomorRef = useRef<string | null>(null);

  const NOTIF_KEY = `notif-shown-${periodeNumber}`;

  const fetchAndShowNotif = async (nomor: string, targetPeriode: string) => {
    if (localStorage.getItem(NOTIF_KEY) === targetPeriode) return;
    try {
      const res = await fetch("/api/game/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "shaggy", brand: "dewabet" }),
      });
      const data = await res.json() as {
        history?: { tier: string; bet: string; status: string; periode: string; game: string }[];
      };

      const entry = (data.history ?? []).find(
        (h) => h.periode === targetPeriode && h.game === "royal-draw"
      );

      if (!entry) {
        setNotif({ show: true, status: "no_bet", bet: "", result: nomor, prize: "" });
      } else {
        const status = nomor.endsWith(entry.bet) ? "win" : "lose";
        const prizeType = `${entry.bet.length}D`;
        const prizeStr = status === "win" ? (prizes.find((p) => p.type === prizeType)?.prize ?? "") : "";
        setNotif({ show: true, status, bet: entry.bet, result: nomor, prize: prizeStr });
      }
      localStorage.setItem(NOTIF_KEY, targetPeriode);
    } catch { /* jika gagal fetch, tidak tampilkan notif */ }
  };

  const showNotifAfterAnimation = (nomor: string) => {
    const animMs = (2.2 + (nomor.length - 1) * 0.5 + 0.8) * 1000;
    setTimeout(() => fetchAndShowNotif(nomor, String(periodeNumber)), animMs);
  };

  // Cek notifikasi saat halaman dibuka & result sudah keluar
  useEffect(() => {
    if (!isActive || !periodeEndMs) return;
    const now = Date.now();
    const resultAlreadyOut = now >= periodeEndMs && now >= countdownTargetMs;
    if (!resultAlreadyOut) return;
    // Result sudah keluar — cek apakah numbers bukan placeholder
    if (!numbers || numbers === "00000000") return;
    const t = setTimeout(() => fetchAndShowNotif(numbers, String(periodeNumber)), 500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!countdownTargetMs) return;

    const tick = () => {
      const now = Date.now();
      const isTutup = isActive && periodeEndMs > 0 && now < periodeEndMs;
      const isHasil = isActive && (!periodeEndMs || now >= periodeEndMs);

      const target = isTutup ? periodeEndMs : countdownTargetMs;
      const left = Math.max(0, target - now);

      setPhase(isTutup ? "tutup" : isHasil ? "hasil" : "upcoming");
      setRemaining(left);

      // Upcoming selesai → refresh untuk dapat data active dari server
      if (!isActive && left === 0) {
        clearInterval(id);
        router.refresh();
        return;
      }

      // Trigger animasi hanya saat result_time tercapai
      if (isHasil && left === 0) {
        clearInterval(id);
        fetchResultWithRetry(
          periodeNumber, 5, 3000,
          (nomor) => {
            setCurrentNumbers(nomor);
            pendingNomorRef.current = nomor;
          },
          () => {
            setSpinKey((k) => k + 1);
            if (pendingNomorRef.current) {
              showNotifAfterAnimation(pendingNomorRef.current);
              pendingNomorRef.current = null;
            }
          }
        );
      }
    };

    const id = setInterval(tick, 1000);
    const initId = setTimeout(tick, 0);

    return () => { clearTimeout(initId); clearInterval(id); };
  }, [countdownTargetMs, periodeEndMs, periodeNumber, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling: re-fetch data periode setiap 2 menit (admin bisa ubah jam sewaktu-waktu)
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <div className="relative">
      <ResultNotification
        {...notif}
        onClose={() => setNotif((n) => ({ ...n, show: false }))}
      />

      <DevPreview
        onWin={() => setNotif({ show: true, status: "win", bet: "1234", result: "56781234", prize: prizes.find((p) => p.type === "4D")?.prize ?? "10 Juta" })}
        onLose={() => setNotif({ show: true, status: "lose", bet: "9999", result: "56781234", prize: "" })}
        onNoBet={() => setNotif({ show: true, status: "no_bet", bet: "", result: "56781234", prize: "" })}
      />

      {/* Radial rays */}
      <div
        className="absolute inset-x-0 top-0 h-[150%] pointer-events-none radial-rays -z-10"
        style={{
          maskImage:
            "radial-gradient(ellipse 100% 85% at 50% 0%, black 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 85% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      <div
        className="circle-bg pointer-events-none -z-10"
        style={{ top: "-181px", left: "51%" }}
      />

      <div className="relative mx-3 pt-10">
        <Balls />
        <GameBlock numbers={currentNumbers} spinKey={spinKey} />
        <DiamondBlock />
        <div
          className="relative z-20 flex flex-col items-center"
          style={{ marginTop: "clamp(-60px, -16.5%, -40px)" }}
        >
          <div className="relative">
            <Image
              src="/images/periode.png"
              alt="Periode"
              width={240}
              height={49}
              style={{ width: "min(270px, 72vw)", height: "auto" }}
            />
            <div className="absolute inset-0 flex items-center justify-center -top-3">
              <p
                className="text-white font-semibold"
                style={{ fontSize: "clamp(9px, 2.8vw, 13px)" }}
              >
                Periode :{" "}
                <span className="font-bold" style={{ color: "#fde047" }}>
                  {resultPeriodeNumber || periodeNumber || periode || "-"}
                </span>
              </p>
            </div>
          </div>

          <CountdownDisplay remaining={remaining} phase={phase} />
        </div>
      </div>
    </div>
  );
}
