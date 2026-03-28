"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PlayerHistoryRow {
  no: number;
  periode: number;
  idPlayer: string;
  nomor: string;
  waktu: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  periodeNumber: number;
  keluaran: string;
  tutup: string;
}

function maskUsername(name: string): string {
  if (name.length <= 4) return name + "***";
  return name.slice(0, 4) + "***";
}

function formatWaktuWIB(iso: string): string {
  try {
    const d = new Date(iso);
    const wib = new Date(d.getTime() + 7 * 3600 * 1000);
    const dd = String(wib.getUTCDate()).padStart(2, "0");
    const mm = String(wib.getUTCMonth() + 1).padStart(2, "0");
    const yy = String(wib.getUTCFullYear()).slice(2);
    const hh = String(wib.getUTCHours()).padStart(2, "0");
    const min = String(wib.getUTCMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yy} ${hh}:${min}`;
  } catch {
    return iso;
  }
}

export default function PlayerGuessModal({ open, onClose, periodeNumber, keluaran, tutup }: Props) {
  const [data, setData] = useState<PlayerHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: "royal-draw" }),
      });
      const json = await res.json();
      interface RawItem {
        user_login?: string;
        username?: string;
        bet: number | string;
        created_at?: string;
        timestamp?: string;
      }
      const rows: PlayerHistoryRow[] = (json.data ?? []).map((item: RawItem, i: number) => ({
        no: i + 1,
        periode: periodeNumber,
        idPlayer: maskUsername(item.user_login ?? item.username ?? "player"),
        nomor: String(item.bet),
        waktu: formatWaktuWIB(item.created_at ?? item.timestamp ?? ""),
      }));
      setData(rows);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [periodeNumber]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-3xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
            style={{ background: "#3a0a00" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-5 pb-3 text-center">
              <button
                onClick={onClose}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
              <h2 className="text-white font-montserrat font-semibold text-lg flex items-center justify-center gap-2">
                <span>🕐</span> History tebakan nomor Pemain
              </h2>
            </div>

            {/* Info Bar */}
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              <div className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm font-montserrat" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <span className="text-gray-400">Periode: </span>
                <span className="text-yellow-400">{periodeNumber}</span>
              </div>
              <div className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm font-montserrat" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <span className="text-gray-400">Keluaran: </span>
                <span className="text-yellow-400">{keluaran}</span>
              </div>
              <div className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm font-montserrat" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <span className="text-gray-400">Tutup: </span>
                <span className="text-yellow-400">{tutup}</span>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {loading ? (
                <p className="text-center text-gray-400 py-8 font-montserrat">Loading...</p>
              ) : data.length === 0 ? (
                <p className="text-center text-gray-400 py-8 font-montserrat">Belum ada data</p>
              ) : (
                <table className="w-full text-sm font-montserrat">
                  <thead>
                    <tr className="text-center" style={{ background: "#5a1500", position: "sticky", top: 0 }}>
                      <th className="py-2 px-2 rounded-tl-lg">#</th>
                      <th className="py-2 px-2">Periode</th>
                      <th className="py-2 px-2">ID Player</th>
                      <th className="py-2 px-2">Nomor di pasang</th>
                      <th className="py-2 px-2 rounded-tr-lg">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((g) => (
                      <tr
                        key={g.no}
                        className="text-center border-b border-white/5"
                        style={{ background: g.no % 2 === 0 ? "#4a1200" : "transparent" }}
                      >
                        <td className="py-2.5 px-2 text-gray-300">{g.no}</td>
                        <td className="py-2.5 px-2 text-gray-300">{g.periode}</td>
                        <td className="py-2.5 px-2 text-gray-300">{g.idPlayer}</td>
                        <td className="py-2.5 px-2 text-yellow-400 font-semibold">{g.nomor}</td>
                        <td className="py-2.5 px-2 text-gray-300 text-xs">{g.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
