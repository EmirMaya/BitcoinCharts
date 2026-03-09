export const MARKET_DATA_REVALIDATE_SECONDS = 300;

const COINGECKO_MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

type CoinGeckoMarket = {
  id?: unknown;
  symbol?: unknown;
  name?: unknown;
  market_cap_rank?: unknown;
  current_price?: unknown;
  market_cap?: unknown;
  total_volume?: unknown;
  circulating_supply?: unknown;
  price_change_percentage_24h?: unknown;
  ath_change_percentage?: unknown;
};

export type CryptoMarket = {
  id: string;
  symbol: string;
  name: string;
  rank: number | null;
  currentPrice: number | null;
  marketCap: number | null;
  totalVolume: number | null;
  circulatingSupply: number | null;
  priceChange24h: number | null;
  athChangePercentage: number | null;
};

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function mapMarket(item: CoinGeckoMarket): CryptoMarket {
  return {
    id: asString(item.id),
    symbol: asString(item.symbol).toUpperCase(),
    name: asString(item.name),
    rank: asNumber(item.market_cap_rank),
    currentPrice: asNumber(item.current_price),
    marketCap: asNumber(item.market_cap),
    totalVolume: asNumber(item.total_volume),
    circulatingSupply: asNumber(item.circulating_supply),
    priceChange24h: asNumber(item.price_change_percentage_24h),
    athChangePercentage: asNumber(item.ath_change_percentage),
  };
}

export async function fetchCryptoMarkets(): Promise<CryptoMarket[]> {
  const url = new URL(COINGECKO_MARKETS_URL);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");
  url.searchParams.set("price_change_percentage", "24h");

  const response = await fetch(url.toString(), {
    next: { revalidate: MARKET_DATA_REVALIDATE_SECONDS },
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko responded with ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Unexpected market payload");
  }

  return payload.map((item) => mapMarket((item ?? {}) as CoinGeckoMarket));
}
