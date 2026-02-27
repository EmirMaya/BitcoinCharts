"use client";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/rainbow", label: "Rainbow Chart" },
] as const;

export default function Navbar() {
  return (
    <header
      aria-label="Barra de navegacion principal"
      className="bg-background-secondary"
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Ir a la pagina de inicio"
        >
          <Image
            className="block dark:hidden"
            src="/logo/BitAtlas_logo_gray_atlas.png"
            alt="BitAtlas"
            width={180}
            height={50}
            priority
          />
          <Image
            className="hidden dark:block"
            src="/logo/BitAtlas_logo_gold_transparent.png"
            alt="BitAtlas"
            width={180}
            height={50}
            priority
          />
        </Link>

        <nav aria-label="Navegacion principal">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style jsx>{`
        .logo-dark {
          display: none;
        }

        @media (prefers-color-scheme: dark) {
          .logo-light {
            display: none;
          }

          .logo-dark {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
