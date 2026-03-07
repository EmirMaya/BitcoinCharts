import RainbowChart from "./rainbow-chart";

export const metadata = {
  title: "Bitcoin Rainbow Chart",
  description: "Visualizacion del Bitcoin Chart (Informativo)",
};

export default function RainbowPage() {
  return (
    <>
      <main className="min-h-screen px-4 py-10 bg-background">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold">Bitcoin Rainbow Chart</h1>
            <p className="text-sm text-text-secondary">
              Gráfico informativo basado en datos públicos. No es consejo
              financiero.
            </p>
          </header>
          <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
            <RainbowChart />
          </div>
          <section className="rounded-2xl bordeer bg-card p-4 shadow-sm space-y-2 border border-border">
            <h2 className="text-xl font-semibold">¿Cómo leerlo?</h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              Este gráfico compara el precio de Bitcoin (línea negra) contra
              bandas de valoración histórica (colores). En el eje X ves el
              tiempo y en el eje Y el precio en USD en escala logarítmica, por
              eso los movimientos grandes y chicos se pueden comparar mejor.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              Las zonas frías (azules y verdes) suelen representar períodos en
              los que BTC estuvo relativamente barato frente a su tendencia de
              largo plazo, mientras que las zonas cálidas (amarillo, naranja y
              rojo) suelen marcar etapas de euforia o sobrevaloración. No
              predice el futuro: sirve como contexto para tomar decisiones con
              más perspectiva, junto con gestión de riesgo y otros indicadores.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
