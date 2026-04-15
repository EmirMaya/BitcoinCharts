import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="text-text-secondary">
          BitAtlas © 2026. Contexto cripto con foco en Bitcoin.
        </p>
        <div className="flex items-center gap-5 text-text-muted">
          <Link href="/" className="hover:text-foreground">
            Inicio
          </Link>
          <Link href="/rainbow" className="hover:text-foreground">
            Rainbow Chart
          </Link>
          <Link href="/dca-calculator" className="hover:text-foreground">
            DCA Calculator
          </Link>
        </div>
      </div>
    </footer>
  );
}
