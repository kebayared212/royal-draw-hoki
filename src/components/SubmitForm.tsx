"use client";

import { useState, useEffect } from "react";
import Disable from "./Icon/Disable";
import HistoryDialog from "./HistoryDialog";

// TODO: ganti dengan data asli dari API/props
const DUMMY_HISTORY = [
  { periode: 20240301, tanggal: "01/03/2024", nomor: "4 2 7" },
  { periode: 20240302, tanggal: "02/03/2024", nomor: "1 9 3" },
  { periode: 20240303, tanggal: "03/03/2024", nomor: "8 5 0" },
];

const ACTIVE_START = 19; // 19:00 WIB
const ACTIVE_END = 16; // 16:00 WIB (next day)

function isActiveNow() {
  const now = new Date();
  // Convert to WIB (UTC+7)
  const wibHour = new Date(now.getTime() + 7 * 60 * 60 * 1000).getUTCHours();
  // Active: 19:00 – 23:59 dan 00:00 – 15:59
  return wibHour >= ACTIVE_START || wibHour < ACTIVE_END;
}

export default function SubmitForm() {
  const [userId, setUserId] = useState("");
  const [tebakAngka, setTebakAngka] = useState("");
  const [active, setActive] = useState(isActiveNow);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setActive(isActiveNow()), 60_000);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: handle submission
  }

  return (
    <div className="mx-4 mb-4 rounded-2xl p-5 submit-form">
      {/* jika aktif */}
      {active && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">
              User ID :
            </label>
            <input
              type="text"
              placeholder="User ID Anda"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none text-sm bg-form-input"
            />
          </div>

          <div className="mb-5">
            <label className="block text-white font-semibold mb-2 text-sm">
              Tebak Angka :
            </label>
            <input
              type="text"
              placeholder="Tebak Angka Anda"
              value={tebakAngka}
              onChange={(e) => setTebakAngka(e.target.value)}
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none text-sm bg-form-input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl font-bold text-white transition-opacity hover:opacity-90 active:scale-95 bg-gradient-orange text-shadow-md"
          >
            SUBMIT
          </button>
        </form>
      )}
      {/* jika non-aktif */}
      {!active && (
        <div className="disable-submit">
          <Disable />
          <p className="font-semibold text-sm">
            {" "}
            Mohon maaf saat ini <br />
            tidak bisa mengisi <br />
            Tebakan Gratis
          </p>
          <p className="text-xs italic">
            Silahkan kembali lagi Pukul 18:00 WIB
          </p>
        </div>
      )}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="text-sm font-semibold underline underline-offset-2"
          style={{ color: "#e8a020" }}
        >
          History Nomor Pemain
        </button>
      </div>

      <HistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        data={DUMMY_HISTORY}
      />
    </div>
  );
}
