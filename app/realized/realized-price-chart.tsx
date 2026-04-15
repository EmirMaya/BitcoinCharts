"use client";

import { useEffect, useMemo, useState } from "react";

type RealizedPricePoint = {
  date: string;
  realizedPrice: number;
  btcPrice: number;
};

type RealizedPriceResponse = {
  source: string;
  updatedAt: string;
  points: RealizedPricePoint[];
  error?: string;
};

type PositionedPoint = RealizedPricePoint & {
  x: number;
  realizedY: number;
  btcY: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function buildLogLinePath(
  values: number[],
  width: number,
  height: number,
  minLog: number,
  maxLog: number,
) {
  if (values.length === 0) {
    return "";
  }

  const safeValues = values.map((value) => Math.max(value, 0.0001));
  const range = maxLog - minLog || 1;

  return safeValues
    .map((value, index) => {
      const x = (index / Math.max(safeValues.length - 1, 1)) * width;
      const y = height - ((Math.log10(value) - minLog) / range) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(path: string, width: number, height: number) {
  if (!path) {
    return "";
  }

  return `${path} L ${width} ${height} L 0 ${height} Z`;
}

export function RealizedPriceChart() {
  const [data, setData] = useState<RealizedPriceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch("/api/realized");
        const payload = (await response.json()) as RealizedPriceResponse;

        if (!response.ok) {
          throw new Error(payload.error || "La solicitud falló");
        }

        if (active) {
          setData(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los datos del precio realizado.",
          );
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const chart = useMemo(() => {
    const points = data?.points ?? [];

    if (points.length === 0) {
      return null;
    }

    const realizedValues = points.map((point) => point.realizedPrice);
    const btcValues = points.map((point) => point.btcPrice);
    const values = [...realizedValues, ...btcValues].filter((value) => value > 0);
    const width = 960;
    const height = 420;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const minLog = Math.log10(min);
    const maxLog = Math.log10(max);
    const range = maxLog - minLog || 1;
    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const value = 10 ** (maxLog - ratio * range);
      const y = ratio * height;

      return { value, y };
    });
    const yearTicks = points.filter((point) => point.date.endsWith("-01-01"));
    const realizedPath = buildLogLinePath(
      realizedValues,
      width,
      height,
      minLog,
      maxLog,
    );
    const btcPricePath = buildLogLinePath(
      btcValues,
      width,
      height,
      minLog,
      maxLog,
    );
    const areaPath = buildAreaPath(realizedPath, width, height);
    const positionedPoints: PositionedPoint[] = points.map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const realizedY =
        height -
        ((Math.log10(Math.max(point.realizedPrice, 0.0001)) - minLog) / range) *
          height;
      const btcY =
        height -
        ((Math.log10(Math.max(point.btcPrice, 0.0001)) - minLog) / range) *
          height;

      return {
        ...point,
        x,
        realizedY,
        btcY,
      };
    });

    return {
      width,
      height,
      min,
      max,
      yTicks,
      yearTicks,
      realizedPath,
      btcPricePath,
      areaPath,
      positionedPoints,
    };
  }, [data]);

  useEffect(() => {
    if (!data?.points.length) {
      setActiveIndex(null);
      return;
    }

    setActiveIndex(data.points.length - 1);
  }, [data]);

  const stats = useMemo(() => {
    const points = data?.points ?? [];

    if (points.length === 0) {
      return null;
    }

    const latest = points[points.length - 1];
    const monthAgo = points[Math.max(0, points.length - 31)];
    const ath = points.reduce((best, point) =>
      point.realizedPrice > best.realizedPrice ? point : best,
    );
    const latestBtcPrice = points[points.length - 1].btcPrice;
    const change30d =
      monthAgo.realizedPrice === 0
        ? 0
        : ((latest.realizedPrice - monthAgo.realizedPrice) /
            monthAgo.realizedPrice) *
          100;

    return { latest, ath, change30d, latestBtcPrice };
  }, [data]);

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!data || !chart || !stats) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-sm text-text-secondary">
        Cargando datos del precio realizado...
      </div>
    );
  }

  const activePoint =
    activeIndex !== null ? chart.positionedPoints[activeIndex] : null;
  const tooltipWidth = 176;
  const tooltipHeight = 74;
  const tooltipX = activePoint
    ? Math.min(
        Math.max(activePoint.x - tooltipWidth / 2, 12),
        chart.width - tooltipWidth - 12,
      )
    : 0;
  const tooltipY = activePoint
    ? Math.max(
        Math.min(activePoint.btcY, activePoint.realizedY) - tooltipHeight - 16,
        12,
      )
    : 0;
  const chartPointCount = chart.positionedPoints.length;

  function updateActiveIndex(clientX: number, bounds: DOMRect) {
    const relativeX = clientX - bounds.left;
    const ratio = bounds.width === 0 ? 0 : relativeX / bounds.width;
    const nextIndex = Math.round(
      Math.min(Math.max(ratio, 0), 1) * Math.max(chartPointCount - 1, 0),
    );

    setActiveIndex(nextIndex);
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">
            Precio realizado
          </p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {currencyFormatter.format(stats.latest.realizedPrice)}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            {dateFormatter.format(new Date(stats.latest.date))}
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">
            Precio BTC
          </p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {currencyFormatter.format(stats.latestBtcPrice)}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Cierre histórico más reciente del precio spot.
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">
            Cambio 30D
          </p>
          <p
            className={`mt-3 text-3xl font-semibold ${
              stats.change30d >= 0
                ? "text-emerald-600 dark:text-emerald-300"
                : "text-red-600 dark:text-red-300"
            }`}
          >
            {stats.change30d >= 0 ? "+" : ""}
            {stats.change30d.toFixed(2)}%
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Variación del costo base del mercado en el último mes.
          </p>
        </article>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,var(--background-card),var(--background-secondary))] shadow-sm">
        <div className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.16),transparent_36%)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
            Bitcoin On-Chain
          </p>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                Precio BTC vs. precio realizado
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Comparación entre el precio histórico de Bitcoin y el costo
                promedio on-chain de las monedas en circulación, sobre la misma
                escala logarítmica.
              </p>
            </div>
            <div className="text-sm text-text-secondary">
              Fuente: {data.source} · Actualizado{" "}
              {dateFormatter.format(new Date(data.updatedAt))}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="relative overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="mb-4 flex flex-wrap gap-3 text-xs font-medium text-text-secondary">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--price-line-color)]" />
                  Precio BTC
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-btc" />
                  Precio realizado
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                  <span className="text-text-muted">Escala</span>
                  Logarítmica
                </div>
              </div>
              <svg
                viewBox={`0 0 ${chart.width} ${chart.height + 48}`}
                className="h-auto w-full"
                role="img"
                aria-label="Gráfico logarítmico de Bitcoin y precio realizado"
                onMouseLeave={() => setActiveIndex(data.points.length - 1)}
                onMouseMove={(event) =>
                  updateActiveIndex(
                    event.clientX,
                    event.currentTarget.getBoundingClientRect(),
                  )
                }
                onTouchStart={(event) =>
                  updateActiveIndex(
                    event.touches[0].clientX,
                    event.currentTarget.getBoundingClientRect(),
                  )
                }
                onTouchMove={(event) =>
                  updateActiveIndex(
                    event.touches[0].clientX,
                    event.currentTarget.getBoundingClientRect(),
                  )
                }
              >
                <defs>
                  <linearGradient id="realized-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7931a" stopOpacity="0.40" />
                    <stop offset="100%" stopColor="#f7931a" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {chart.yTicks.map((tick) => (
                  <g key={tick.y}>
                    <line
                      x1="0"
                      x2={chart.width}
                      y1={tick.y}
                      y2={tick.y}
                      stroke="var(--border-color)"
                      strokeDasharray="4 8"
                    />
                    <text
                      x="12"
                      y={Math.max(16, tick.y - 8)}
                      fill="var(--text-secondary)"
                      fontSize="12"
                    >
                      {compactCurrencyFormatter.format(tick.value)}
                    </text>
                  </g>
                ))}

                <path d={chart.areaPath} fill="url(#realized-area)" />
                <path
                  d={chart.btcPricePath}
                  fill="none"
                  stroke="var(--price-line-color)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={chart.realizedPath}
                  fill="none"
                  stroke="#f7931a"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {chart.yearTicks.map((point) => {
                  const index = data.points.findIndex(
                    (item) => item.date === point.date,
                  );
                  const x =
                    (index / Math.max(data.points.length - 1, 1)) * chart.width;

                  return (
                    <g key={point.date}>
                      <line
                        x1={x}
                        x2={x}
                        y1="0"
                        y2={chart.height}
                        stroke="var(--border-color)"
                      />
                      <text
                        x={x}
                        y={chart.height + 28}
                        fill="var(--text-secondary)"
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {new Date(point.date).getFullYear()}
                      </text>
                    </g>
                  );
                })}

                {activePoint ? (
                  <g pointerEvents="none">
                    <line
                      x1={activePoint.x}
                      x2={activePoint.x}
                      y1="0"
                      y2={chart.height}
                      stroke="rgba(247,147,26,0.45)"
                      strokeDasharray="5 7"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.btcY}
                      r="5"
                      fill="var(--price-line-color)"
                      stroke="var(--background-card)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.realizedY}
                      r="5.5"
                      fill="#f7931a"
                      stroke="var(--background-card)"
                      strokeWidth="2"
                    />
                    <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                      <rect
                        width={tooltipWidth}
                        height={tooltipHeight}
                        rx="16"
                        fill="rgba(15, 23, 42, 0.92)"
                        stroke="rgba(255, 255, 255, 0.08)"
                      />
                      <text
                        x="12"
                        y="20"
                        fill="rgba(255,255,255,0.72)"
                        fontSize="11"
                      >
                        {dateFormatter.format(new Date(activePoint.date))}
                      </text>
                      <circle cx="16" cy="38" r="4" fill="var(--price-line-color)" />
                      <text x="26" y="42" fill="#ffffff" fontSize="12">
                        BTC {compactCurrencyFormatter.format(activePoint.btcPrice)}
                      </text>
                      <circle cx="16" cy="57" r="4" fill="#f7931a" />
                      <text x="26" y="61" fill="#ffffff" fontSize="12">
                        Realizado {compactCurrencyFormatter.format(activePoint.realizedPrice)}
                      </text>
                    </g>
                  </g>
                ) : null}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
