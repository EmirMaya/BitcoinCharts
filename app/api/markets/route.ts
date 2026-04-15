import { NextResponse } from "next/server";
import { fetchCryptoMarkets } from "@/lib/crypto-markets";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchCryptoMarkets();

    return NextResponse.json(
      { data, updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Fetch failed", details: String(error) },
      { status: 500 },
    );
  }
}
