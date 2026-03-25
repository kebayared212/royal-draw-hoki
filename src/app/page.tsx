import HeroSection from "@/components/Hero/HeroSection";
import PrizeCards from "@/components/PrizeCards";
import SyaratKetentuan from "@/components/SyaratKetentuan";
import SubmitForm from "@/components/SubmitForm";
import HistoryTable from "@/components/HistoryTable";
import { fetchCurrentPeriode, fetchResults, fetchPrizes } from "@/lib/server-api";

export default async function Home() {
  const [periode, history, prizes] = await Promise.all([
    fetchCurrentPeriode(),
    fetchResults(10),
    fetchPrizes(),
  ]);

  const numbers = periode?.result ?? "00000000";
  const periodeDisplay = periode?.periodeDisplay ?? "-";
  const periodeId = periode?.periodeId ?? "";
  const periodeNumber = Number(periode?.periodeNumber ?? 0);
  const keluaran = periode?.keluaranDisplay ?? "-";
  const tutup = periode?.tutupDisplay ?? "-";

  return (
    <div className="relative min-h-screen font-sans text-white w-full overflow-hidden">
      <HeroSection numbers={numbers} periode={periodeDisplay} />
      <PrizeCards prizes={prizes} />
      <SyaratKetentuan />
      <SubmitForm
        periodeId={periodeId}
        periodeNumber={periodeNumber}
        keluaran={keluaran}
        tutup={tutup}
      />
      <HistoryTable data={history} />
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
