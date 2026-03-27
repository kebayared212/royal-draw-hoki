const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:8080';

const DAYS_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatDateID(iso: string): string {
  const d = new Date(iso);
  return `${DAYS_ID[d.getDay()]} ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function formatPrize(amount: number): string {
  if (amount >= 1_000_000) return `${amount / 1_000_000} Juta`;
  if (amount >= 1_000) return `${amount / 1_000} Ribu`;
  return String(amount);
}

function formatDateShortWIB(iso: string): string {
  const d = new Date(iso);
  const wib = new Date(d.getTime() + 7 * 3600 * 1000);
  const dd = String(wib.getUTCDate()).padStart(2, '0');
  const mm = String(wib.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(wib.getUTCFullYear()).slice(2);
  const hh = String(wib.getUTCHours()).padStart(2, '0');
  const min = String(wib.getUTCMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yy} ${hh}:${min} WIB`;
}

// Raw shapes from the backend
interface RawPeriodeItem {
  id: string;
  periode: string;
  result: string | null;
  result_time: string;
  periode_start: string;
  periode_end: string;
  status: string;
}

interface RawResultItem {
  periode: string;
  result: string | null;
  result_time: string;
  periode_end: string;
  periode_start: string;
}

interface RawPrizeItem {
  draw: string;
  prize: number;
  perkalian?: number;
}

export interface CurrentPeriode {
  periodeId: string;
  periodeNumber: string;
  periodeDisplay: string;
  result: string | null;
  // countdownTargetMs: jam yang jadi target countdown
  // — jika periode aktif: result_time
  // — jika periode upcoming: periode_start
  countdownTargetMs: number;
  resultTimeReached: boolean;
  periodeEndMs: number;
  isActive: boolean; // true = periode sudah mulai, false = belum mulai (upcoming)
  status: string;
  keluaranDisplay: string;
  tutupDisplay: string;
  periodeStartDisplay: string;
}

export async function fetchCurrentPeriode(): Promise<CurrentPeriode | null> {
  try {
    const res = await fetch(`${BACKEND}/api/game/periode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'royal-draw' }),
      cache: 'no-store',
    });
    const json = await res.json() as { data?: RawPeriodeItem[] };
    const items = json.data ?? [];
    if (items.length === 0) return null;

    const now = Date.now();

    // Cari periode yang sudah mulai (periode_start <= now)
    const active = items.find(
      (item) => new Date(item.periode_start).getTime() <= now
    );

    // Jika tidak ada yang aktif, ambil yang akan datang (paling dekat)
    const upcoming = !active
      ? items
          .filter((item) => new Date(item.periode_start).getTime() > now)
          .sort(
            (a, b) =>
              new Date(a.periode_start).getTime() -
              new Date(b.periode_start).getTime()
          )[0]
      : undefined;

    const item = active ?? upcoming;
    if (!item) return null;

    const periodeStartMs = new Date(item.periode_start).getTime();
    const resultTimeMs = new Date(item.result_time).getTime();
    const isActive = periodeStartMs <= now;

    return {
      periodeId: item.id,
      periodeNumber: item.periode,
      periodeDisplay: formatDateID(item.periode_end),
      result: item.result ?? null,
      countdownTargetMs: isActive ? resultTimeMs : periodeStartMs,
      resultTimeReached: now >= resultTimeMs,
      periodeEndMs: new Date(item.periode_end).getTime(),
      isActive,
      status: item.status,
      keluaranDisplay: formatDateShortWIB(item.result_time),
      tutupDisplay: formatDateShortWIB(item.periode_end),
      periodeStartDisplay: formatDateShortWIB(item.periode_start),
    };
  } catch {
    return null;
  }
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
      body: JSON.stringify({ take, game: 'royal-draw' }),
      cache: 'no-store',
    });
    const json = await res.json() as { data?: RawResultItem[] };
    const now = Date.now();
    return (json.data ?? [])
      .filter((item) =>
        item.result && new Date(item.result_time).getTime() <= now
      )
      .map((item) => ({
        periode: Number(item.periode),
        tanggal: formatDateShortWIB(item.periode_end ?? item.result_time),
        nomor: item.result!,
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
      body: JSON.stringify({ brand: 'dewabet', games: 'royal-draw' }),
      cache: 'no-store',
    });
    const json = await res.json() as { data_detail?: RawPrizeItem[] };
    return (json.data_detail ?? []).map((item) => {
      const finalPrize = item.perkalian ? item.prize * item.perkalian : item.prize;
      return {
        type: item.draw,
        prize: formatPrize(finalPrize),
      };
    });
  } catch {
    return [];
  }
}
