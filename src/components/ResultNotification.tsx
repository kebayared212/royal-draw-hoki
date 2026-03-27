"use client";

import { motion, AnimatePresence } from "motion/react";
import { Trophy, Frown, Dices } from "lucide-react";

interface Props {
  show: boolean;
  status: "win" | "lose" | "no_bet";
  bet: string;
  result: string;
  prize: string;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#FAB861", "#F79009", "#fde047", "#fb923c", "#fff", "#fbbf24", "#ef4444"];

// Pre-generated at module load (outside React render) — no purity issues
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.4,
  duration: 2 + Math.random() * 1.5,
  size: 5 + Math.random() * 7,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  rotate: Math.random() * 360,
  drift: (Math.random() - 0.5) * 80,
  shape: Math.random() > 0.5 ? "50%" : "2px",
}));

export default function ResultNotification({ show, status, bet, result, prize, onClose }: Props) {
  const isWin = status === "win";
  const isNoBet = status === "no_bet";

  const matchStart = result.length - bet.length;
  const prefix = isNoBet ? result : result.slice(0, matchStart);
  const matched = isNoBet ? "" : result.slice(matchStart);

  // Particles are deterministic (no Math.random in render) — generated at module level
  const particles = PARTICLES;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
        >
          {/* Confetti — hanya saat menang */}
          {isWin && particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: -10,
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: p.shape,
              }}
              initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
              animate={{ y: "105vh", x: p.drift, opacity: [1, 1, 1, 0], rotate: p.rotate }}
              transition={{ delay: p.delay, duration: p.duration, ease: "linear" }}
            />
          ))}

          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: isWin
                ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(250,184,97,0.2) 0%, transparent 70%)"
                : isNoBet
                  ? "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(80,80,120,0.15) 0%, transparent 70%)"
                  : "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(180,40,40,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.82, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.82, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.05 }}
            className="relative w-full max-w-sm rounded-3xl px-6 pt-8 pb-7 flex flex-col items-center text-center overflow-hidden"
            style={{
              background: isWin
                ? "linear-gradient(180deg, #2a1500 0%, #0e0700 100%)"
                : isNoBet
                  ? "linear-gradient(180deg, #141420 0%, #0a0a14 100%)"
                  : "linear-gradient(180deg, #1a0a0a 0%, #0a0505 100%)",
              border: `1px solid ${isWin ? "rgba(250,184,97,0.45)" : isNoBet ? "rgba(120,120,200,0.3)" : "rgba(180,60,60,0.4)"}`,
            }}
          >
            {/* Pulsing border glow (win only) */}
            {isWin && (
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{ boxShadow: [
                  "0 0 20px rgba(250,140,0,0.25), inset 0 0 20px rgba(250,140,0,0.05)",
                  "0 0 45px rgba(250,140,0,0.5), inset 0 0 30px rgba(250,140,0,0.12)",
                  "0 0 20px rgba(250,140,0,0.25), inset 0 0 20px rgba(250,140,0,0.05)",
                ]}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Icon */}
            <motion.div
              className="mb-3 relative z-10"
              initial={{ scale: 0, rotate: -20 }}
              animate={isWin
                ? { scale: [0, 1.35, 0.88, 1.12, 1], rotate: [0, 12, -6, 6, 0] }
                : { scale: [0, 1.1, 0.95, 1], rotate: 0 }
              }
              transition={{ delay: 0.25, duration: 0.75, times: isWin ? [0, 0.4, 0.6, 0.8, 1] : [0, 0.5, 0.75, 1] }}
            >
              {isWin ? (
                <Trophy size={52} strokeWidth={2.2} style={{ color: "#FAB861", filter: "drop-shadow(0 0 12px rgba(250,184,97,0.7))" }} />
              ) : isNoBet ? (
                <Dices size={52} strokeWidth={2} style={{ color: "#a5b4fc", filter: "drop-shadow(0 0 10px rgba(165,180,252,0.5))" }} />
              ) : (
                <Frown size={52} strokeWidth={2} style={{ color: "#f87171", filter: "drop-shadow(0 0 10px rgba(248,113,113,0.5))" }} />
              )}
            </motion.div>

            {/* Title */}
            <motion.p
              className="font-extrabold text-2xl mb-1 relative z-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              style={{
                color: isWin ? "#FAB861" : isNoBet ? "#a5b4fc" : "#f87171",
                textShadow: isWin
                  ? "0 0 20px rgba(250,184,97,0.8)"
                  : isNoBet
                    ? "0 0 16px rgba(165,180,252,0.5)"
                    : "0 0 16px rgba(248,113,113,0.5)",
              }}
            >
              {isWin ? "Selamat!" : isNoBet ? "Hasil Sudah Keluar" : "Sayang Sekali..."}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="text-white/60 text-sm mb-5 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.4 }}
            >
              {isWin
                ? "Tebakan kamu tepat! Hadiah mu akan dikirim segera."
                : isNoBet
                  ? "Kamu tidak memasang tebakan periode ini. Jangan lewatkan periode berikutnya!"
                  : "Tebakan kamu belum beruntung kali ini. Semangat!"}
            </motion.p>

            {/* Hasil keluaran */}
            <motion.div
              className="w-full rounded-2xl px-4 py-3 mb-2 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.4 }}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Hasil Keluaran</p>
              <p className="font-black text-2xl tracking-widest">
                <span style={{ color: "rgba(255,255,255,0.3)" }}>{prefix}</span>
                {matched.split("").map((d, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      display: "inline-block",
                      color: isWin ? "#FAB861" : "#f87171",
                      textShadow: isWin ? "0 0 12px rgba(250,184,97,0.8)" : "none",
                    }}
                  >
                    {d}
                  </motion.span>
                ))}
              </p>
            </motion.div>

            {/* Tebakan — sembunyikan jika no_bet */}
            {!isNoBet && (
              <motion.div
                className="w-full rounded-2xl px-4 py-3 mb-5 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.64, duration: 0.4 }}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Tebakan Kamu</p>
                <p
                  className="font-black text-2xl tracking-widest"
                  style={{ color: isWin ? "#FAB861" : "rgba(255,255,255,0.45)" }}
                >
                  {bet}
                </p>
              </motion.div>
            )}

            {/* Hadiah — hanya saat menang */}
            {isWin && prize && (
              <motion.div
                className="w-full rounded-2xl px-4 py-3 mb-5 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.4 }}
                style={{
                  background: "linear-gradient(135deg, rgba(250,184,97,0.15) 0%, rgba(247,144,9,0.08) 100%)",
                  border: "1px solid rgba(250,184,97,0.3)",
                }}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Hadiah</p>
                <p
                  className="font-black text-2xl tracking-wide"
                  style={{ color: "#FAB861", textShadow: "0 0 16px rgba(250,184,97,0.6)" }}
                >
                  {prize}
                </p>
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-extrabold text-white text-base tracking-wide relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isWin && prize ? 0.82 : isNoBet ? 0.64 : 0.72, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ opacity: 0.9 }}
              style={{
                background: isWin
                  ? "linear-gradient(180deg, #FAB861 0%, #F79009 100%)"
                  : isNoBet
                    ? "linear-gradient(180deg, #3d3d6b 0%, #1e1e3d 100%)"
                    : "linear-gradient(180deg, #6b2020 0%, #3d1010 100%)",
                boxShadow: isWin ? "0 4px 20px rgba(247,144,9,0.55)" : "none",
                border: isWin ? "none" : isNoBet ? "1px solid rgba(120,120,200,0.35)" : "1px solid rgba(180,60,60,0.4)",
              }}
            >
              {isWin ? "✦ Klaim Hadiah ✦" : "Tutup"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
