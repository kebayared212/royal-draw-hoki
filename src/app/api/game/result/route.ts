import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_API_URL ?? 'http://localhost:8080';

export async function GET(req: NextRequest) {
  const periodeNumber = req.nextUrl.searchParams.get('periode') ?? '';

  const res = await fetch(`${BACKEND}/api/game/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ take: 10, game: 'royal-draw' }),
    cache: 'no-store',
  });
  const json = await res.json() as { data?: { periode: string; result?: string | null }[] };
  const items = json.data ?? [];

  // Cari result dengan periode yang sama
  const matched = items.find((d) => d.result && d.periode === periodeNumber);

  return NextResponse.json({ nomor: matched?.result ?? null });
}
