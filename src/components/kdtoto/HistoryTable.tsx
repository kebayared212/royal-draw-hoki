import type { HistoryRow } from "@/lib/server-api";

interface Props {
  data: HistoryRow[];
}

export default function KdtotoHistoryTable({ data }: Props) {
  return (
    <div
      id="history"
      className="rounded-xl flex-1 kd-table"
      style={{
        background: "#471100",
        border: "1px solid rgba(241, 196, 15, 0.3)",
      }}
    >
      <h3 className="text-white font-montserrat font-semibold text-lg mb-4 text-center pt-3 pb-1">
        History Pengeluaran Nomor
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-montserrat text-center">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 px-3">Periode</th>
              <th className="text-left py-2 px-3">Tanggal</th>
              <th className="text-left py-2 px-3">Nomor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <tr
                key={`${entry.periode}-${i}`}
                style={{ background: i % 2 === 0 ? "#7f1f00" : "transparent" }}
              >
                <td className="py-2 px-3 text-neutral-100">{entry.periode}</td>
                <td className="py-2 px-3 text-neutral-100">{entry.tanggal}</td>
                <td
                  className="py-2 px-3 font-semibold tracking-wider"
                  style={{ color: "#fff70c" }}
                >
                  {entry.nomor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
