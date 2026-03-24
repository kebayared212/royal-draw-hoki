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
        className="z-10 absolute drop-shadow-2xl w-full max-w-48 h-auto object-contain -translate-y-4"
      />
      <Image
        src="/images/side-balls.png"
        alt="Lottery Balls Sides"
        width={1080}
        height={720}
        priority
        className="z-5 absolute w-full max-w-70 h-auto object-contain translate-y-22 drop-shadow-[0_0_6px_rgba(255,200,0,0.8)]"
      />
    </div>
  );
}
