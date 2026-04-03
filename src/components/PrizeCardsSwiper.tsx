"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";

interface Prize {
  type: string;
  prize: string;
}

export default function PrizeCardsSwiper({ prizes }: { prizes: Prize[] }) {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <div className="px-4 py-5" >
      <Swiper
        ref={swiperRef}
        modules={[FreeMode, Autoplay]}
        freeMode={{ enabled: true, momentum: false }}
        loop
        autoplay={{ delay: 0 }}
        speed={3000}
        slidesPerView={2.7}
        spaceBetween={12}
        className="prize-swiper"
      >
        {prizes.map((item) => (
          <SwiperSlide key={item.type} style={{ marginTop: "12px" }}>
            <div className="flex flex-col items-center">
              <div
                className="font-bold text-[16px] px-4.5 py-1 rounded-lg z-10"
                style={{
                  background: "linear-gradient(180deg, #1C1101 0%, #472A00 100%)",
                  color: "#ffffff",
                  marginBottom: "-14px",
                  boxShadow: "inset 0 2.5px 2px 0 #EC7229",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {item.type}
              </div>
              <div className="w-full rounded-3xl pt-4 pb-2 px-5 text-center prize-card">
                <div className="text-white text-sm opacity-80">Hadiah :</div>
                <div
                  className="text-2xl italic"
                  style={{ color: "#FFEB33", textShadow: "0 1px 3px rgba(0,0,0,0.4)", fontWeight: "900" }}
                >
                  {item.prize}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
