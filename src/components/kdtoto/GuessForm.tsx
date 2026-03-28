"use client";

import { useState, useEffect } from "react";
import PlayerGuessModal from "./PlayerGuessModal";

const TIER_MAP: Record<number, string> = {
  2: "bronze", 3: "silver", 4: "gold",
  5: "platinum", 6: "diamond", 7: "master", 8: "legend",
};

interface Props {
  periodeId: string;
  periodeNumber: number;
  keluaran: string;
  tutup: string;
  periodeEndMs: number;
  isActive: boolean;
  periodeStartDisplay: string;
}

export default function KdtotoGuessForm({
  periodeId,
  periodeNumber,
  keluaran,
  tutup,
  periodeEndMs,
  isActive,
  periodeStartDisplay,
}: Props) {
  const [userId, setUserId] = useState("");
  const [tebakAngka, setTebakAngka] = useState("");
  const [active, setActive] = useState(() => isActive && periodeEndMs > 0 && Date.now() < periodeEndMs);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyBet, setAlreadyBet] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch player data
  useEffect(() => {
    fetch("/api/game/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "shaggy", brand: "dewabet" }),
    })
      .then((r) => r.json())
      .then((data: { status?: boolean; data?: { username?: string }; history?: { bet: string; periode: string; game: string }[] }) => {
        if (data.status && data.data?.username) setUserId(data.data.username);
        const entry = (data.history ?? []).find(
          (h) => h.periode === String(periodeNumber) && h.game === "royal-draw"
        );
        if (entry) setAlreadyBet(entry.bet);
      })
      .finally(() => setPlayerLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Active period check
  useEffect(() => {
    if (!periodeEndMs || !isActive) return;
    const interval = setInterval(() => {
      const nowActive = Date.now() < periodeEndMs;
      setActive(nowActive);
      if (!nowActive) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [periodeEndMs, isActive]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const digits = tebakAngka.trim().length;
    if (!userId.trim()) { setError("User ID belum termuat, coba refresh."); return; }
    if (digits < 2 || digits > 8) { setError("Tebak angka harus 2-8 digit"); return; }

    const tier = TIER_MAP[digits];
    setLoading(true);
    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userId.trim(),
          brand: "dewabet",
          tier,
          game: "royal-draw",
          bet: Number(tebakAngka.trim()),
          periode: periodeId,
        }),
      });
      const data = await res.json() as { status?: boolean; message?: string; error?: string };
      if (!res.ok || data.status === false) {
        setError(data.message ?? data.error ?? "Gagal submit, coba lagi.");
      } else {
        setMessage("Tebakan berhasil disimpan!");
        setAlreadyBet(tebakAngka.trim());
        setTebakAngka("");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  // Closed view
  if (!active) {
    return (
      <div
        className="rounded-xl p-6 flex-1 flex flex-col items-center justify-center gap-4 min-h-[200px]"
        style={{
          background: "#2d2d2d",
          border: "1px solid rgba(241, 196, 15, 0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">⛔</span>
          <div className="text-white font-montserrat">
            <p className="font-semibold text-lg leading-tight">Mohon Maaf Saat ini</p>
            <p className="font-semibold text-lg leading-tight">Tidak bisa mengisi</p>
            <p className="font-semibold text-lg leading-tight">Tebakan Gratis</p>
          </div>
        </div>
        <p className="text-yellow-400 font-montserrat text-sm italic">
          !Silakan kembali lagi Pukul {periodeStartDisplay}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="text-[#fff70c] text-sm font-montserrat hover:text-yellow-400 transition-colors underline cursor-pointer"
        >
          History Nomor Pemain
        </button>
        <PlayerGuessModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          periodeNumber={periodeNumber}
          keluaran={keluaran}
          tutup={tutup}
        />
      </div>
    );
  }

  // Already bet view
  if (alreadyBet) {
    return (
      <div
        className="rounded-xl p-5 flex-1"
        style={{
          background: "#7f1f00",
          border: "1px solid rgba(241, 196, 15, 0.3)",
        }}
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="font-semibold text-sm text-white text-center font-montserrat">
            Kamu sudah menebak untuk periode ini
          </p>
          <div
            className="w-full rounded-lg px-4 py-3 text-center"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(241,196,15,0.2)" }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-montserrat">Tebakan Kamu</p>
            <p className="font-black text-2xl tracking-widest font-jomhuria" style={{ color: "#fff70c" }}>
              {alreadyBet}
            </p>
          </div>
          <p className="text-white/40 text-xs text-center italic font-montserrat">
            Tunggu hasil keluaran untuk mengetahui hasilnya
          </p>
        </div>
        <div className="text-center mt-3">
          <button
            onClick={() => setModalOpen(true)}
            className="text-[#fff70c] text-sm font-montserrat hover:text-yellow-400 transition-colors underline cursor-pointer"
          >
            History Nomor Pemain
          </button>
        </div>
        <PlayerGuessModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          periodeNumber={periodeNumber}
          keluaran={keluaran}
          tutup={tutup}
        />
      </div>
    );
  }

  // Open form
  return (
    <div
      className="rounded-xl p-5 flex-1"
      style={{
        background: "#7f1f00",
        border: "1px solid rgba(241, 196, 15, 0.3)",
      }}
    >
      <h3 className="text-white font-montserrat font-semibold text-lg mb-4">
        Pasang Angka
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-white font-montserrat text-sm">User ID :</label>
        <input
          type="text"
          placeholder={playerLoading ? "Memuat..." : "User ID"}
          value={userId}
          readOnly
          className="w-full px-4 py-3 rounded-lg text-white placeholder-[#923c21] font-montserrat outline-none text-sm opacity-80 cursor-default"
          style={{ background: "#471100", border: "1px solid rgba(241, 196, 15, 0.2)" }}
        />
        <label className="text-white font-montserrat text-sm">Tebak Angka Anda :</label>
        <input
          type="text"
          value={tebakAngka}
          onChange={(e) => setTebakAngka(e.target.value.replace(/\D/g, ""))}
          placeholder="Tebak Angka Anda (2-8 digit)"
          inputMode="numeric"
          maxLength={8}
          className="w-full px-4 py-3 rounded-lg text-white placeholder-[#923c21] font-montserrat outline-none text-sm focus:ring-2 focus:ring-yellow-500/50 transition-all"
          style={{ background: "#471100", border: "1px solid rgba(241, 196, 15, 0.2)" }}
        />

        {error && <p className="text-red-400 text-xs font-montserrat">{error}</p>}
        {message && <p className="text-green-400 text-xs font-montserrat">{message}</p>}

        <div className="flex items-center gap-3 justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg font-montserrat font-bold text-neutral-800 uppercase tracking-wide transition-all disabled:opacity-50 cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #fff70c, #f9e547)",
              boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
            }}
          >
            {loading ? "Mengirim..." : "SUBMIT"}
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-[#fff70c] text-sm font-montserrat hover:text-yellow-400 transition-colors underline cursor-pointer"
          >
            History Nomor Pemain
          </button>
        </div>
      </form>
      <PlayerGuessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        periodeNumber={periodeNumber}
        keluaran={keluaran}
        tutup={tutup}
      />
    </div>
  );
}
