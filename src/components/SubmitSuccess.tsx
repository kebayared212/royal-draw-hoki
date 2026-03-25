import { useEffect, useRef, useState } from "react";
import Success from "./Icon/Success";

interface SubmitSuccessProps {
  show: boolean;
  onClose: () => void;
}

const DURATION = 5;

export default function SubmitSuccess({ show, onClose }: SubmitSuccessProps) {
  const [count, setCount] = useState(DURATION);
  const startRef = useRef(0);

  useEffect(() => {
    if (!show) return;
    startRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setCount(Math.max(0, DURATION - elapsed));
    }, 1000);

    const timer = setTimeout(onClose, DURATION * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <Success />
      <p className="text-white font-bold text-lg mt-4">
        Tebakan anda sudah berhasil
      </p>
      <p className="text-sm mt-2" style={{ color: "#e8a020" }}>
        Menutup dalam {count} detik...
      </p>
    </div>
  );
}
