"use client";

import { useState, useEffect } from "react";
import Disable from "./Icon/Disable";
import HistoryDialog from "./HistoryDialog";
import SubmitSuccess from "./SubmitSuccess";

const ACTIVE_START = 19;
const ACTIVE_END = 16;

const TIER_MAP: Record<number, string> = {
  2: "bronze", 3: "silver", 4: "gold",
  5: "platinum", 6: "diamond", 7: "master", 8: "legend",
};

function isActiveNow() {
  const now = new Date();
  const wibHour = new Date(now.getTime() + 7 * 60 * 60 * 1000).getUTCHours();
  return wibHour >= ACTIVE_START || wibHour < ACTIVE_END;
}

interface SubmitFormProps {
  periodeId: string;
  periodeNumber: number;
  keluaran: string;
  tutup: string;
}

export default function SubmitForm({ periodeId, periodeNumber, keluaran, tutup }: SubmitFormProps) {
  const [userId, setUserId] = useState("");
  const [tebakAngka, setTebakAngka] = useState("");
  const [active, setActive] = useState(isActiveNow);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setActive(isActiveNow()), 60_000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const digits = tebakAngka.trim().length;
    if (!userId.trim()) { setError("User ID tidak boleh kosong"); return; }
    if (digits < 2 || digits > 8) { setError("Tebak angka harus 2–8 digit"); return; }

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
      const data = await res.json();
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
    <div className="mx-4 mb-4 rounded-2xl p-5 submit-form">
      {active && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">User ID :</label>
            <input
              type="text"
              placeholder="User ID Anda"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none text-sm bg-form-input"
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

          {error && (
            <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl font-bold text-white transition-opacity hover:opacity-90 active:scale-95 bg-gradient-orange text-shadow-md disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "SUBMIT"}
          </button>
        </form>
      )}

      {!active && (
        <div className="disable-submit">
          <Disable />
          <p className="font-semibold text-sm">
            Mohon maaf saat ini <br />
            tidak bisa mengisi <br />
            Tebakan Gratis
          </p>
          <p className="text-xs italic">Silahkan kembali lagi Pukul 18:00 WIB</p>
        </div>
      )}

      <div className="text-center mt-4">
        <HistoryDialog
          periodeNumber={periodeNumber}
          keluaran={keluaran}
          tutup={tutup}
        />
      </div>

      <SubmitSuccess show={success} onClose={() => setSuccess(false)} />
    </div>
  );
}
