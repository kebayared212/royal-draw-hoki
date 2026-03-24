import HeroSection from "@/components/Hero/HeroSection";
import PrizeCards from "@/components/PrizeCards";
import SyaratKetentuan from "@/components/SyaratKetentuan";
import SubmitForm from "@/components/SubmitForm";
import HistoryTable from "@/components/HistoryTable";

const CURRENT_NUMBERS = "18673695";
const CURRENT_PERIODE = "Minggu 22 Maret 2026";

const PRIZES = [
  { type: "2D", prize: "1 Juta" },
  { type: "3D", prize: "2 Juta" },
  { type: "4D", prize: "3 Juta" },
  { type: "5D", prize: "4 Juta" },
];

const HISTORY = [
  { periode: 205, tanggal: "2025-10-03", nomor: "41245136" },
  { periode: 205, tanggal: "2025-10-02", nomor: "124125361" },
  { periode: 204, tanggal: "2025-10-01", nomor: "13446257" },
  { periode: 203, tanggal: "2025-09-30", nomor: "97468125" },
  { periode: 202, tanggal: "2025-09-29", nomor: "94673413" },
  { periode: 201, tanggal: "2025-09-28", nomor: "3416894" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans text-white w-full overflow-hidden">
      <HeroSection numbers={CURRENT_NUMBERS} periode={CURRENT_PERIODE} />
      <PrizeCards prizes={PRIZES} />
      <SyaratKetentuan />
      <SubmitForm />
      <HistoryTable data={HISTORY} />
      {/* Bottom ambient glow */}
      <div
        className="circle-bg pointer-events-none -z-10"
        style={{ top: "1253px", left: "593px" }}
      />
      <div
        className="circle-bg pointer-events-none -z-10"
        style={{ top: "1153px", left: "-53px" }}
      />
    </div>
  );
}
