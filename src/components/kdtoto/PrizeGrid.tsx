import type { PrizeItem } from "@/lib/server-api";
import Image from "next/image";

interface Props {
  prizes: PrizeItem[];
}

export default function PrizeGrid({ prizes }: Props) {
  return (
    <div className="w-full kd-prize-swiper">
      {/* Desktop: static flex, all items visible */}
      <div className="hidden md:flex justify-center gap-4">
        {prizes.map((prize) => (
          <PrizeCard key={prize.type} prize={prize} />
        ))}
      </div>

      {/* Mobile: CSS marquee auto-scroll */}
      <div className="md:hidden kd-marquee-wrapper">
        <div className="kd-marquee-track">
          {prizes.map((prize) => (
            <PrizeCard key={prize.type} prize={prize} />
          ))}
          {/* Duplicate for seamless loop */}
          {prizes.map((prize) => (
            <PrizeCard key={`dup-${prize.type}`} prize={prize} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrizeCard({ prize }: { prize: PrizeItem }) {
  return (
    <div className="kd-prize-card kd-marquee-item">
      <span className="kd-prize-category font-jomhuria">
        <Image
          src={`/images/kdtoto/${prize.type}.png`}
          alt={prize.type}
          width={40}
          height={40}
          className="w-8 h-8 object-contain"
        />
      </span>
      <span className="text-[10px] text-gray-400 font-montserrat">
        Hadiah:
      </span>
      <span className="kd-prize-amount font-jomhuria">{prize.prize}</span>
    </div>
  );
}
