import Image from "next/image";

export default function GameBlock({ numbers }: { numbers: string }) {
  return (
    <div className="absolute w-full flex flex-col justify-center top-35 z-30">
      {/* game text */}
      <div className="flex justify-center relative">
        <Image
          src="/images/game-text.png"
          alt="Game Text"
          width={1080}
          height={564}
          className="w-full h-auto max-w-50 shadow-2xl relative z-10"
        />
        <div className="flex justify-center z-20 absolute top-4.5 right-1/2 translate-x-1/2">
          <Image
            src="/images/angka-hoki-text.png"
            alt="Angka Hoki"
            width={1080}
            height={564}
            className="w-full h-auto max-w-36"
          />
        </div>
        <div
          className="absolute w-full max-w-64 h-28 -top-8 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />
      </div>
      {/* result */}
      <div className="relative z-40 top-1/2 -translate-y-5 flex justify-center">
        <Image
          src="/images/result-frame.png"
          alt=""
          width={480}
          height={360}
          className="w-full h-auto max-w-98 mb-4"
        />
        <div className="absolute flex w-full h-full items-center justify-evenly px-[7%] -top-2.5">
          {numbers.split("").map((digit, i) => (
            <Image
              key={i}
              src={`/images/number/${digit}.png`}
              alt={digit}
              width={480}
              height={480}
              className="w-auto object-contain "
              style={{ height: "clamp(20px, 5.9vw, 34px)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
