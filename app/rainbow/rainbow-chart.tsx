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
} from "recharts";

type ApiResponse = {
  data?: unknown;
  prices?: unknown;
  series?: Record<string, unknown>;
};

type Point = {
  date: string;
  price?: number;
} & Record<string, number | string | undefined>;

function toDateLabel(ts: number) {
  // ts suele venir en segundos o ms; normalizamos
  const ms = ts < 10_000_000_000 ? ts * 1000 : ts;
  return new Date(ms).toISOString().slice(0, 10);
}

export default function RainbowChart() {
  const [rows, setRows] = useState<Point[]>([]);
  const [seriesKeys, setSeriesKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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

        // Intentamos soportar varias formas de respuesta:
        // Caso A: { data: [...] }
        // Caso B: { prices: [...] }
        // Caso C: { ... , series: {name: [[ts,val],...] } }
        const payload: unknown = json.data ?? json.prices ?? json;

        // Si viene como array de puntos con timestamp + bandas
        if (Array.isArray(payload)) {
          // buscamos timestamp key común
          const sample = payload[0] ?? {};
          const tKey =
            "t" in sample
              ? "t"
              : "time" in sample
                ? "time"
                : "timestamp" in sample
                  ? "timestamp"
                  : "x" in sample
                    ? "x"
                    : null;

          const normalized: Point[] = (payload as unknown[]).map((p) => {
            const rec = p as UnknownRecord;

            const ts = tKey
              ? (rec[tKey] as Primitive)
              : Array.isArray(p)
                ? p[0]
                : null;

            const obj: Point = { date: toDateLabel(Number(ts)) };

            if (tKey) {
              for (const [k, v] of Object.entries(rec)) {
                if (k === tKey) continue;
                if (typeof v === "number") {
                  obj[k] = v;
                }
              }
            } else if (Array.isArray(p) && typeof p[1] === "number") {
              obj.price = p[1];
            }

            return obj;
          });

          // detectar series keys
          const keys = Object.keys(normalized[0] ?? {}).filter(
            (k) => k !== "date",
          );
          setRows(normalized);
          setSeriesKeys(keys);
          return;
        }

        // Si viene como { series: {name: [[ts,val],...]} }
        if (payload && typeof payload === "object") {
          const seriesObj =
            payload.series && typeof payload.series === "object"
              ? payload.series
              : payload;

          const names = Object.keys(seriesObj);
          const map = new Map<string, any>();

          for (const name of names) {
            const arr = seriesObj[name];
            if (!Array.isArray(arr)) continue;

            for (const pair of arr) {
              if (!Array.isArray(pair) || pair.length < 2) continue;
              const d = toDateLabel(Number(pair[0]));
              const row = map.get(d) ?? { date: d };
              row[name] = Number(pair[1]);
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
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const hasData = rows.length > 0 && seriesKeys.length > 0;

  const yDomain = useMemo(() => {
    // auto domain si hay data
    if (!hasData) return ["auto", "auto"] as const;
    return ["auto", "auto"] as const;
  }, [hasData]);

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
    <div className="h-[105] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={rows}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={40} />
          <YAxis tick={{ fontSize: 12 }} domain={yDomain} width={70} />
          <Tooltip />
          <Legend />

          {/* Dibujamos todas las series como áreas superpuestas (simple MVP).
              Luego en el Paso 4 las dejamos “bandas” lindas. */}
          {seriesKeys.slice(0, 10).map((k) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              strokeWidth={1}
              dot={false}
              fillOpacity={0.08}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <p className="mt-3 text-xs text-neutral-500">
        MVP: mostrando las primeras series detectadas. En el siguiente paso lo
        convertimos en “bandas rainbow” correctas y dejamos el precio destacado.
      </p>
    </div>
  );
}
