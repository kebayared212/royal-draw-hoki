"use client";

import Image from "next/image";
import { motion } from "motion/react";

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES; // 30 items before target

function SlotDigit({ digit, index }: { digit: string; index: number }) {
  // Target di index 0 (atas), spinning digits di bawah
  // Strip bergerak dari y negatif → 0 = turun ke bawah = angka masuk dari atas
  const strip = [
    digit,
    ...Array.from({ length: STRIP_LENGTH }, (_, i) => String(i % 10)),
  ];

  const startPct = -(STRIP_LENGTH / strip.length) * 100; // ≈ -96.77%
  const startY  = `${startPct}%`;
  const midY    = `${startPct * 0.1}%`; // 90% jarak sudah ditempuh, sisa 10% untuk snap
  const finalY  = "0%";

  return (
    <div
      style={{ height: "clamp(20px, 5.9vw, 34px)", overflow: "hidden" }}
      className="w-auto"
    >
      <motion.div
        initial={{ y: startY, filter: "blur(2px)" }}
        animate={{
          y:      [startY,       midY,          finalY],
          filter: ["blur(2px)", "blur(2px)",   "blur(0px)"],
        }}
        transition={{
          delay: 0,
          duration: 1.4 + index * 0.3,
          times: [0, 0.88, 1],
          ease: ["linear", [0.1, 0, 0.2, 1]],
        }}
      >
        {strip.map((d, i) => (
          <Image
            key={i}
            src={`/images/number/${d}.png`}
            alt={d}
            width={480}
            height={480}
            className="w-auto"
            style={{ height: "clamp(20px, 5.9vw, 34px)", display: "block" }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function GameBlock({ numbers }: { numbers: string }) {
  return (
    <div className="absolute w-full flex flex-col justify-center top-35 z-30">
      {/* game text */}
      <div className="flex justify-center relative">
        <Image
          src="/images/game-text.png"
          alt="Game Text"
          width={1080}
          height={564}
          className="w-full h-auto max-w-50 shadow-2xl relative z-10"
        />
        <div className="flex justify-center z-20 absolute top-4.5 right-1/2 translate-x-1/2">
          <Image
            src="/images/angka-hoki-text.png"
            alt="Angka Hoki"
            width={1080}
            height={564}
            className="w-full h-auto max-w-36"
          />
        </div>
        <div
          className="absolute w-full max-w-64 h-28 -top-8 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* result */}
      <div className="relative z-40 top-1/2 -translate-y-5 flex justify-center">
        <Image
          src="/images/result-frame.png"
          alt=""
          width={480}
          height={360}
          className="w-full h-auto max-w-98 mb-4"
        />
        <div className="absolute flex w-full h-full items-center justify-evenly px-[7%] -top-2.5">
          {numbers.split("").map((digit, i) => (
            <SlotDigit
              key={`${numbers}-${i}`}
              digit={digit}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
