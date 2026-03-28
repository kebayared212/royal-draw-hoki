import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl font-bold text-center">Pilih Template</h1>
      <p className="text-white/50 text-sm text-center">Pilih template yang ingin dilihat</p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link
          href="/royal-draw"
          className="flex-1 rounded-2xl p-6 text-center transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #1C1101, #372101)",
            border: "2px solid #FAB861",
          }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: "#FAB861" }}>Royal Draw</p>
          <p className="text-white/60 text-sm">Template Royal Draw Hoki</p>
        </Link>

        <Link
          href="/kdtoto"
          className="flex-1 rounded-2xl p-6 text-center transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #3a0a00, #7f1f00)",
            border: "2px solid #f1c40f",
          }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: "#f1c40f" }}>KD TOTO</p>
          <p className="text-white/60 text-sm">Template KD TOTO 8 Angka Hoki</p>
        </Link>
      </div>
    </div>
  );
}
