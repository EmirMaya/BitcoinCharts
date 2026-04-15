import Link from "next/link";
import CryptoMarketTable from "./components/CryptoMarketTable";

const featureCards = [
  {
    title: "Rainbow Chart",
    description:
      "Visualiza el precio de Bitcoin dentro de su contexto histórico y detecta zonas de acumulación, euforia y riesgo.",
    href: "/rainbow",
    cta: "Ver gráfico",
  },
  {
    title: "Precio realizado",
    description:
      "Sigue el costo base on-chain del mercado y compara el spot frente al promedio realizado de las monedas en circulación.",
    href: "/realized",
    cta: "Abrir métrica",
  },
  {
    title: "Lectura de mercado",
    description:
      "Usa ambos gráficos como panel visual para leer valoración, estructura y contexto sin depender del ruido diario.",
    href: "/#graficos",
    cta: "Ir al hub",
  },
  {
    title: "Calculadora DCA",
    description:
      "Practica una estrategia de compras periódicas y entiende cómo se construye el precio promedio al acumular BTC en el tiempo.",
    href: "/dca-calculator",
    cta: "Abrir calculadora",
  },
] as const;

const focusBlocks = [
  "Tesis y contexto macro para Bitcoin",
  "Indicadores visuales simples para leer el ciclo",
  "Herramientas on-chain para sumar profundidad a la lectura",
] as const;

const chartHighlights = [
  {
    eyebrow: "Valoración histórica",
    title: "Rainbow Chart",
    description:
      "Ideal para ubicar a BTC dentro de bandas de mercado y detectar extremos visuales de sobrevaloración o apatía.",
    href: "/rainbow",
    cta: "Ir al Rainbow Chart",
    accent: "from-[rgba(247,147,26,0.24)] to-transparent",
  },
  {
    eyebrow: "Costo base on-chain",
    title: "Precio realizado",
    description:
      "Compara el precio spot con el realized price para ver cuándo el mercado cotiza cerca o lejos del costo agregado de los holders.",
    href: "/realized",
    cta: "Ver precio realizado",
    accent: "from-[rgba(59,130,246,0.2)] to-transparent",
  },
] as const;

const principles = [
  {
    title: "Bitcoin-first",
    text: "BitAtlas prioriza herramientas y lecturas centradas en BTC antes que perseguir ruido especulativo del mercado.",
  },
  {
    title: "Menos hype, más contexto",
    text: "La propuesta visual busca explicar zonas, escenarios y estructura de mercado sin vender certezas imposibles.",
  },
  {
    title: "Diseño utilizable",
    text: "Modo claro y oscuro, jerarquía editorial fuerte y bloques rápidos de escaneo para que la información sea fácil de consumir.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,179,71,0.14),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,179,71,0.14),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(247,147,26,0.7),transparent)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-btc-soft bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-btc backdrop-blur">
              BitAtlas · Bitcoin Intelligence
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                La portada para entender Bitcoin con contexto, no con ansiedad.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Una plataforma especializada para analizar ciclos de mercado,
                zonas de valoración y métricas on-chain de Bitcoin.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/rainbow"
                className="gold-glow inline-flex items-center justify-center rounded-full bg-btc px-6 py-3 text-sm font-semibold text-black"
              >
                Abrir Rainbow Chart
              </Link>
              <Link
                href="/realized"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
              >
                Ver precio realizado
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {focusBlocks.map((block) => (
                <div
                  key={block}
                  className="rounded-2xl border border-border bg-card p-4 backdrop-blur"
                >
                  <p className="text-sm font-medium leading-6 text-text-secondary">
                    {block}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-border bg-[linear-gradient(180deg,var(--background-card),var(--background-secondary))] p-5 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                    Market Brief
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Radar de Bitcoin
                  </h2>
                </div>
                <div className="rounded-full border border-btc-soft px-3 py-1 text-xs font-medium text-btc">
                  BTC First
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    Ciclo
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    Lectura de largo plazo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Seguimiento visual del mercado para no perder perspectiva en
                    días de volatilidad.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    On-chain
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    Spot vs. costo base
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    El precio realizado suma una segunda capa para entender si el
                    mercado cotiza cerca o lejos del costo agregado.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(247,147,26,0.14),transparent_65%)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    Próximo paso
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    Entrá al hub de gráficos
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Usa el Rainbow Chart y el precio realizado como panel
                    complementario para una lectura más completa de BTC.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="mercados" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <CryptoMarketTable />
      </section>

      <section id="graficos" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Gráficos
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Dos vistas para leer Bitcoin con más profundidad
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            El Rainbow Chart te da una lectura histórica rápida. El precio
            realizado añade una capa on-chain para comparar valoración y costo
            base del mercado en una sola navegación.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {chartHighlights.map((chart) => (
            <article
              key={chart.title}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className={`h-28 bg-gradient-to-br ${chart.accent}`} />
              <div className="space-y-5 p-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                    {chart.eyebrow}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {chart.title}
                  </h3>
                  <p className="text-sm leading-7 text-text-secondary">
                    {chart.description}
                  </p>
                </div>

                <Link
                  href={chart.href}
                  className="inline-flex items-center text-sm font-semibold text-btc"
                >
                  {chart.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="space-y-4">
                  <div className="h-1 w-14 rounded-full bg-btc" />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-7 text-text-secondary">
                    {card.description}
                  </p>
                </div>

                <Link
                  href={card.href}
                  className="inline-flex items-center text-sm font-semibold text-btc"
                >
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="enfoque" className="border-y border-border bg-background-secondary">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Enfoque
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Una portada hecha para leer, comparar y decidir con calma
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {item.text}
                </p>
              </div>
            ))}M
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[28px] border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Inicio BitAtlas
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Base lista para sumar métricas, paneles y nuevas lecturas de BTC.
              </h2>
              <p className="text-sm leading-7 text-text-secondary">
                BitAtlas consolida una propuesta orientada a claridad,
                consistencia y crecimiento sostenido.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/rainbow"
                className="gold-glow inline-flex items-center justify-center rounded-full border border-btc-soft bg-btc px-6 py-3 text-sm font-semibold text-black"
              >
                Abrir Rainbow Chart
              </Link>
              <Link
                href="/realized"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
              >
                Abrir precio realizado
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
