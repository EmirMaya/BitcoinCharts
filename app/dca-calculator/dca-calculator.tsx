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

export default function DcaCalculator() {
  const [amountPerBuy, setAmountPerBuy] = useState(INITIAL_VALUES.amountPerBuy);
  const [numberOfBuys, setNumberOfBuys] = useState(INITIAL_VALUES.numberOfBuys);
  const [startingPrice, setStartingPrice] = useState(INITIAL_VALUES.startingPrice);
  const [endingPrice, setEndingPrice] = useState(INITIAL_VALUES.endingPrice);
  const [frequency, setFrequency] = useState<DcaFrequency>(INITIAL_VALUES.frequency);

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
              value={amountPerBuy}
              onChange={(event) =>
                setAmountPerBuy(Math.max(10, Number(event.target.value) || 10))
              }
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
              max={120}
              step={1}
              value={numberOfBuys}
              onChange={(event) =>
                setNumberOfBuys(Math.max(1, Number(event.target.value) || 1))
              }
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
              value={startingPrice}
              onChange={(event) =>
                setStartingPrice(Math.max(1000, Number(event.target.value) || 1000))
              }
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
              value={endingPrice}
              onChange={(event) =>
                setEndingPrice(Math.max(1000, Number(event.target.value) || 1000))
              }
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
