"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { PrizeItem } from "@/lib/server-api";
import Image from "next/image";

interface Props {
  prizes: PrizeItem[];
}

export default function PrizeGrid({ prizes }: Props) {
  return (
    <div className="w-full kd-prize-swiper">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={4}
        spaceBetween={12}
        loop
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 14 },
          640: { slidesPerView: 6, spaceBetween: 16 },
          768: {
            slidesPerView: 7,
            spaceBetween: 16,
            loop: false,
            autoplay: false,
          },
        }}
      >
        {prizes.map((prize) => (
          <SwiperSlide key={prize.type}>
            <div className="kd-prize-card">
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
              <span className="kd-prize-amount font-jomhuria">
                {prize.prize}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
