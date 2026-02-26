"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { scaleSymlog } from "d3-scale";

type ApiResponse = {
  data?: unknown;
};

type UnknownRecord = Record<string, unknown>;

type Point = {
  date: string;
  price?: number;
  baseline?: number;
  [key: string]: number | string | [number, number] | undefined;
};

function toDateLabel(ts: number) {
  const ms = ts < 10_000_000_000 ? ts * 1000 : ts;
  return new Date(ms).toISOString().slice(0, 10);
}

function toMs(ts: number) {
  return ts < 10_000_000_000 ? ts * 1000 : ts;
}

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function getMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Error";
}

// 9 zonas (multiplicadores sobre baseline)
const BAND_MULTIPLIERS = [
  0.25, 0.4, 0.65, 1.0, 1.6, 2.6, 4.2, 6.8, 11.0,
] as const;

// colores temporales (después los reemplazamos por metadata.zoneColors del API)
const FALLBACK_ZONE_COLORS = [
  "#0044FF",
  "#0088FF",
  "#00FFFF",
  "#88FF00",
  "#FFFF00",
  "#FFCC00",
  "#FF8800",
  "#FF4400",
  "#FF0000",
] as const;

const BAND_LABELS: string[] = [
  "Bitcoin está muerto",
  "Zona de venta masiva",
  "Compra!",
  "Buena zona de acumulación",
  "Todavia está en descuento",
  "HODL!",
  "Empieza la burbuja?",
  "Toma de ganancias",
  "Burbuja 100% VENDE!",
];

// epsilon para log (nunca 0)
const EPS = 1e-9;
const DAY_MS = 1000 * 60 * 60 * 24;
const BITCOIN_GENESIS_MS = Date.UTC(2009, 0, 3);
const CHART_START_DATE = "2012-01-01";
const CHART_END_MS = Date.UTC(2028, 0, 1);

type LegendPayloadEntry = {
  color?: string;
  dataKey?: unknown;
  value?: string;
};

