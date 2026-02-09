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

type ApiResponse = {
  data?: unknown;
};

type UnknownRecord = Record<string, unknown>;

type Point = {
  date: string;
  price?: number;
  baseline?: number;
  [key: string]: number | string | undefined;
};

type Range = "1y" | "2y" | "all";

function toDateLabel(ts: number) {
  const ms = ts < 10_000_000_000 ? ts * 1000 : ts;
  return new Date(ms).toISOString().slice(0, 10);
}

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function getMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Error";
}

// Paso 5.3: 9 bandas alrededor del baseline (multiplicadores)
// (En el 5.4 las calibramos si querés)
const BAND_MULTIPLIERS = [
  0.25, // band_0 (más baja)
  0.4,
  0.65,
  1.0,  // band_3 (baseline)
  1.6,
  2.6,
  4.2,
  6.8,
  11.0, // band_8 (más alta)
] as const;

export default function RainbowChart() {
  const [rows, setRows] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [range, setRange] = useState<Range>("all");

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

        const points: { ts: number; price: number }[] = [];
        for (const item of priceArr) {
          if (!isRecord(item)) continue;
          const ts = item["timestamp"];
          const val = item["price"];

          if (typeof ts !== "number") continue;
          if (typeof val !== "number") continue;
          if (val <= 0) continue;

          points.push({ ts, price: val });
        }
        points.sort((a, b) => a.ts - b.ts);

        const t0 = points[0]?.ts;
        if (!t0) throw new Error("No hay datos de precio");

        // 2) Baseline log-lineal (regresión de ln(price) vs tiempo)
        const xs: number[] = [];
        const ys: number[] = [];

        for (const p of points) {
          const days = (p.ts - t0) / (1000 * 60 * 60 * 24);
          xs.push(days);
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

        // 3) Rows: price + baseline + band_0..band_8
        const merged: Point[] = points.map((p) => {
          const days = (p.ts - t0) / (1000 * 60 * 60 * 24);
          const baseline = Math.exp(a + b * days);

          const row: Point = {
            date: toDateLabel(p.ts),
            price: p.price,
            baseline,
          };

          // bandas (en valor absoluto)
          BAND_MULTIPLIERS.forEach((m, i) => {
            row[`band_${i}`] = baseline * m;
          });

          return row;
        });

        setRows(merged);
      } catch (e: unknown) {
        setErr(getMessage(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const hasData = rows.length > 0;

  const filteredRows = useMemo(() => {
    if (!hasData) return rows;
    if (range === "all") return rows;

    const days = range === "1y" ? 365 : 730;
    const start = rows.length > days ? rows.length - days : 0;
    return rows.slice(start);
  }, [rows, range, hasData]);

  // Paso 5.3: keys de bandas
  const bandKeys = useMemo(
    () => BAND_MULTIPLIERS.map((_, i) => `band_${i}`),
    [],
  );

  const hasPrice = Boolean(filteredRows[0]?.price);

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
      {/* Selector de rango */}
      <div className="flex gap-2">
        {(["1y", "2y", "all"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              range === r
                ? "bg-black text-white"
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart (Paso 5.3: bandas + price) */}
      <div className="h-105 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredRows}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            stackOffset="none"
          >
            <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={40} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={70}
              scale="log"
              domain={["auto", "auto"]}
            />
            <Tooltip />
            <Legend />

            {/* Bandas (por ahora sin colores; en 5.4 aplicamos rainbow real) */}
            {bandKeys.map((k) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stackId="rainbow"
                strokeWidth={0}
                dot={false}
                fillOpacity={0.18}
                isAnimationActive={false}
              />
            ))}

            {/* Precio */}
            {hasPrice && (
              <Line
                type="monotone"
                dataKey="price"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-neutral-500">
        Informativo: no es consejo financiero. Paso 5.3: generamos 9 bandas
        desde el baseline (multiplicadores) y mostramos el precio encima.
      </p>
    </div>
  );
}
