"use client";

import { useEffect } from "react";
import HistoryTable from "./HistoryTable";

interface HistoryRow {
  periode: number;
  tanggal: string;
  nomor: string;
}

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  data: HistoryRow[];
}

export default function HistoryDialog({ open, onClose, data }: HistoryDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl pb-6 overflow-hidden"
        style={{ background: "#120800", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #3d1a00" }}
        >
          <span className="text-white font-bold text-base">
            History Nomor Pemain
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="pt-2">
          <HistoryTable data={data} />
        </div>
      </div>
    </div>
  );
}
