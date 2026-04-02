"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface KdReadyCtx {
  ready: boolean;
  start: () => void;
}

const Ctx = createContext<KdReadyCtx>({ ready: false, start: () => {} });

export function useKdReady() {
  return useContext(Ctx);
}

export function KdReadyProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const start = useCallback(() => setReady(true), []);
  return <Ctx.Provider value={{ ready, start }}>{children}</Ctx.Provider>;
}
