const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:8080';

const DAYS_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatDateID(iso: string): string {
  const d = new Date(iso);
  return `${DAYS_ID[d.getDay()]} ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(iso: string): string {
  // Returns YYYY-MM-DD
  return new Date(iso).toISOString().slice(0, 10);
}

function formatPrize(amount: number): string {
  if (amount >= 1_000_000) return `${amount / 1_000_000} Juta`;
  if (amount >= 1_000) return `${amount / 1_000} Ribu`;
  return String(amount);
}

export interface CurrentPeriode {
  periodeId: string;
  periodeNumber: string;
  periodeDisplay: string;  // e.g. "Rabu 25 Maret 2026"
  result: string | null;
  status: string;
  keluaranDisplay: string; // formatted result_time
  tutupDisplay: string;    // formatted periode_end
}

export async function fetchCurrentPeriode(): Promise<CurrentPeriode | null> {
  try {
    const res = await fetch(`${BACKEND}/api/game/periode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'royaldraw' }),
      cache: 'no-store',
    });
    const json = await res.json();
    const item = json.data?.[0];
    if (!item) return null;

    // Format keluaran and tutup for display
    const keluaran = formatDateShortWIB(item.result_time);
    const tutup = formatDateShortWIB(item.periode_end);

    return {
      periodeId: item.id,
      periodeNumber: item.periode,
      periodeDisplay: formatDateID(item.periode_end),
      result: item.result ?? null,
      status: item.status,
      keluaranDisplay: keluaran,
      tutupDisplay: tutup,
    };
  } catch {
    return null;
  }
}

function formatDateShortWIB(iso: string): string {
  // e.g. "2026-03-25T17:00:00+07:00" → "25-03-26 17:00 WIB"
  const d = new Date(iso);
  const wib = new Date(d.getTime() + 7 * 3600 * 1000);
  const dd = String(wib.getUTCDate()).padStart(2, '0');
  const mm = String(wib.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(wib.getUTCFullYear()).slice(2);
  const hh = String(wib.getUTCHours()).padStart(2, '0');
  const min = String(wib.getUTCMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yy} ${hh}:${min} WIB`;
}

export interface HistoryRow {
  periode: number;
  tanggal: string;
  nomor: string;
}

export async function fetchResults(take = 10): Promise<HistoryRow[]> {
  try {
    const res = await fetch(`${BACKEND}/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ take }),
      cache: 'no-store',
    });
    const json = await res.json();
    return (json.data ?? [])
      .filter((item: any) => item.result)
      .map((item: any) => ({
        periode: Number(item.periode),
        tanggal: formatDateShort(item.periode_end ?? item.result_time),
        nomor: item.result ?? '-',
      }));
  } catch {
    return [];
  }
}

export interface PrizeItem {
  type: string;
  prize: string;
}

export async function fetchPrizes(): Promise<PrizeItem[]> {
  try {
    const res = await fetch(`${BACKEND}/api/game/prize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: 'dewabet', games: 'royaldraw' }),
      cache: 'no-store',
    });
    const json = await res.json();
    return (json.data_detail ?? []).map((item: any) => ({
      type: item.draw,
      prize: formatPrize(item.prize),
    }));
  } catch {
    return [];
  }
}
