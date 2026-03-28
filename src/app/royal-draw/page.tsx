import HeroSection from "@/components/Hero/HeroSection";
import PrizeCards from "@/components/PrizeCards";
import SyaratKetentuan from "@/components/SyaratKetentuan";
import SubmitForm from "@/components/SubmitForm";
import HistoryTable from "@/components/HistoryTable";
import { fetchCurrentPeriode, fetchResults, fetchPrizes } from "@/lib/server-api";

export default async function RoyalDrawPage() {
  const [periode, history, prizes] = await Promise.all([
    fetchCurrentPeriode(),
    fetchResults(10),
    fetchPrizes(),
  ]);

  const numbers = history[0]?.nomor ?? "00000000";
  const resultPeriodeNumber = String(history[0]?.periode ?? "");

  const periodeDisplay = periode?.periodeDisplay ?? "-";
  const periodeId = periode?.periodeId ?? "";
  const periodeNumber = periode?.periodeNumber ?? "";
  const keluaran = periode?.keluaranDisplay ?? "-";
  const tutup = periode?.tutupDisplay ?? "-";
  const countdownTargetMs = periode?.countdownTargetMs ?? 0;
  const periodeEndMs = periode?.periodeEndMs ?? 0;
  const isActive = periode?.isActive ?? false;
  const periodeStartDisplay = periode?.periodeStartDisplay ?? "-";

  return (
    <div className="relative min-h-screen font-sans text-white w-full overflow-hidden">
      <HeroSection
        numbers={numbers}
        periode={periodeDisplay}
        countdownTargetMs={countdownTargetMs}
        periodeEndMs={periodeEndMs}
        periodeNumber={periodeNumber}
        resultPeriodeNumber={resultPeriodeNumber}
        isActive={isActive}
        prizes={prizes}
      />
      <PrizeCards prizes={prizes} />
      <SyaratKetentuan />
      <SubmitForm
        periodeId={periodeId}
        periodeNumber={Number(periodeNumber)}
        keluaran={keluaran}
        tutup={tutup}
        periodeEndMs={periodeEndMs}
        isActive={isActive}
        periodeStartDisplay={periodeStartDisplay}
      />
      <HistoryTable data={history} />
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
