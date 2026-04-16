"use client";

import { useState } from "react";
import {
  calculateDcaPlan,
  getFrequencyLabel,
  type DcaFrequency,
} from "@/lib/dca-calculator";

const FREQUENCY_OPTIONS: Array<{
  value: DcaFrequency;
  label: string;
  hint: string;
}> = [
  {
    value: "weekly",
    label: "Semanal",
    hint: "Para quien quiere constancia con tickets pequeños.",
  },
  {
    value: "biweekly",
    label: "Quincenal",
    hint: "Un punto medio práctico para muchos salarios.",
  },
  {
    value: "monthly",
    label: "Mensual",
    hint: "El formato más común para una planificación tranquila.",
  },
];

const INITIAL_VALUES = {
  amountPerBuy: 150,
  numberOfBuys: 12,
  startingPrice: 62000,
  endingPrice: 78000,
  frequency: "monthly" as DcaFrequency,
};

const MAX_NUMERIC_INPUT_DIGITS = 8;
const MAX_NUMBER_OF_BUYS = 120;

function limitNumericInput(value: string) {
  return value.replace(/\D/g, "").slice(0, MAX_NUMERIC_INPUT_DIGITS);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBitcoin(value: number) {
  return `${value.toFixed(6)} BTC`;
}

function formatPercentage(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function buildPurchaseChartPoints(
  prices: number[],
  width: number,
  height: number,
  padding: number,
) {
  if (prices.length === 0) {
    return [];
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  return prices.map((price, index) => {
    const x =
      padding +
      (index / Math.max(prices.length - 1, 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((price - minPrice) / range) * (height - padding * 2);

    return { x, y, price, index: index + 1 };
  });
}

export default function DcaCalculator() {
  const [amountPerBuyInput, setAmountPerBuyInput] = useState(
    String(INITIAL_VALUES.amountPerBuy),
  );
  const [numberOfBuysInput, setNumberOfBuysInput] = useState(
    String(INITIAL_VALUES.numberOfBuys),
  );
  const [startingPriceInput, setStartingPriceInput] = useState(
    String(INITIAL_VALUES.startingPrice),
  );
  const [endingPriceInput, setEndingPriceInput] = useState(
    String(INITIAL_VALUES.endingPrice),
  );
  const [frequency, setFrequency] = useState<DcaFrequency>(INITIAL_VALUES.frequency);
  const parsedAmountPerBuy = Number(amountPerBuyInput);
  const parsedNumberOfBuys = Number(numberOfBuysInput);
  const parsedStartingPrice = Number(startingPriceInput);
  const parsedEndingPrice = Number(endingPriceInput);
  const amountPerBuy =
    Number.isFinite(parsedAmountPerBuy) && parsedAmountPerBuy >= 10
      ? parsedAmountPerBuy
      : INITIAL_VALUES.amountPerBuy;
  const numberOfBuys =
    Number.isFinite(parsedNumberOfBuys) && parsedNumberOfBuys >= 1
      ? Math.min(Math.floor(parsedNumberOfBuys), MAX_NUMBER_OF_BUYS)
      : INITIAL_VALUES.numberOfBuys;
  const startingPrice =
    Number.isFinite(parsedStartingPrice) && parsedStartingPrice >= 1000
      ? parsedStartingPrice
      : INITIAL_VALUES.startingPrice;
  const endingPrice =
    Number.isFinite(parsedEndingPrice) && parsedEndingPrice >= 1000
      ? parsedEndingPrice
      : INITIAL_VALUES.endingPrice;

  const result = calculateDcaPlan({
    amountPerBuy,
    numberOfBuys,
    startingPrice,
    endingPrice,
    frequency,
  });

  const { purchases, summary } = result;
  const frequencyLabel = getFrequencyLabel(frequency);
  const isPositive = summary.profitLoss >= 0;
  const beatsLumpSum = summary.lumpSumDifference >= 0;
  const chartWidth = 680;
  const chartHeight = 260;
  const chartPadding = 26;
  const purchasePrices = purchases.map((purchase) => purchase.price);
  const chartPoints = buildPurchaseChartPoints(
    purchasePrices,
    chartWidth,
    chartHeight,
    chartPadding,
  );
  const minChartPrice = Math.min(...purchasePrices);
  const maxChartPrice = Math.max(...purchasePrices);
  const chartRange = maxChartPrice - minChartPrice || 1;
  const averagePriceY =
    chartHeight -
    chartPadding -
    ((summary.averageBuyPrice - minChartPrice) / chartRange) *
      (chartHeight - chartPadding * 2);

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
            Simulación
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Configura una práctica simple de DCA
          </h2>
          <p className="text-sm leading-7 text-text-secondary">
            La idea es repartir compras periódicas de Bitcoin y ver cómo cambia
            el precio promedio cuando el mercado se mueve entre un punto inicial
            y otro final.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Monto por compra
            </span>
            <input
              type="number"
              min={10}
              step={10}
              value={amountPerBuyInput}
              onChange={(event) =>
                setAmountPerBuyInput(limitNumericInput(event.target.value))
              }
              onBlur={() => setAmountPerBuyInput(String(amountPerBuy))}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-btc"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Cantidad de compras
            </span>
            <input
              type="number"
              min={1}
              max={MAX_NUMBER_OF_BUYS}
              step={1}
              value={numberOfBuysInput}
              onChange={(event) =>
                setNumberOfBuysInput(limitNumericInput(event.target.value))
              }
              onBlur={() => setNumberOfBuysInput(String(numberOfBuys))}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-btc"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Precio inicial de BTC
            </span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={startingPriceInput}
              onChange={(event) =>
                setStartingPriceInput(limitNumericInput(event.target.value))
              }
              onBlur={() => setStartingPriceInput(String(startingPrice))}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-btc"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">
              Precio final de BTC
            </span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={endingPriceInput}
              onChange={(event) =>
                setEndingPriceInput(limitNumericInput(event.target.value))
              }
              onBlur={() => setEndingPriceInput(String(endingPrice))}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-btc"
            />
          </label>

          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground">
              Frecuencia de compra
            </span>
            <div className="grid gap-3">
              {FREQUENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFrequency(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    frequency === option.value
                      ? "border-btc bg-[rgba(247,147,26,0.10)]"
                      : "border-border bg-background hover:border-btc-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-foreground">
                      {option.label}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
                      DCA
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {option.hint}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Resultado
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Así se vería una estrategia {frequencyLabel}
              </h3>
            </div>
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                isPositive
                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/12 text-red-600 dark:text-red-400"
              }`}
            >
              {formatPercentage(summary.profitLossPercentage)}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Capital total
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatCurrency(summary.totalInvested)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                BTC acumulado
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatBitcoin(summary.totalBitcoin)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Precio promedio
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatCurrency(summary.averageBuyPrice)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Valor al precio final
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatCurrency(summary.currentValue)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm leading-7 text-text-secondary">
              {beatsLumpSum
                ? "En esta simulación el DCA acumula más BTC que una compra única al inicio, algo que suele ocurrir cuando el precio cae o pasa tiempo en niveles más bajos."
                : "En esta simulación una compra única al inicio habría acumulado más BTC. Eso también es normal: si el precio sube con fuerza desde el comienzo, escalonar entradas puede comprar menos cantidad."}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Comparación
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                DCA frente a compra única
              </h3>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
              Mismo capital
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Estrategia DCA
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatBitcoin(summary.totalBitcoin)}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Precio medio construido: {formatCurrency(summary.averageBuyPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                Compra única al inicio
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {formatBitcoin(summary.lumpSumBitcoin)}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Todo el capital entra al precio inicial:{" "}
                {formatCurrency(startingPrice)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-4">
            <p className="text-sm leading-7 text-text-secondary">
              {beatsLumpSum
                ? `El DCA termina con ${formatBitcoin(
                    summary.lumpSumDifference,
                  )} más que la compra única en este recorrido.`
                : `La compra única termina con ${formatBitcoin(
                    Math.abs(summary.lumpSumDifference),
                  )} más que el DCA en este recorrido.`}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Visual
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Recorrido de compras y precio promedio final
              </h3>
            </div>
            <p className="text-sm leading-6 text-text-secondary">
              Cada punto pequeño representa una compra. El punto grande marca el
              precio promedio final del plan.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-[linear-gradient(180deg,var(--background),var(--background-secondary))] p-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full"
              role="img"
              aria-label="Gráfico de compras periódicas y precio promedio final"
            >
              <line
                x1={chartPadding}
                y1={averagePriceY}
                x2={chartWidth - chartPadding}
                y2={averagePriceY}
                stroke="rgba(247,147,26,0.45)"
                strokeDasharray="6 7"
              />

              {chartPoints.map((point, index) => {
                const nextPoint = chartPoints[index + 1];

                return (
                  <g key={point.index}>
                    {nextPoint ? (
                      <line
                        x1={point.x}
                        y1={point.y}
                        x2={nextPoint.x}
                        y2={nextPoint.y}
                        stroke="rgba(148,163,184,0.4)"
                        strokeWidth="1.5"
                      />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="var(--price-line-color)"
                    />
                  </g>
                );
              })}

              <circle
                cx={chartWidth / 2}
                cy={averagePriceY}
                r="10"
                fill="#f7931a"
                stroke="var(--background-card)"
                strokeWidth="3"
              />
            </svg>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  Precio más bajo
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(minChartPrice)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  Precio promedio
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(summary.averageBuyPrice)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  Precio más alto
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(maxChartPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Compras
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Desglose de la práctica
              </h3>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
              {purchases.length} tramos
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[0.7fr_1fr_1fr] gap-3 bg-background-secondary px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <span>Compra</span>
              <span>Precio BTC</span>
              <span>BTC comprado</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {purchases.map((purchase) => (
                <div
                  key={purchase.index}
                  className="grid grid-cols-[0.7fr_1fr_1fr] gap-3 border-t border-border px-4 py-3 text-sm"
                >
                  <span className="font-medium text-foreground">
                    #{purchase.index}
                  </span>
                  <span className="text-text-secondary">
                    {formatCurrency(purchase.price)}
                  </span>
                  <span className="text-text-secondary">
                    {purchase.bitcoinBought.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
