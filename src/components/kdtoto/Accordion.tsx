"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const terms = [
  "Pemain yang mengikuti promo ini minimal wajib deposit Rp 100.000 dan memiliki 2X turnover",
  "Semua pemain KDTOTO berhak mengikuti promo tebak angka KDTOTO",
  "Tebak angka akan di umumkan setiap hari di periode jam 5 sore",
  "Hasil keluaran angka bisa di cek pada link pada saat Anda menebak angka",
  "Jika tebakan Anda sukses ada keterangan record sudah masuk pada menu from",
  "Bonus hanya berlaku untuk pemain baru dan 1 kali kesempatan",
  "Nominal hadiah bisa berubah setiap saat lebih kecil atau bahkan bisa lebih besar dari biasa-nya",
];

export default function KdtotoAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: "#7f1f00",
        border: "1px solid rgba(241, 196, 15, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-white font-montserrat font-semibold text-base sm:text-lg cursor-pointer"
      >
        <span>Syarat & Ketentuan</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f1c40f"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm sm:text-base font-montserrat">
                {terms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-yellow-500 italic font-montserrat">
                *note penting pemain yang menang dalam promo ini yang berlaku sudah pernah deposit di KDTOTO
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
