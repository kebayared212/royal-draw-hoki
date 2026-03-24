import Image from "next/image";

export default function DiamondBlock() {
  return (
    <div className="relative z-10">
      <Image
        src="/images/hero-diamond.png"
        alt=""
        width={480}
        height={480}
        className="w-full h-auto drop-shadow-[0_0_24px_rgba(255,200,0,0.8)]"
        loading="eager"
      />
    </div>
  );
}
