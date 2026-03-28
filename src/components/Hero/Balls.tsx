import Image from "next/image";

export default function Balls() {
  return (
    <div className="relative z-20 flex justify-center">
      <Image
        src="/images/balls-crown.png"
        alt="Lottery Balls Crown"
        width={1080}
        height={720}
        priority
        className="z-10 absolute drop-shadow-2xl h-auto object-contain"
        style={{ width: "clamp(100px, 42vw, 192px)", transform: "translateY(clamp(-6px, -2vw, -16px))" }}
      />
      <Image
        src="/images/side-balls.png"
        alt="Lottery Balls Sides"
        width={1080}
        height={720}
        priority
        className="z-5 absolute h-auto object-contain drop-shadow-[0_0_6px_rgba(255,200,0,0.8)]"
        style={{ width: "clamp(155px, 62vw, 280px)", transform: "translateY(clamp(42px, 19vw, 88px))" }}
      />
    </div>
  );
}
