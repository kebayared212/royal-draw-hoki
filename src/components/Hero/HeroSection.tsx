import Image from "next/image";
import Balls from "./Balls";
import DiamondBlock from "./DiamondBlock";
import GameBlock from "./GameBlock";

interface HeroSectionProps {
  numbers: string;
  periode: string;
}

export default function HeroSection({ numbers, periode }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Radial rays — h-[150%] supaya bisa meluber ke bawah section, tidak terpotong */}
      <div
        className="absolute inset-x-0 top-0 h-[150%] pointer-events-none radial-rays -z-10"
        style={{
          maskImage:
            "radial-gradient(ellipse 100% 85% at 50% 0%, black 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 85% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      <div
        className="circle-bg pointer-events-none -z-10"
        style={{
          top: "-181px",
          left: "51%",
        }}
      />

      <div className="relative mx-3 pt-10">
        <Balls />
        <GameBlock numbers={numbers} />
        <DiamondBlock />
        <div
          className="relative z-20 flex justify-center"
          style={{ marginTop: "-16.5%" }}
        >
          <div className="relative">
            <Image
              src="/images/periode.png"
              alt="Periode"
              width={240}
              height={49}
              style={{ width: "min(270px, 72vw)", height: "auto" }}
            />
            <div className="absolute inset-0 flex items-center justify-center -top-3">
              <p
                className="text-white font-semibold"
                style={{ fontSize: "clamp(9px, 2.8vw, 13px)" }}
              >
                Periode :{" "}
                <span className="font-bold" style={{ color: "#fde047" }}>
                  {periode}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
