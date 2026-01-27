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
  prices?: unknown;
  series?: Record<string, unknown>;
};

type Primitive = number | string | null | undefined;
type UnknownRecord = Record<string, unknown>;

type Point = {
  date: string;
  price?: number;
} & Record<Exclude<string, "date" | "price">, number | undefined>;

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

export default function RainbowChart() {
  const [rows, setRows] = useState<Point[]>([]);
  const [seriesKeys, setSeriesKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [range, setRange] = useState<Range>("all");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(
          "/api/rainbow?interval=daily&timespan=all&limit=5000",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: ApiResponse = await res.json();
        const payload: unknown = json.data ?? json.prices ?? json;

        // =========================
        // Caso A/B: payload es array
        // =========================
        if (Array.isArray(payload)) {
          const sample = payload[0];
          const sampleRec: UnknownRecord = isRecord(sample) ? sample : {};

          const tKey: "t" | "time" | "timestamp" | "x" | null =
            "t" in sampleRec
              ? "t"
              : "time" in sampleRec
                ? "time"
                : "timestamp" in sampleRec
                  ? "timestamp"
                  : "x" in sampleRec
                    ? "x"
                    : null;

          const normalized: Point[] = payload.map((p) => {
            const rec: UnknownRecord = isRecord(p) ? p : {};

            const ts: Primitive =
              tKey !== null
                ? (rec[tKey] as Primitive)
                : Array.isArray(p)
                  ? (p[0] as Primitive)
                  : null;

            const obj = { date: toDateLabel(Number(ts)) } as Point;

            if (tKey !== null) {
              for (const [k, v] of Object.entries(rec)) {
                if (k === tKey) continue;
                if (typeof v === "number") obj[k] = v;
              }
            } else if (Array.isArray(p) && typeof p[1] === "number") {
              obj.price = p[1];
            }

            return obj;
          });

          // Si hay "price" no la incluimos como banda
          const keys = Object.keys(normalized[0] ?? {}).filter(
            (k) => k !== "date",
          );

          setRows(normalized);
          setSeriesKeys(keys);
          return;
        }

        // ==========================================
        // Caso C: payload es objeto con series / data
        // ==========================================
        if (isRecord(payload)) {
          const maybeSeries = payload["series"];
          const seriesObj: UnknownRecord = isRecord(maybeSeries)
            ? maybeSeries
            : payload;

          const names = Object.keys(seriesObj);
          const map = new Map<string, Point>();

          for (const name of names) {
            const arr = seriesObj[name];
            if (!Array.isArray(arr)) continue;

            for (const pair of arr) {
              if (!Array.isArray(pair) || pair.length < 2) continue;

              const ts = pair[0];
              const val = pair[1];

              if (typeof val !== "number") continue;

              const d = toDateLabel(Number(ts));
              const row = map.get(d) ?? ({ date: d } as Point);
              row[name] = val;
              map.set(d, row);
            }
          }

          const merged = Array.from(map.values()).sort((a, b) =>
            a.date.localeCompare(b.date),
          );

          setRows(merged);
          setSeriesKeys(names.filter((k) => k !== "date"));
          return;
        }

        throw new Error("Formato de respuesta inesperado");
      } catch (e: unknown) {
        setErr(getMessage(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const hasData = rows.length > 0 && seriesKeys.length > 0;

  const filteredRows = useMemo(() => {
    if (!hasData) return rows;

    if (range === "all") return rows;

    const days = range === "1y" ? 365 : 730;
    const start = rows.length > days ? rows.length - days : 0;
    return rows.slice(start);
  }, [rows, range, hasData]);

  const bandKeys = useMemo(
    () => seriesKeys.filter((k) => k !== "price" && k !== "date"),
    [seriesKeys],
  );

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

  const hasPrice = Boolean(filteredRows[0]?.price);

  return (
    <div className="space-y-3">
      {/* Selector de rango */}
      <div className="flex gap-2">
        {(["1y", "2y", "all"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              range === r ? "bg-black text-white" : "bg-white hover:bg-neutral-50"
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[420px] w-full">
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

            {/* Bandas apiladas */}
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

            {/* Precio como línea (si existe) */}
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
        Informativo: no es consejo financiero. Próximo paso: ordenar bandas y
        aplicar colores “rainbow” correctos.
      </p>
    </div>
  );
}
