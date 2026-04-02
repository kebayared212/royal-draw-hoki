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
            className="relative w-full max-w-lg max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
            style={{ background: "#3a0a00" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <h2 className="text-white font-montserrat font-semibold text-base">
                History Tebakan
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info Bar */}
            <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
              <div className="px-2.5 py-2 rounded-lg text-center" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <p className="text-[10px] text-neutral-400 font-montserrat">Periode</p>
                <p className="text-yellow-400 font-montserrat font-semibold text-sm">{periodeNumber}</p>
              </div>
              <div className="px-2.5 py-2 rounded-lg text-center" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <p className="text-[10px] text-neutral-400 font-montserrat">Keluaran</p>
                <p className="text-yellow-400 font-montserrat font-semibold text-sm">{keluaran}</p>
              </div>
              <div className="px-2.5 py-2 rounded-lg text-center" style={{ background: "#5a1500", border: "1px solid rgba(241,196,15,0.15)" }}>
                <p className="text-[10px] text-neutral-400 font-montserrat">Tutup</p>
                <p className="text-yellow-400 font-montserrat font-semibold text-sm">{tutup}</p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {loading ? (
                <p className="text-center text-neutral-400 py-8 font-montserrat text-sm">Loading...</p>
              ) : data.length === 0 ? (
                <p className="text-center text-neutral-400 py-8 font-montserrat text-sm">Belum ada data</p>
              ) : (
                <div className="space-y-2">
                  {data.map((g) => (
                    <div
                      key={g.no}
                      className="rounded-lg px-3 py-2.5 flex items-center gap-3"
                      style={{ background: g.no % 2 === 0 ? "#4a1200" : "#521400" }}
                    >
                      {/* Number badge */}
                      <div
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "rgba(241,196,15,0.15)", color: "#f1c40f" }}
                      >
                        {g.no}
                      </div>
                      {/* Player & time */}
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-100 font-montserrat text-sm truncate">{g.idPlayer}</p>
                        <p className="text-neutral-500 font-montserrat text-[11px]">{g.waktu}</p>
                      </div>
                      {/* Nomor pasang */}
                      <div className="shrink-0 text-right">
                        <p className="text-yellow-400 font-montserrat font-bold text-base tracking-wider">{g.nomor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
