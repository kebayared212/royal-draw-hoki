"use client";

import { motion } from "motion/react";

interface SlotColumnProps {
  targetDigit: number;
  index: number;
  cellH: number;
}

const CYCLES = 3;
const STRIP_LENGTH = 10 * CYCLES;

export default function SlotColumn({ targetDigit, index, cellH }: SlotColumnProps) {
  // Strip: target digit first (landing position at y=0), then random digits below
  const strip = [
    targetDigit,
    ...Array.from({ length: STRIP_LENGTH }, (_, i) => i % 10),
  ];

  const totalItems = strip.length;
  const startPct = -(STRIP_LENGTH / totalItems) * 100;
  const startY = `${startPct}%`;
  const midY = `${startPct * 0.1}%`;
  const finalY = "0%";

  return (
    <div className="kd-slot-column-viewport">
      <motion.div
        initial={{ y: startY, filter: "blur(2px)" }}
        animate={{
          y: [startY, midY, finalY],
          filter: ["blur(2px)", "blur(1px)", "blur(0px)"],
        }}
        transition={{
          delay: 0,
          duration: 2.2 + index * 0.5,
          times: [0, 0.88, 1],
          ease: ["linear", [0.1, 0, 0.2, 1]],
        }}
      >
        {strip.map((digit, i) => (
          <div
            key={i}
            className="flex items-center justify-center select-none"
            style={{ height: cellH }}
          >
            <span
              className="font-jomhuria block"
              style={{
                fontSize: cellH * 0.85,
                lineHeight: 1,
                transform: "translateY(10%)",
                background: "linear-gradient(180deg, #f9e547 0%, #e67e22 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {digit}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
