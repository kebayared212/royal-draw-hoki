"use client";

import { useState } from "react";

export default function SyaratKetentuan() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-white bg-gradient-orange"
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
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Minimal Deposit &amp; Turnover:</strong> Kamu wajib deposit minimal Rp 100.000 dan memiliki 2X turnover (total taruhan).</li>
            <li><strong>Siapa yang Bisa Ikut:</strong> Semua pemain LOREM berhak mengikuti promo tebak angka ini.</li>
            <li><strong>Waktu Pengumuman:</strong> Angka yang keluar akan diumumkan setiap hari.</li>
            <li><strong>Cek Hasil:</strong> Hasil keluaran angka bisa dilihat di link yang tersedia saat kamu melakukan tebakan.</li>
            <li><strong>Konfirmasi Tebakan:</strong> Jika tebakan berhasil, akan muncul keterangan di menu record atau form.</li>
            <li><strong>Batasan Bonus:</strong> Bonus ini hanya berlaku untuk pemain baru dan hanya diberikan 1 kali kesempatan.</li>
            <li><strong>Nominal Hadiah:</strong> Jumlah hadiah tidak tetap, bisa berubah sewaktu-waktu (bisa lebih kecil atau lebih besar).</li>
            <li><strong>Catatan Penting:</strong> Pemain yang menang dalam promo ini haruslah mereka yang sudah pernah melakukan deposit sebelumnya di Lorem.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
