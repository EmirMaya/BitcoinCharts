import Link from "next/link";

const featureCards = [
  {
    title: "Rainbow Chart",
    description:
      "Visualizá el precio de Bitcoin dentro de su contexto histórico y detectá zonas de acumulación, euforia y riesgo.",
    href: "/rainbow",
    cta: "Ver gráfico",
  },
  {
    title: "Lectura de ciclo",
    description:
      "Entendé en qué etapa del mercado está BTC combinando momentum, narrativa, estructura y perspectiva de largo plazo.",
    href: "/rainbow",
    cta: "Explorar ciclos",
  },
  {
    title: "Mapa de convicción",
    description:
      "Una home pensada para separar ruido de señal y ayudarte a leer Bitcoin con más claridad que urgencia.",
    href: "/rainbow",
    cta: "Ir al panel",
  },
] as const;

const focusBlocks = [
  "Tesis y contexto macro para Bitcoin",
  "Indicadores visuales simples para leer el ciclo",
  "Recursos educativos para usuarios nuevos y avanzados",
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
                Un inicio editorial para seguir ciclos, zonas de valoración y
                narrativa de mercado con una experiencia limpia en modo claro y
                oscuro.
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
                href="/rainbow"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
              >
                Ver análisis visual
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
                    Señal
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    Zonas antes que titulares
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Estructura simple para leer precio, valoración y contexto en
                    una misma vista.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(247,147,26,0.14),transparent_65%)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    Próximo paso
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    Entrá al gráfico principal
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    El `Rainbow Chart` es el punto de entrada ideal para una
                    lectura rápida y visual del histórico de BTC.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Explorar
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Módulos clave del inicio
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            La home puede crecer como hub principal de información cripto, pero
            con una orientación clara: Bitcoin como eje de lectura.
          </p>
        </div>

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

      <section className="border-y border-border bg-background-secondary">
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
            ))}
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
                Base lista para sumar métricas, noticias o módulos on-chain.
              </h2>
              <p className="text-sm leading-7 text-text-secondary">
                La estructura ya deja resuelto el tono visual de la home y
                soporta tema claro/oscuro usando tus variables globales.
              </p>
            </div>

            <Link
              href="/rainbow"
              className="gold-glow inline-flex items-center justify-center rounded-full border border-btc-soft bg-btc px-6 py-3 text-sm font-semibold text-black"
            >
              Empezar por BTC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