export default function RainbowChart() {
  const [rows, setRows] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(
          "/api/rainbow?interval=daily&timespan=all&limit=2000",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: ApiResponse = await res.json();
        const payload: unknown = json.data ?? json;

        if (!isRecord(payload)) {
          throw new Error("Formato inesperado: payload no es objeto");
        }

        const seriesObj: UnknownRecord = payload;

        // 1) Precio real
        const priceArr = seriesObj["price"];
        if (!Array.isArray(priceArr)) {
          throw new Error("No se encontró data.price como array");
        }

        const points: { tsMs: number; price: number }[] = [];
        for (const item of priceArr) {
          if (!isRecord(item)) continue;
          const ts = item["timestamp"];
          const val = item["price"];
          if (typeof ts !== "number") continue;
          if (typeof val !== "number") continue;
          if (val <= 0) continue;
          points.push({ tsMs: toMs(ts), price: val });
        }
        points.sort((a, b) => a.tsMs - b.tsMs);

        const firstTs = points[0]?.tsMs;
        if (!firstTs) throw new Error("No hay datos de precio");

        // 2) Baseline tipo potencia (regresión ln(price) vs ln(days + 1))
        // Esto genera bandas curvas en eje Y logarítmico.
        const xs: number[] = [];
        const ys: number[] = [];

        for (const p of points) {
          const days = Math.max(0, (p.tsMs - BITCOIN_GENESIS_MS) / DAY_MS);
          xs.push(Math.log(days + 1));
          ys.push(Math.log(p.price));
        }

        const n = xs.length;
        const sumX = xs.reduce((acc, v) => acc + v, 0);
        const sumY = ys.reduce((acc, v) => acc + v, 0);
        const sumXX = xs.reduce((acc, v) => acc + v * v, 0);
        const sumXY = xs.reduce((acc, v, i) => acc + v * ys[i], 0);

        const denom = n * sumXX - sumX * sumX;
        const b = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
        const a = n === 0 ? 0 : (sumY - b * sumX) / n;

        // 3) Rows: price + baseline + zonas y bandas [lower, upper]
        const buildRow = (tsMs: number, price?: number): Point => {
          const days = Math.max(0, (tsMs - BITCOIN_GENESIS_MS) / DAY_MS);
          const x = Math.log(days + 1);
          const baseline = Math.exp(a + b * x);

          const row: Point = {
            date: toDateLabel(tsMs),
            price,
            baseline,
          };

          // Zonas absolutas (límites)
          BAND_MULTIPLIERS.forEach((m, i) => {
            row[`zone_${i}`] = Math.max(EPS, baseline * m);
          });

          // Bandas por rango entre límites consecutivos: [zone_i, zone_{i+1}]
          for (let i = 0; i < BAND_MULTIPLIERS.length - 1; i += 1) {
            const lower = Number(row[`zone_${i}`] ?? EPS);
            const upper = Number(row[`zone_${i + 1}`] ?? EPS);
            row[`band_${i}`] = [Math.max(EPS, lower), Math.max(EPS, upper)];
          }
          // Banda superior final para no dejar hueco arriba
          {
            const i = BAND_MULTIPLIERS.length - 1;
            const lower = Number(row[`zone_${i}`] ?? EPS);
            const upper = Math.max(EPS, lower * 1.35);
            row[`band_${i}`] = [Math.max(EPS, lower), upper];
          }

          return row;
        };

        const merged: Point[] = points.map((p) => buildRow(p.tsMs, p.price));

        // Extiende el eje X hasta 2028-01-01 aunque no haya precio real.
        const lastTsMs = points[points.length - 1]?.tsMs ?? firstTs;
        if (lastTsMs < CHART_END_MS) {
          let ts = lastTsMs + DAY_MS;
          while (ts <= CHART_END_MS) {
            merged.push(buildRow(ts));
            ts += DAY_MS;
          }
        }

        setRows(merged);
      } catch (e: unknown) {
        setErr(getMessage(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const allRows = useMemo(
    () => rows.filter((row) => row.date >= CHART_START_DATE),
    [rows],
  );
  const hasData = allRows.length > 0;

  const bandKeys = useMemo(
    () => BAND_MULTIPLIERS.map((_, i) => `band_${i}`),
    [],
  );

  const hasPrice = Boolean(allRows[0]?.price);
  // c=1 aproxima mejor distancias por década sin perder el 0 visible.
  const yScale = useMemo(() => scaleSymlog().constant(1), []);
  const yTicks = useMemo(() => {
    let maxY = 10;
    for (const row of allRows) {
      for (const v of Object.values(row)) {
        if (typeof v === "number" && Number.isFinite(v)) {
          maxY = Math.max(maxY, v);
        }
      }
    }
    const maxExp = Math.max(1, Math.ceil(Math.log10(maxY)));
    const ticks: number[] = [0];
    for (let exp = 0; exp <= maxExp; exp += 1) {
      const decade = 10 ** exp;
      for (let m = 1; m <= 9; m += 1) {
        const t = m * decade;
        if (t <= 10 ** maxExp) ticks.push(t);
      }
    }
    return ticks;
  }, [allRows]);
  const yTickFormatter = (v: number) => {
    if (v === 0) return "0";
    const exp = Math.log10(v);
    const isMajor = Math.abs(exp - Math.round(exp)) < 1e-10 && v >= 10;
    if (!isMajor) return "";
    return Intl.NumberFormat("en-US").format(v);
  };
  const usdFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );
  const renderLegend = ({
    payload,
  }: {
    payload?: readonly LegendPayloadEntry[];
  }) => {
    if (!payload || payload.length === 0) return null;
    const byKey = new Map<string, LegendPayloadEntry>();
    for (const entry of payload) {
      byKey.set(String(entry.dataKey ?? ""), entry);
    }
    const firstRowKeys = ["band_0", "band_1", "band_2", "band_3", "band_4"];
    const secondRowKeys = ["band_5", "band_6", "band_7", "band_8", "price"];
    const firstRow = firstRowKeys
      .map((k) => byKey.get(k))
      .filter((v): v is LegendPayloadEntry => Boolean(v));
    const secondRow = secondRowKeys
      .map((k) => byKey.get(k))
      .filter((v): v is LegendPayloadEntry => Boolean(v));

    const renderChip = (entry: LegendPayloadEntry) => (
      <span
        key={String(entry.dataKey ?? entry.value)}
        className="rounded-md border px-3 py-1 text-[13px] leading-tight"
        style={{
          color: entry.color,
          borderColor: entry.color,
          backgroundColor: "rgba(255,255,255,0.55)",
        }}
      >
        {entry.value}
      </span>
    );

    return (
      <div className="px-3 pt-8 pb-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3">{firstRow.map(renderChip)}</div>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-3">
          {secondRow.map(renderChip)}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-sm text-neutral-600">Cargando datos…</div>;
  }

  if (err) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-sm text-red-600">Error: {err}</p>
        <p className="text-xs text-neutral-600">
          Probá abrir{" "}
          <code className="rounded bg-neutral-100 px-1">/api/rainbow</code> y
          revisá si devuelve JSON.
        </p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-6 text-sm text-neutral-600">
        No hay datos para mostrar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-neutral-500">Rango: ALL</div>

      {/* Chart (Paso 5.3: zonas entre líneas + price) */}
      <div className="h-160 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={allRows}
            margin={{ top: 10, right: 20, bottom: 72, left: 0 }}
          >
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={40} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={70}
              scale={yScale}
              domain={[0, "dataMax"]}
              ticks={yTicks}
              tickFormatter={yTickFormatter}
              allowDataOverflow
            />
            <Tooltip
              formatter={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  const low = Number(value[0]);
                  const high = Number(value[1]);
                  return `${usdFormatter.format(low)} ~ ${usdFormatter.format(high)}`;
                }
                if (typeof value === "number" && Number.isFinite(value)) {
                  return usdFormatter.format(value);
                }
                return String(value);
              }}
              itemSorter={(item) => {
                const key = String(item?.dataKey ?? "");
                if (key.startsWith("band_")) {
                  const idx = Number(key.replace("band_", ""));
                  return Number.isFinite(idx) ? -idx : 0;
                }
                if (key === "price") return 1_000_000;
                return 0;
              }}
            />
            <Legend content={renderLegend} />

            {/* Bandas arcoiris en log: cada área es un rango [lower, upper] */}
            {bandKeys.map((k, idx) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                name={BAND_LABELS[idx] ?? k}
                stroke={FALLBACK_ZONE_COLORS[idx % FALLBACK_ZONE_COLORS.length]}
                fill={FALLBACK_ZONE_COLORS[idx % FALLBACK_ZONE_COLORS.length]}
                fillOpacity={0.35}
                strokeWidth={0.6}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}

            {/* Precio */}
            {hasPrice && (
              <Line
                type="monotone"
                dataKey="price"
                name="precio"
                dot={false}
                stroke="#1f2937"
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-neutral-500">
        Informativo: no es consejo financiero. Paso 5.3: zonas entre límites en escala log.
      </p>
    </div>
  );
}
