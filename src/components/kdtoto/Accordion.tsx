"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const terms = [
  "Pemain yang mengikuti promosi ini minimal wajib deposit Rp 100.000 dan memiliki 2X turnover",
  "Semua pemain KDTOTO berhak mengikuti promo tebak angka KDTOTO",
  "Tebak angka akan di umumkan setiap hari di periode jam 5 sore",
  "Hasil keluaran angka bisa di cek pada link pada saat Anda menebak angka",
  "Jika tebakan Anda sukses ada keterangan record sudah masuk pada menu form",
  "Bonus hanya berlaku untuk pemain baru dan 1 kali kesempatan",
  "Nominal hadiah bisa berubah setiap saat lebih kecil atau bahkan bisa lebih besar dari biasa-nya",
];

const tiers = [
  { deposit: "100.000", digit: "2D" },
  { deposit: "200.000", digit: "3D" },
  { deposit: "300.000", digit: "4D" },
  { deposit: "500.000", digit: "5D" },
  { deposit: "600.000", digit: "6D" },
  { deposit: "700.000", digit: "7D" },
  { deposit: "800.000", digit: "8D" },
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
        className="w-full flex items-center justify-between p-6 text-white font-montserrat font-semibold text-base sm:text-lg cursor-pointer"
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
              <ol className="space-y-2 text-neutral-100 text-sm sm:text-sm font-montserrat list-decimal pl-8 marker:text-neutral-100">
                {terms.map((term, i) => (
                  <li key={i} className="pl-8 font-semibold">{term}</li>
                ))}
              </ol>
              {/* Tier Deposit */}
              <div className="mt-5 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(241, 196, 15, 0.25)" }}>
                <div className="px-4 py-2.5" style={{ background: "rgba(241, 196, 15, 0.12)" }}>
                  <p className="text-yellow-300 font-montserrat font-bold text-sm text-center">
                    Tier Deposit Promosi Tebak Angka
                  </p>
                </div>
                <div className="divide-y divide-white/10">
                  {tiers.map((tier, i) => (
                    <div
                      key={tier.digit}
                      className="flex items-center justify-between px-4 py-2.5 font-montserrat text-sm"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent" }}
                    >
                      <span className="text-neutral-200">
                        Deposit <span className="text-white font-semibold">Rp {tier.deposit}</span>
                      </span>
                      <Image
                        src={`/images/kdtoto/${tier.digit}.png`}
                        alt={tier.digit}
                        width={40}
                        height={40}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-sm text-yellow-300 italic font-montserrat">
                *note penting pemain yang menang dalam promo ini yang berlaku sudah pernah deposit di KDTOTO
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
