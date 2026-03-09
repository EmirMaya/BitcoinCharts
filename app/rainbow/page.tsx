import Link from "next/link";
import RainbowChart from "./rainbow-chart";

const summaryCards = [
  {
    label: "Lectura",
    title: "Valoración histórica",
    text: "El Rainbow Chart sirve para ubicar el precio de BTC dentro de un marco de largo plazo y no solo dentro del ruido diario.",
  },
  {
    label: "Uso",
    title: "Contexto para decidir",
    text: "No da entradas mágicas. Aporta perspectiva para evaluar acumulación, euforia y gestión del riesgo con más calma.",
  },
  {
    label: "Enfoque",
    title: "Bitcoin-first",
    text: "Esta vista está pensada como módulo central de BitAtlas y conecta con la idea editorial de leer Bitcoin antes que perseguir titulares.",
  },
] as const;

const readingSteps = [
  {
    title: "Zonas frías",
    text: "Azules y verdes suelen coincidir con momentos donde Bitcoin cotiza relativamente deprimido frente a su tendencia histórica.",
  },
  {
    title: "Zona media",
    text: "Las áreas intermedias muestran transición. Suele ser donde el mercado recupera narrativa, pero todavía sin euforia extrema.",
  },
  {
    title: "Zonas cálidas",
    text: "Amarillos, naranjas y rojos suelen acompañar etapas de sobreextensión o entusiasmo excesivo.",
  },
] as const;

const sideNotes = [
  "Úsalo para contexto, no para señales automáticas.",
  "Combiná esta lectura con gestión de riesgo y horizonte temporal.",
  "El mejor uso del gráfico aparece cuando evitás reaccionar al corto plazo.",
] as const;

export const metadata = {
  title: "Bitcoin Rainbow Chart",
  description: "Visualizacion del Bitcoin Chart (Informativo)",
};

export default function RainbowPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(255,179,71,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.22),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(255,179,71,0.14),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(247,147,26,0.7),transparent)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-btc-soft bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-btc">
              BitAtlas · Rainbow View
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Bitcoin Rainbow Chart con una lectura visual más consistente con BitAtlas.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                El gráfico se mantiene intacto. La mejora está en el contexto:
                una página más editorial, homogénea con la home y preparada para
                orientar mejor la lectura de Bitcoin.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#chart"
                className="gold-glow inline-flex items-center justify-center rounded-full bg-btc px-6 py-3 text-sm font-semibold text-black"
              >
                Ir al gráfico
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
              >
                Volver al inicio
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {summaryCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-btc">
                    {card.label}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-border bg-[linear-gradient(180deg,var(--background-card),var(--background-secondary))] p-6 shadow-sm">
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                  Guía rápida
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Cómo mirar este módulo
                </h2>
              </div>

              <div className="space-y-4">
                {readingSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-btc text-sm font-semibold text-black">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="chart"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Chart Module
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Vista principal del histórico de Bitcoin
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            Gráfico informativo basado en datos públicos. No representa consejo
            financiero ni reemplaza análisis más amplios.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <RainbowChart />
        </div>
      </section>

      <section className="border-y border-border bg-background-secondary">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              ¿Cómo leerlo?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              El valor del gráfico está en la perspectiva.
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Este gráfico compara el precio de Bitcoin contra bandas de
                valoración histórica. En el eje X ves el tiempo y en el eje Y
                el precio en USD con escala logarítmica, lo que permite medir
                mejor variaciones muy grandes a lo largo de distintos ciclos.
              </p>
              <p>
                Las zonas frías suelen representar períodos donde BTC cotiza
                relativamente barato frente a su tendencia de largo plazo,
                mientras que las zonas cálidas suelen acompañar euforia,
                sobrevaloración o extensión del movimiento.
              </p>
              <p>
                El objetivo no es predecir el futuro, sino ofrecer una lectura
                más serena del mercado para combinar con gestión de riesgo,
                horizonte temporal y otros indicadores.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Notas clave
              </p>
              <div className="mt-4 space-y-3">
                {sideNotes.map((note) => (
                  <div
                    key={note}
                    className="rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-text-secondary"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Siguiente módulo
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                Esta página ya quedó lista para crecer.
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Si después querés completar la experiencia, acá encajan muy bien
                bloques como métricas rápidas de BTC, eventos de halving,
                resúmenes macro o contexto on-chain.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-btc-soft bg-btc px-6 py-3 text-sm font-semibold text-black"
                >
                  Volver a BitAtlas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
