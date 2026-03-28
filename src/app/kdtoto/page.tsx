import { fetchCurrentPeriode, fetchResults, fetchPrizes } from "@/lib/server-api";
import SlotMachine from "@/components/kdtoto/SlotMachine";
import PrizeGrid from "@/components/kdtoto/PrizeGrid";
import KdtotoAccordion from "@/components/kdtoto/Accordion";
import KdtotoGuessForm from "@/components/kdtoto/GuessForm";
import KdtotoHistoryTable from "@/components/kdtoto/HistoryTable";

export default async function KdtotoPage() {
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      <SlotMachine
        numbers={numbers}
        periode={periodeDisplay}
        periodeNumber={periodeNumber}
        countdownTargetMs={countdownTargetMs}
        periodeEndMs={periodeEndMs}
        isActive={isActive}
        resultPeriodeNumber={resultPeriodeNumber}
      />

      <PrizeGrid prizes={prizes} />

      <KdtotoAccordion />

      <div className="flex flex-col lg:flex-row gap-4">
        <KdtotoGuessForm
          periodeId={periodeId}
          periodeNumber={Number(periodeNumber)}
          keluaran={keluaran}
          tutup={tutup}
          periodeEndMs={periodeEndMs}
          isActive={isActive}
          periodeStartDisplay={periodeStartDisplay}
        />
        <KdtotoHistoryTable data={history} />
      </div>

      <footer className="text-center text-xs text-gray-500 py-4 font-montserrat">
        © 2025 KD TOTO. All rights reserved.
      </footer>
    </div>
  );
}
