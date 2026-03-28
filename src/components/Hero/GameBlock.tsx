"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useAudioManager } from "@/components/AudioManager";

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES;

// Semua sizing proporsional terhadap viewport (base ≈ 390px)
const DIGIT_H = "clamp(14px, 4.8vw, 34px)";
const GAME_TEXT_W = "clamp(110px, 44vw, 200px)";
const HOKI_TEXT_W = "clamp(80px, 32vw, 144px)";
const FRAME_W = "clamp(220px, 88vw, 392px)";
const BLOCK_TOP = "clamp(68px, 30vw, 140px)";
const HOKI_TOP = "clamp(8px, 3.8vw, 18px)";
const FRAME_OFFSET = "clamp(-8px, -3.5vw, -20px)";
const SHADOW_W = "clamp(120px, 46vw, 256px)";

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
    <div className="absolute flex w-full h-full items-center justify-evenly px-[7%]" style={{ top: FRAME_OFFSET }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ height: DIGIT_H, width: "clamp(10px, 3.5vw, 22px)", overflow: "hidden", borderRadius: 4, background: "rgba(255,255,255,0.05)" }} />
      ))}
    </div>
  );
}

function GameTextSection() {
  return (
    <div className="flex justify-center relative">
      <Image
        src="/images/game-text.png"
        alt="Game Text"
        width={1080}
        height={564}
        className="h-auto shadow-2xl relative z-10"
        style={{ width: GAME_TEXT_W }}
      />
      <div className="flex justify-center z-20 absolute right-1/2 translate-x-1/2" style={{ top: HOKI_TOP }}>
        <Image
          src="/images/angka-hoki-text.png"
          alt="Angka Hoki"
          width={1080}
          height={564}
          className="h-auto"
          style={{ width: HOKI_TEXT_W }}
        />
      </div>
      <div
        className="absolute h-28 z-0 left-1/2 -translate-x-1/2"
        style={{
          width: SHADOW_W,
          top: "clamp(-16px, -6vw, -32px)",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
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
    <div className="absolute w-full flex flex-col justify-center z-30" style={{ top: BLOCK_TOP }}>
      <GameTextSection />

      <div className="relative z-40 top-1/2 flex justify-center" style={{ transform: `translateY(${FRAME_OFFSET})` }}>
        <Image
          src="/images/result-frame.png"
          alt=""
          width={480}
          height={360}
          className="h-auto mb-4"
          style={{ width: FRAME_W }}
        />
        {localKey < 0 ? (
          <StaticPlaceholder count={numbers.length} />
        ) : (
          <div className="absolute flex w-full h-full items-center justify-evenly px-[7%]" style={{ top: FRAME_OFFSET }}>
            {numbers.split("").map((digit, i) => (
              <SlotDigit
                key={`${spinKey}-${numbers}-${i}`}
                digit={digit}
                index={i}
                startDelay={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
