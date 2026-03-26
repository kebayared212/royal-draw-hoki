"use client";

import dynamic from "next/dynamic";

interface Prize {
  type: string;
  prize: string;
}

interface PrizeCardsProps {
  prizes: Prize[];
}

const PrizeCardsSwiper = dynamic<{ prizes: Prize[] }>(() => import("./PrizeCardsSwiper"), { ssr: false });

export default function PrizeCards({ prizes }: PrizeCardsProps) {
  return <PrizeCardsSwiper prizes={prizes} />;
}
