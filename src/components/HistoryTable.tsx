interface HistoryRow {
  periode: number;
  tanggal: string;
  nomor: string;
}

interface HistoryTableProps {
  data: HistoryRow[];
}

export default function HistoryTable({ data }: HistoryTableProps) {
  return (
    <div
      id="history"
      className="mx-4 mb-10 rounded-2xl overflow-hidden"
      style={{ background: "#1C1101", border: "1px solid #3d1a00", boxShadow: "inset 0 2px 8px rgba(255,140,0,0.6)" }}
    >
      <div className="py-4 px-4 text-center">
        <h2 className="text-white font-bold text-base">
          History Pengeluaran Nomor
        </h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            {["Periode", "Tanggal", "Nomor"].map((h) => (
              <th
                key={h}
                className="py-2 font-normal text-center"
                style={{ color: "#7a5030" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{ background: i % 2 === 0 ? "#2a1200" : "#1e0e00" }}
            >
              <td className="py-3 text-center text-white">{row.periode}</td>
              <td className="py-3 text-center text-white">{row.tanggal}</td>
              <td
                className="py-3 text-center font-semibold"
                style={{ color: "#f0b020" }}
              >
                {row.nomor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
