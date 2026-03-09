import { fetchCryptoMarkets, type CryptoMarket } from "@/lib/crypto-markets";

const usdCompactFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const usdPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const supplyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

function formatCurrency(value: number | null, compact = false) {
  if (value === null) return "N/D";
  if (compact) return usdCompactFormatter.format(value);
  if (value >= 1000) return usdCompactFormatter.format(value);
  if (value >= 1) return usdPriceFormatter.format(value);
  return `$${value.toFixed(6)}`;
}

function formatPercent(value: number | null) {
  if (value === null) return "N/D";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function changeTone(value: number | null) {
  if (value === null) return "text-text-secondary";
  if (value > 0) return "text-green-500 dark:text-green-400";
  if (value < 0) return "text-red-500 dark:text-red-400";
  return "text-text-secondary";
}

function renderRow(coin: CryptoMarket) {
  return (
    <tr key={coin.id} className="border-b border-border last:border-none">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
        #{coin.rank ?? "-"}
      </td>
      <td className="px-4 py-3">
        <div className="flex min-w-[180px] flex-col">
          <span className="text-sm font-semibold">{coin.name}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
            {coin.symbol}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {formatCurrency(coin.currentPrice)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {formatCurrency(coin.marketCap, true)}
      </td>
      <td className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${changeTone(coin.priceChange24h)}`}>
        {formatPercent(coin.priceChange24h)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {formatCurrency(coin.totalVolume, true)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        {coin.circulatingSupply === null
          ? "N/D"
          : `${supplyFormatter.format(coin.circulatingSupply)} ${coin.symbol}`}
      </td>
      <td className={`whitespace-nowrap px-4 py-3 text-sm ${changeTone(coin.athChangePercentage)}`}>
        {formatPercent(coin.athChangePercentage)}
      </td>
    </tr>
  );
}

function fallbackView() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
          Mercado
        </p>
        <h3 className="text-2xl font-semibold">
          No se pudo cargar el top 30 en este momento
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-text-secondary">
          El módulo está preparado para consumir una API gratuita de mercado.
          Si el proveedor no responde o excede el rate limit, la home sigue
          funcionando sin romper la página.
        </p>
      </div>
    </div>
  );
}

export default async function CryptoMarketTable() {
  let markets: CryptoMarket[] | null = null;

  try {
    markets = await fetchCryptoMarkets();
  } catch {
    markets = null;
  }

  if (markets === null) {
    return fallbackView();
  }

  return (
    <section className="rounded-[28px] border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
            Market Snapshot
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Top 30 criptomonedas por market cap
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-text-secondary">
          Datos en USD obtenidos desde CoinGecko. Incluye capitalización,
          precio, variación diaria, volumen, supply circulante y distancia
          respecto al ATH.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            Cobertura
          </p>
          <p className="mt-3 text-lg font-semibold">30 activos</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Ranking por capitalización de mercado en tiempo casi real.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            Referencia
          </p>
          <p className="mt-3 text-lg font-semibold">USD spot</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            La tabla normaliza precio y market cap en dólares para comparar mejor.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            Variación 24h
          </p>
          <p className="mt-3 text-lg font-semibold">Momentum diario</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Lectura rápida de ganadores y perdedores sin salir de la portada.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            Uso
          </p>
          <p className="mt-3 text-lg font-semibold">Contexto amplio</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Ideal para contrastar la dominancia narrativa de BTC contra el resto del mercado.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-background-secondary">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Rank
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Asset
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Precio
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  24h
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Volumen
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Supply
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  ATH
                </th>
              </tr>
            </thead>
            <tbody>{markets.map(renderRow)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
