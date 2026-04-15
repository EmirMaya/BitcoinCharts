import Link from "next/link";
import DcaCalculator from "./dca-calculator";

const principles = [
  {
    title: "Constancia por encima del timing",
    text: "El DCA intenta reducir la presión de acertar un único punto de entrada. En lugar de esperar la compra perfecta, reparte decisiones pequeñas en el tiempo.",
  },
  {
    title: "Más simple de sostener",
    text: "Para muchos usuarios, una rutina semanal, quincenal o mensual resulta más fácil de mantener que reaccionar cada día a la volatilidad de Bitcoin.",
  },
  {
    title: "Herramienta educativa",
    text: "Esta calculadora no promete rendimiento. Sirve para visualizar cómo cambia el precio promedio y cómo evoluciona la acumulación según el recorrido del mercado.",
  },
] as const;

const notes = [
  "La simulación usa una transición simple entre precio inicial y final para que el ejemplo sea fácil de entender.",
  "No contempla comisiones, slippage ni impuestos.",
  "Es una pieza pedagógica para BitAtlas, no una recomendación financiera.",
] as const;

export const metadata = {
  title: "Calculadora DCA de Bitcoin",
  description:
    "Simulador simple de Dollar Cost Averaging para practicar compras periódicas de Bitcoin dentro de BitAtlas.",
};

export default function DcaCalculatorPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(255,179,71,0.14),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.22),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(255,179,71,0.14),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(247,147,26,0.7),transparent)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-btc-soft bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-btc">
              BitAtlas · DCA Calculator
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Una calculadora simple para practicar compras periódicas de Bitcoin.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Este módulo está pensado para explicar la lógica del DCA de una
                forma amable: cuánto invertirías, cuánto BTC podrías acumular y
                qué precio promedio estarías construyendo con el paso del tiempo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#calculator"
                className="gold-glow inline-flex items-center justify-center rounded-full bg-btc px-6 py-3 text-sm font-semibold text-black"
              >
                Probar calculadora
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
              >
                Volver al inicio
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-border bg-[linear-gradient(180deg,var(--background-card),var(--background-secondary))] p-6 shadow-sm">
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                  Idea central
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Qué intenta resolver el DCA
                </h2>
              </div>

              <div className="space-y-4 text-sm leading-7 text-text-secondary">
                <p>
                  El Dollar Cost Averaging consiste en comprar una cantidad fija
                  de forma periódica, sin intentar adivinar cada mínimo o cada
                  máximo del mercado.
                </p>
                <p>
                  En Bitcoin, este enfoque suele usarse para construir posición
                  con más disciplina y menos carga emocional, especialmente en
                  horizontes largos.
                </p>
                <p>
                  La clave no está en la perfección de una sola compra, sino en
                  la consistencia del proceso.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="calculator"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Práctica
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Simula un plan de compras periódicas
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            Ajusta pocos parámetros y usa la tabla como referencia visual para
            entender cómo cambia la acumulación de BTC en una estrategia DCA.
          </p>
        </div>

        <DcaCalculator />
      </section>

      <section className="border-y border-border bg-background-secondary">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
              Cómo interpretarlo
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              El objetivo no es predecir, sino ordenar la toma de decisiones.
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Si el precio sube desde el principio, una compra única puede
                verse mejor en retrospectiva. Si el mercado corrige o se mueve
                lateral durante un tiempo, repartir entradas puede mejorar el
                precio medio y suavizar el proceso.
              </p>
              <p>
                Lo importante es que este tipo de estrategia le da más peso al
                hábito que al impulso. Para muchos perfiles, eso ya es una
                ventaja relevante.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-border bg-[linear-gradient(135deg,var(--background-card),var(--background-secondary))] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Notas
              </p>
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
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
                Seguir explorando
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                Combina esta práctica con contexto de mercado.
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                La calculadora te enseña la mecánica. El Rainbow Chart y el
                precio realizado pueden ayudarte a sumar perspectiva histórica y
                on-chain.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/rainbow"
                  className="inline-flex items-center justify-center rounded-full border border-btc-soft bg-btc px-6 py-3 text-sm font-semibold text-black"
                >
                  Ver Rainbow Chart
                </Link>
                <Link
                  href="/realized"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground"
                >
                  Ver precio realizado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
