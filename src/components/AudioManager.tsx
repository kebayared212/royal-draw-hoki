"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Volume2, VolumeX } from "lucide-react";

const ROLLER_URL = "/audio/spin_reels.WAV";
const LANDING_URLS = Array.from({ length: 8 }, (_, i) => `/audio/${i + 1}.wav`);
const BG_URL = "/audio/bgm.WAV";
const CLICK_URL = "/audio/click_bt.WAV";

interface AudioManagerCtx {
  playRoller: (duration: number) => void;
  playLanding: (digitIndex: number) => void;
  startAudio: () => void;
  audioStarted: boolean;
}

const Ctx = createContext<AudioManagerCtx>({
  playRoller: () => {},
  playLanding: () => {},
  startAudio: () => {},
  audioStarted: false,
});

export function useAudioManager() {
  return useContext(Ctx);
}

export function AudioManager({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  const bgRef = useRef<HTMLAudioElement | null>(null);
  const webCtxRef = useRef<AudioContext | null>(null);
  const rollerBufRef = useRef<AudioBuffer | null>(null);
  const landingBufsRef = useRef<(AudioBuffer | null)[]>(new Array(8).fill(null));
  const clickBufRef = useRef<AudioBuffer | null>(null);
  const rollerNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Background music
  useEffect(() => {
    const audio = new Audio(BG_URL);
    audio.loop = true;
    audio.volume = 0.4;
    bgRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (bgRef.current) bgRef.current.muted = muted;
  }, [muted]);

  // Pre-load audio buffers
  function getCtx() {
    if (!webCtxRef.current) webCtxRef.current = new AudioContext();
    return webCtxRef.current;
  }

  async function loadBuffer(url: string): Promise<AudioBuffer> {
    const ctx = getCtx();
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    return ctx.decodeAudioData(arr);
  }

  useEffect(() => {
    // Load roller
    loadBuffer(ROLLER_URL).then((buf) => { rollerBufRef.current = buf; }).catch(() => {});
    // Load 8 landing sounds
    LANDING_URLS.forEach((url, i) => {
      loadBuffer(url).then((buf) => { landingBufsRef.current[i] = buf; }).catch(() => {});
    });
    // Load click sound
    loadBuffer(CLICK_URL).then((buf) => { clickBufRef.current = buf; }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Roller: loop spin_reels.WAV selama durasi animasi
  const playRoller = useCallback((duration: number) => {
    if (muted) return;
    const ctx = getCtx();
    const buf = rollerBufRef.current;
    if (!buf) return;

    const startRoller = () => {
      try { rollerNodeRef.current?.stop(); } catch { /* already stopped */ }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.7, ctx.currentTime + duration - 0.4);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      gain.connect(ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;
      source.connect(gain);
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + duration);

      rollerNodeRef.current = source;
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(startRoller).catch(() => {});
    } else {
      startRoller();
    }
  }, [muted]);

  // Landing: play 1.wav - 8.wav sesuai urutan digit (1-based index)
  const playLanding = useCallback((digitIndex: number) => {
    if (muted) return;
    const ctx = getCtx();
    const idx = Math.max(0, Math.min(digitIndex - 1, 7));
    const buf = landingBufsRef.current[idx];
    if (!buf) return;

    const startLanding = () => {
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      gain.connect(ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = buf;
      source.connect(gain);
      source.start(ctx.currentTime);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(startLanding).catch(() => {});
    } else {
      startLanding();
    }
  }, [muted]);

  // Global click sound
  useEffect(() => {
    const handleClick = () => {
      if (muted || !started) return;
      const ctx = getCtx();
      const buf = clickBufRef.current;
      if (!buf) return;

      const play = () => {
        const gain = ctx.createGain();
        gain.gain.value = 0.6;
        gain.connect(ctx.destination);
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.connect(gain);
        source.start(ctx.currentTime);
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(play).catch(() => {});
      } else {
        play();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [muted, started]);

  const startAudio = useCallback(() => {
    if (started) return;
    getCtx().resume().catch(() => {});
    bgRef.current?.play().catch(() => {});
    setStarted(true);
  }, [started]);

  const handleToggle = () => {
    if (!started) {
      getCtx().resume().catch(() => {});
      bgRef.current?.play().catch(() => {});
      setStarted(true);
    }
    setMuted((m) => !m);
  };

  return (
    <Ctx.Provider value={{ playRoller, playLanding, startAudio, audioStarted: started }}>
      {children}

      <button
        onClick={handleToggle}
        aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
        className="fixed bottom-6 right-4 z-50 flex items-center justify-center w-11 h-11 rounded-full transition-transform active:scale-90"
        style={{
          background: "linear-gradient(180deg, #FAB861 0%, #F79009 100%)",
          boxShadow: "0 2px 12px rgba(247,144,9,0.55)",
        }}
      >
        {muted || !started
          ? <VolumeX size={18} className="text-white" />
          : <Volume2 size={18} className="text-white" />}
      </button>
    </Ctx.Provider>
  );
}
