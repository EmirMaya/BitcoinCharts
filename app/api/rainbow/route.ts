import { NextResponse } from "next/server";

const UPSTREAM = "https://charts.bitcoin.com/api/v1/charts/rainbow";

// opcional: cachear 1 hora
export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Permitimos pasar algunos params comunes del upstream
  const interval = searchParams.get("interval") ?? "daily"; // hourly | daily | weekly
  const timespan = searchParams.get("timespan") ?? "all"; // 30d | 1y | 2y | 5y | all
  const limit = searchParams.get("limit") ?? "5000";

  const url = new URL(UPSTREAM);
  url.searchParams.set("interval", interval);
  url.searchParams.set("timespan", timespan);
  url.searchParams.set("limit", limit);

  try {
    const res = await fetch(url.toString(), {
      // Cache ISR en Next (server-side)
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status },
        { status: 502 },
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        // Cache también a nivel CDN/browser
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Fetch failed", details: String(err) },
      { status: 500 },
    );
  }
}
