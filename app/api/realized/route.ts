import { NextResponse } from "next/server";

const BGEOMETRICS_REALIZED_PRICE_URL =
  "https://charts.bgeometrics.com/files/realized_price.json";
const BGEOMETRICS_BTC_PRICE_URL =
  "https://charts.bgeometrics.com/files/realized_price_btc_price.json";

type BGeometricsRealizedPriceResponse = [number, number][];

type RealizedPricePoint = {
  date: string;
  realizedPrice: number;
  btcPrice?: number;
};

export const revalidate = 3600;

export async function GET() {
  try {
    const [realizedResponse, btcPriceResponse] = await Promise.all([
      fetch(BGEOMETRICS_REALIZED_PRICE_URL, {
        next: { revalidate },
        headers: {
          Accept: "application/json",
        },
      }),
      fetch(BGEOMETRICS_BTC_PRICE_URL, {
        next: { revalidate },
        headers: {
          Accept: "application/json",
        },
      }),
    ]);

    if (!realizedResponse.ok || !btcPriceResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch realized price data." },
        { status: 502 },
      );
    }

    const realizedPayload =
      (await realizedResponse.json()) as BGeometricsRealizedPriceResponse;
    const btcPricePayload =
      (await btcPriceResponse.json()) as BGeometricsRealizedPriceResponse;

    const btcPriceByDate = new Map(
      (btcPricePayload ?? []).map(([timestamp, btcPrice]) => [
        new Date(timestamp).toISOString().slice(0, 10),
        Number(btcPrice),
      ]),
    );

    const points: RealizedPricePoint[] = (realizedPayload ?? [])
      .map(([timestamp, realizedPrice]) => ({
        date: new Date(timestamp).toISOString().slice(0, 10),
        realizedPrice: Number(realizedPrice),
        btcPrice: btcPriceByDate.get(
          new Date(timestamp).toISOString().slice(0, 10),
        ),
      }))
      .filter(
        (point) =>
          point.date &&
          Number.isFinite(point.realizedPrice) &&
          point.realizedPrice > 0 &&
          Number.isFinite(point.btcPrice),
      );

    if (points.length === 0) {
      return NextResponse.json(
        { error: "Realized price source returned no usable data." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        source: "BGeometrics",
        updatedAt: `${points[points.length - 1].date}T00:00:00.000Z`,
        points,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Unexpected error fetching realized price data." },
      { status: 500 },
    );
  }
}
