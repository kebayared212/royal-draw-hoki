"use client";

interface Props {
  onWin: () => void;
  onLose: () => void;
  onNoBet: () => void;
}

export default function DevPreview({ onWin, onLose, onNoBet }: Props) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex flex-col gap-1">
      <button onClick={onWin} className="text-[10px] font-bold px-2 py-1 rounded bg-yellow-600 text-white opacity-70">
        Demo Menang
      </button>
      <button onClick={onLose} className="text-[10px] font-bold px-2 py-1 rounded bg-red-800 text-white opacity-70">
        Demo Kalah
      </button>
      <button onClick={onNoBet} className="text-[10px] font-bold px-2 py-1 rounded bg-gray-700 text-white opacity-70">
        Demo No Bet
      </button>
    </div>
  );
}
