"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useAudioManager } from "@/components/AudioManager";

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES;

const DIGIT_H = "clamp(14px, 4.8vw, 34px)";

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
    <div style={{ height: DIGIT_H, overflow: "hidden" }} className="w-auto">
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
            style={{ height: DIGIT_H, display: "block" }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function StaticPlaceholder({ count }: { count: number }) {
  return (
    <div className="flex w-full h-full items-center justify-evenly px-[7%]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ height: DIGIT_H, width: "clamp(10px, 3.5vw, 22px)", overflow: "hidden", borderRadius: 4, background: "rgba(255,255,255,0.05)" }} />
      ))}
    </div>
  );
}

export default function GameBlock({ numbers, spinKey = 0 }: { numbers: string; spinKey?: number }) {
  const { playRoller, playLanding, audioStarted } = useAudioManager();

  const localKey = spinKey === 0 ? (audioStarted ? 0 : -1) : spinKey;

  useEffect(() => {
    if (localKey < 0) return;
    const duration = 2.2 + (numbers.length - 1) * 0.5 + 0.3;

    const rollerTimer = setTimeout(() => playRoller(duration), 0);
    const landingTimers = numbers.split("").map((_, i) =>
      setTimeout(() => playLanding(i + 1), (2.2 + i * 0.5) * 1000)
    );

    return () => {
      clearTimeout(rollerTimer);
      landingTimers.forEach(clearTimeout);
    };
  }, [localKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0 flex items-center justify-evenly px-[7%]"
      style={{ top: "56%", bottom: "20%", left: "5%", right: "5%" }}
    >
      {localKey < 0 ? (
        <StaticPlaceholder count={numbers.length} />
      ) : (
        numbers.split("").map((digit, i) => (
          <SlotDigit
            key={`${spinKey}-${numbers}-${i}`}
            digit={digit}
            index={i}
            startDelay={0}
          />
        ))
      )}
    </div>
  );
}
