"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

interface PlayerHistoryRow {
  no: number;
  periode: number;
  idPlayer: string;
  nomor: string;
  waktu: string;
}

interface HistoryDialogProps {
  periodeNumber: number;
  keluaran: string;
  tutup: string;
}

const ITEMS_PER_PAGE = 8;

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
    return `${dd}-${mm}-${yy} ${hh}:${min}WIB`;
  } catch {
    return iso;
  }
}

export default function HistoryDialog({ periodeNumber, keluaran, tutup }: HistoryDialogProps) {
  const [page, setPage] = useState(1);
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
      interface RawHistoryItem {
        user_login?: string;
        username?: string;
        bet: number | string;
        created_at?: string;
        timestamp?: string;
      }
      const rows: PlayerHistoryRow[] = (json.data ?? []).map((item: RawHistoryItem, i: number) => ({
        no: i + 1,
        periode: periodeNumber,
        idPlayer: maskUsername(item.user_login ?? item.username ?? "player"),
        nomor: String(item.bet),
        waktu: formatWaktuWIB(item.created_at ?? item.timestamp ?? ""),
      }));
      setData(rows);
      setPage(1);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [periodeNumber]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, data.length);
  const rows = data.slice(start - 1, end);

  return (
    <Dialog onOpenChange={(open) => { if (open) fetchHistory(); }}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-semibold underline underline-offset-2"
          style={{ color: "#e8a020" }}
        >
          History Nomor Pemain
        </button>
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className="max-w-xl px-0 h-dvh rounded-none"
        style={{ background: "#372101", border: "1px solid #3d1a00" }}
      >
        {/* Header */}
        <div className="shrink-0 pt-6 pb-4" style={{ borderBottom: "1px solid #3d1a00" }}>
          <div className="flex items-start mb-3 px-2">
            <DialogClose asChild>
              <ArrowLeft
                className="flex items-center justify-center w-10 h-10 px-2 rounded-full text-white text-lg leading-none"
                style={{ border: "2px solid #3d1a00" }}
                aria-label="Kembali"
              />
            </DialogClose>
            <div className="flex-1 text-center pr-8">
              <DialogTitle asChild>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#FFEB33" }}>
                    Periode : {periodeNumber}
                  </p>
                  <p className="text-white font-bold text-base mt-0.5">
                    History tebakan nomor Pemain
                  </p>
                </div>
              </DialogTitle>
            </div>
          </div>

          <div className="flex gap-4 mt-3 font-semibold text-[10px] px-4">
            <div className="flex-1 text-center py-2 px-2 rounded-lg" style={{ background: "#1e0e00", border: "1px solid #3d1a00" }}>
              <span className="text-white">Keluaran : </span>
              <span style={{ color: "#FFEB33" }}>{keluaran}</span>
            </div>
            <div className="flex-1 text-center py-2 px-2 rounded-lg" style={{ background: "#1e0e00", border: "1px solid #3d1a00" }}>
              <span className="text-white">Tutup : </span>
              <span style={{ color: "#FFEB33" }}>{tutup}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white text-sm opacity-60">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-white text-sm opacity-60">Belum ada data</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: "#1C1101" }}>
                <tr>
                  {["#", "Periode", "ID Player", "Nomor", "Waktu"].map((h) => (
                    <th key={h} className="py-3 text-center font-semibold text-neutral-200/70">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#372101" : "#1C1101" }} className="font-semibold">
                    <td className="py-4 px-2 text-center text-white">{row.no}</td>
                    <td className="py-4 px-2 text-center text-white">{row.periode}</td>
                    <td className="py-4 px-2 text-center text-white">{row.idPlayer}</td>
                    <td className="py-4 px-2 text-center font-semibold" style={{ color: "#FFEB33" }}>{row.nomor}</td>
                    <td className="py-4 px-2 text-center text-white" style={{ fontSize: "10px" }}>{row.waktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="shrink-0 py-4 text-center" style={{ borderTop: "1px solid #3d1a00" }}>
          <p className="text-white text-xs mb-2">
            Menampilkan {data.length === 0 ? 0 : start}-{end} dari {data.length} Item
          </p>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 text-sm">
              <button onClick={() => setPage(1)} className="text-white">{"<<"}</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-white">{"<"}</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className="font-semibold" style={{ color: p === page ? "#e8a020" : "white" }}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-white">{">"}</button>
              <button onClick={() => setPage(totalPages)} className="text-white">{">>"}</button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
