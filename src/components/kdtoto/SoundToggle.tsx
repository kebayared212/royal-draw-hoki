"use client";

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
      style={{
        background: "rgba(80, 20, 10, 0.8)",
        border: "1px solid rgba(241, 196, 15, 0.3)",
      }}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
