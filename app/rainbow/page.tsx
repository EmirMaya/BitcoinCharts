// import RainbowChart from './rainbow-chart';

export const metadata = {
  title: "Bitcoin Rainbow Chart",
  description: "Visualizacion del Bitcoin Chart (Informativo)",
};

export default function RainbowPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Bitcoin Rainbow Chart</h1>
          <p className="text-sm text-neutral-600">
            Gráfico informativo basado en datos públicos. No es consejo
            financiero.
          </p>
        </header>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          {/* <RainbowChart /> */}
        </div>
        <section className="rounded-2xl bordeer bg-white p-4 shadow-sm space-y-2">
          <h2 className="text-xl font-semibold">Como leerlo</h2>
          <p className="">
              La idea del “rainbow” es mostrar bandas de valoración histórica alrededor del
            precio. Úsalo como referencia educativa, no como señal exacta.
          </p>
        </section>
      </div>
    </main>
  );
}
