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

  // Jika result_time belum tercapai, skip periode yang sedang berjalan dari history
  // supaya yang ditampilkan adalah result periode sebelumnya.
  const resultTimeReached = periode?.resultTimeReached ?? true;
  const displayHistory = resultTimeReached
    ? history
    : history.filter((h) => String(h.periode) !== periode?.periodeNumber);
  const numbers = displayHistory[0]?.nomor ?? "00000000";

  const periodeDisplay = periode?.periodeDisplay ?? "-";
  const periodeId = periode?.periodeId ?? "";
  const periodeNumber = periode?.periodeNumber ?? "";
  const keluaran = periode?.keluaranDisplay ?? "-";
  const tutup = periode?.tutupDisplay ?? "-";
  const countdownTargetMs = periode?.countdownTargetMs ?? 0;
  const periodeEndMs = periode?.periodeEndMs ?? 0;

  return (
    <div className="relative min-h-screen font-sans text-white w-full overflow-hidden">
      <HeroSection
        numbers={numbers}
        periode={periodeDisplay}
        countdownTargetMs={countdownTargetMs}
        periodeNumber={periodeNumber}
        isActive={periode?.isActive ?? false}
      />
      <PrizeCards prizes={prizes} />
      <SyaratKetentuan />
      <SubmitForm
        periodeId={periodeId}
        periodeNumber={Number(periodeNumber)}
        keluaran={keluaran}
        tutup={tutup}
        periodeEndMs={periodeEndMs}
        isActive={periode?.isActive ?? false}
        periodeStartDisplay={periode?.periodeStartDisplay ?? "-"}
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
