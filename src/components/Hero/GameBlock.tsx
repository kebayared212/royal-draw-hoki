"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useAudioManager } from "@/components/AudioManager";

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES;

function SlotDigit({ digit, index, startDelay }: { digit: string; index: number; startDelay: number }) {
  const strip = [
    digit,
    ...Array.from({ length: STRIP_LENGTH }, (_, i) => String(i % 10)),
  ];

  const startPct = -(STRIP_LENGTH / strip.length) * 100;
  const startY  = `${startPct}%`;
  const midY    = `${startPct * 0.1}%`;
  const finalY  = "0%";

  return (
    <div
      style={{ height: "clamp(20px, 5.9vw, 34px)", overflow: "hidden" }}
      className="w-auto"
    >
      <motion.div
        initial={{ y: startY, filter: "blur(2px)" }}
        animate={{
          y:      [startY,       midY,       finalY],
          filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
        }}
        transition={{
          delay: startDelay,
          duration: 2.2 + index * 0.5,
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

export default function GameBlock({ numbers, spinKey = 0 }: { numbers: string; spinKey?: number }) {
  const { playRoller, playLanding, audioStarted } = useAudioManager();

  // localKey = -1 berarti belum siap (menunggu user gesture via WelcomeDialog)
  const localKey = spinKey === 0 ? (audioStarted ? 0 : -1) : spinKey;

  useEffect(() => {
    if (localKey < 0) return;
    const duration = 2.2 + (numbers.length - 1) * 0.5 + 0.3;

    const rollerTimer = setTimeout(() => playRoller(duration), 0);
    const landingTimers = numbers.split("").map((_, i) =>
      setTimeout(() => playLanding(0), (2.2 + i * 0.5) * 1000)
    );

    return () => {
      clearTimeout(rollerTimer);
      landingTimers.forEach(clearTimeout);
    };
  }, [localKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sebelum user klik dialog, tampilkan angka statik tanpa animasi
  if (localKey < 0) {
    return (
      <div className="absolute w-full flex flex-col justify-center top-35 z-30">
        <div className="flex justify-center relative">
          <Image src="/images/game-text.png" alt="Game Text" width={1080} height={564} className="w-full h-auto max-w-50 shadow-2xl relative z-10" />
          <div className="flex justify-center z-20 absolute top-4.5 right-1/2 translate-x-1/2">
            <Image src="/images/angka-hoki-text.png" alt="Angka Hoki" width={1080} height={564} className="w-full h-auto max-w-36" />
          </div>
        </div>
        <div className="relative z-40 top-1/2 -translate-y-5 flex justify-center">
          <Image src="/images/result-frame.png" alt="" width={480} height={360} className="w-full h-auto max-w-98 mb-4" />
          <div className="absolute flex w-full h-full items-center justify-evenly px-[7%] -top-2.5">
            {numbers.split("").map((digit, i) => (
              <div key={i} style={{ height: "clamp(20px, 5.9vw, 34px)", overflow: "hidden" }} className="w-auto">
                <Image src={`/images/number/${digit}.png`} alt={digit} width={480} height={480} className="w-auto" style={{ height: "clamp(20px, 5.9vw, 34px)", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const startDelay = 0;

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
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 70%)",
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
              key={`${spinKey}-${numbers}-${i}`}
              digit={digit}
              index={i}
              startDelay={startDelay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
