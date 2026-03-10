import { RealizedPriceChart } from "./realized-price-chart";

export const metadata = {
  title: "Precio Realizado de Bitcoin",
  description:
    "Gráfico del precio realizado de Bitcoin con datos on-chain y visualización integrada en BitAtlas.",
};

export default function RealizedPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(255,179,71,0.14),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(255,179,71,0.14),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(247,147,26,0.7),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-btc-soft bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-btc backdrop-blur">
              BitAtlas · Precio realizado
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                El costo base on-chain de Bitcoin en una lectura simple y visual.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-text-secondary sm:text-lg">
                Esta vista muestra el precio realizado de BTC para entender dónde
                está el costo agregado del mercado y sumar una capa más profunda
                al análisis del ciclo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <RealizedPriceChart />
      </section>
    </main>
  );
}
