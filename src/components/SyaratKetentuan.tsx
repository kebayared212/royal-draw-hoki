"use client";

import { useState } from "react";

export default function SyaratKetentuan() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-2 rounded-2xl text-white bg-gradient-orange"
      >
        <span>Syarat &amp; Ketentuan Promo</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="mt-2 p-4 rounded-2xl text-gray-300 text-sm leading-6"
          style={{ background: "#2a1200", border: "1px solid #3d1a00" }}
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Promo berlaku untuk semua member aktif.</li>
            <li>Hadiah akan dikreditkan setelah verifikasi.</li>
            <li>Satu User ID hanya dapat submit satu nomor per periode.</li>
            <li>Nomor yang sudah di-submit tidak dapat diubah.</li>
            <li>
              Keputusan manajemen bersifat final dan tidak dapat diganggu gugat.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
