"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation } from "motion/react";

interface SlotColumnProps {
  targetDigit: number;
  index: number;
  spinning: boolean;
  onStopped?: () => void;
  onTick?: () => void;
  onStop?: () => void;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const SETS = 4;

export default function SlotColumn({
  targetDigit,
  index,
  spinning,
  onStopped,
  onTick,
  onStop,
}: SlotColumnProps) {
  const controls = useAnimation();
  const [stopped, setStopped] = useState(true);
  const [cellH, setCellH] = useState(0);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setCellH(containerRef.current.clientHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const getTargetY = useCallback(
    (digit: number) => -((SETS - 1) * DIGITS.length + digit) * cellH,
    [cellH]
  );

  useEffect(() => {
    if (!cellH) return;

    if (spinning) {
      setStopped(false);

      const stripHeight = SETS * DIGITS.length * cellH;
      const startDelay = index * 0.05;

      const startTicks = () => {
        tickIntervalRef.current = setInterval(() => {
          onTick?.();
        }, 80);
      };

      const timeout = setTimeout(() => {
        startTicks();
        controls.start({
          y: [0, -stripHeight],
          transition: { duration: 0.3, repeat: Infinity, ease: "linear" },
        });
      }, startDelay * 1000);

      const stopDelay = 1.5 + index * 0.25;
      const stopTimeout = setTimeout(() => {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }

        controls
          .start({
            y: getTargetY(targetDigit),
            transition: { type: "spring", stiffness: 120, damping: 14, mass: 1 },
          })
          .then(() => {
            setStopped(true);
            onStop?.();
            onStopped?.();
          });
      }, stopDelay * 1000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(stopTimeout);
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
      };
    } else {
      controls.set({ y: getTargetY(targetDigit) });
      setStopped(true);
    }
  }, [spinning, targetDigit, index, controls, onStopped, onStop, onTick, cellH, getTargetY]);

  const digitStrip = Array.from({ length: SETS }, () => DIGITS).flat();

  return (
    <div ref={containerRef} className="kd-slot-column-viewport">
      <motion.div
        animate={controls}
        style={{
          filter: !stopped ? "blur(2px)" : "none",
          transition: "filter 0.15s ease",
        }}
      >
        {digitStrip.map((digit, i) => (
          <div
            key={i}
            className="flex items-center justify-center select-none"
            style={{ height: cellH || 120 }}
          >
            <span
              className="font-jomhuria block"
              style={{
                fontSize: cellH ? cellH * 0.85 : 100,
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
