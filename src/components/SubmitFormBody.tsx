"use client";

import { useState, useEffect } from "react";
import Disable from "./Icon/Disable";
import HistoryDialog from "./HistoryDialog";
import SubmitSuccess from "./SubmitSuccess";

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

export default function SubmitFormBody({ periodeId, periodeNumber, keluaran, tutup, periodeEndMs, isActive, periodeStartDisplay }: Props) {
  const [userId, setUserId] = useState("");
  const [tebakAngka, setTebakAngka] = useState("");
  const [active, setActive] = useState(() => isActive && periodeEndMs > 0 && Date.now() < periodeEndMs);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/game/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "shaggy", brand: "dewabet" }),
    })
      .then((r) => r.json())
      .then((data: { status?: boolean; data?: { username?: string } }) => {
        if (data.status && data.data?.username) setUserId(data.data.username);
      })
      .finally(() => setPlayerLoading(false));
  }, []);

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
          game: "royaldraw",
          bet: Number(tebakAngka.trim()),
          periode: periodeId,
        }),
      });
      const data = await res.json() as { status?: boolean; message?: string; error?: string };
      if (!res.ok || data.status === false) {
        setError(data.message ?? data.error ?? "Gagal submit, coba lagi.");
      } else {
        setSuccess(true);
        setUserId("");
        setTebakAngka("");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {active ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">User ID :</label>
            <input
              type="text"
              placeholder={playerLoading ? "Memuat..." : "User ID"}
              value={userId}
              readOnly
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none text-sm bg-form-input opacity-80 cursor-default"
            />
          </div>

          <div className="mb-5">
            <label className="block text-white font-semibold mb-2 text-sm">Tebak Angka :</label>
            <input
              type="text"
              placeholder="Tebak Angka Anda (2–8 digit)"
              value={tebakAngka}
              onChange={(e) => setTebakAngka(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              maxLength={8}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none text-sm bg-form-input"
            />
          </div>

          {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl font-bold text-white transition-opacity hover:opacity-90 active:scale-95 bg-gradient-orange text-shadow-md disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "SUBMIT"}
          </button>
        </form>
      ) : (
        <div className="disable-submit">
          <Disable />
          <p className="font-semibold text-sm">
            Mohon maaf saat ini <br />
            tidak bisa mengisi <br />
            Tebakan Gratis
          </p>
          <p className="text-xs italic">Silahkan kembali lagi Pukul {periodeStartDisplay}</p>
        </div>
      )}

      <div className="text-center mt-4">
        <HistoryDialog periodeNumber={periodeNumber} keluaran={keluaran} tutup={tutup} />
      </div>

      <SubmitSuccess show={success} onClose={() => setSuccess(false)} />
    </>
  );
}
