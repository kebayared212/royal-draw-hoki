"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "motion/react";
import { useAudioManager } from "@/components/AudioManager";

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES;
const DIGIT_H = "clamp(12px, 6vw, 32px)";

// Preload digit images once
if (typeof window !== "undefined") {
  for (let d = 0; d <= 9; d++) {
    const img = new window.Image();
    img.src = `/images/number/${d}.png`;
  }
}

/** Deterministic pseudo-random strip — target digit at the END */
function buildStrip(digit: string, index: number): string[] {
  let seed = (parseInt(digit) + 1) * 7 + index * 13;
  const items: string[] = [];
  for (let i = 0; i < STRIP_LENGTH; i++) {
    seed = (seed * 31 + 17) % 100;
    items.push(String(seed % 10));
  }
  items.push(digit); // final position = target digit
  return items;
}

function SlotDigit({
  digit,
  index,
  cellH,
}: {
  digit: string;
  index: number;
  cellH: number;
}) {
  const strip = useMemo(() => buildStrip(digit, index), [digit, index]);

  const totalH = strip.length * cellH;
  // Start showing from top (last items are at bottom), animate to show last item
  const startY = -(totalH - cellH);
  const duration = 1.8 + index * 0.4;
  // Position just 1 cell above final (so the snap is only 1 digit)
  const nearEnd = -cellH;

  return (
    <div style={{ height: cellH, overflow: "hidden" }} className="w-auto">
      <motion.div
        initial={{ y: startY }}
        animate={{ y: [startY, nearEnd, 0] }}
        transition={{
          duration,
          times: [0, 0.97, 1], // 97% full-speed roll, 3% snap to result
          ease: ["linear", [0, 0, 0, 1]],
        }}
      >
        {strip.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ height: cellH }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/number/${d}.png`}
              alt={d}
              className="w-auto"
              style={{ height: DIGIT_H }}
              draggable={false}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function StaticPlaceholder({ count }: { count: number }) {
  return (
    <div className="flex w-full h-full items-center justify-evenly px-[7%]">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            height: DIGIT_H,
            width: "clamp(10px, 3.5vw, 22px)",
            overflow: "hidden",
            borderRadius: 4,
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  );
}

export default function GameBlock({
  numbers,
  spinKey = 0,
}: {
  numbers: string;
  spinKey?: number;
}) {
  const { playRoller, playLanding, audioStarted } = useAudioManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellH, setCellH] = useState(0);

  const localKey = spinKey === 0 ? (audioStarted ? 0 : -1) : spinKey;

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setCellH(containerRef.current.clientHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (localKey < 0) return;
    const duration = 1.8 + (numbers.length - 1) * 0.4 + 0.3;

    const rollerTimer = setTimeout(() => playRoller(duration), 0);
    const landingTimers = numbers.split("").map((_, i) =>
      setTimeout(() => playLanding(i + 1), (1.8 + i * 0.4) * 1000)
    );

    return () => {
      clearTimeout(rollerTimer);
      landingTimers.forEach(clearTimeout);
    };
  }, [localKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        top: "55%",
        bottom: "22%",
        left: "4%",
        right: "4%",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}
    >
      <div className="flex items-center justify-evenly px-[2%] h-full gap-[1%]">
        {localKey < 0 || cellH === 0 ? (
          <StaticPlaceholder count={numbers.length} />
        ) : (
          numbers.split("").map((digit, i) => (
            <SlotDigit
              key={`${spinKey}-${numbers}-${i}`}
              digit={digit}
              index={i}
              cellH={cellH}
            />
          ))
        )}
      </div>
    </div>
  );
}