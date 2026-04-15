"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiChevronDown,
  FiDollarSign,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";

const CHART_ITEMS = [
  {
    href: "/rainbow",
    label: "Rainbow Chart",
    description: "Lectura histórica por bandas de valoración.",
    badge: "Histórico",
  },
  {
    href: "/realized",
    label: "Precio realizado",
    description: "Compara spot vs. costo base on-chain.",
    badge: "On-chain",
  },
  {
    href: "/dca-calculator",
    label: "Calculadora DCA",
    description: "Práctica simple para compras periódicas de Bitcoin.",
    badge: "Práctica",
  },
] as const;

const NAV_LINKS = [
  { href: "/#mercados", label: "Mercados" },
  { href: "/#enfoque", label: "Enfoque" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : systemPrefersDark
          ? "dark"
          : "light";

    root.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    function handleWindowClick() {
      setIsChartsOpen(false);
    }

    if (!isChartsOpen) {
      return;
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [isChartsOpen]);

  const closeMenus = () => {
    setIsChartsOpen(false);
    setIsMobileOpen(false);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <header
      aria-label="Barra de navegacion principal"
      className="sticky top-0 z-40 border-b border-border/80 bg-background-secondary/90 backdrop-blur"
    >
      <div className="mx-auto flex min-h-4 w-full max-w-7xl items-center justify-between gap-4 px-4  sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Ir a la pagina de inicio"
          onClick={closeMenus}
        >
          <Image
            className="block dark:hidden"
            src="/logo/BitAtlas_logo_gray_atlas.png"
            alt="BitAtlas"
            width={150}
            height={30}
            priority
          />
          <Image
            className="hidden dark:block"
            src="/logo/BitAtlas_logo_gold_transparent.png"
            alt="BitAtlas"
            width={150}
            height={30}
            priority
          />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <nav aria-label="Navegacion principal">
            <ul className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
              <li>
                <Link
                  href="/"
                  onClick={closeMenus}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 transition ${
                    pathname === "/"
                      ? "bg-card text-foreground shadow-sm"
                      : "hover:bg-card hover:text-foreground"
                  }`}
                >
                  Inicio
                </Link>
              </li>
              <li className="relative">
                <button
                  type="button"
                  aria-expanded={isChartsOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsChartsOpen((open) => !open);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition ${
                    pathname.startsWith("/rainbow") ||
                    pathname.startsWith("/realized") ||
                    pathname.startsWith("/dca-calculator")
                      ? "bg-card text-foreground shadow-sm"
                      : "hover:bg-card hover:text-foreground"
                  }`}
                >
                  Gráficos
                  <FiChevronDown
                    className={`transition ${isChartsOpen ? "rotate-180" : ""}`}
                    size={15}
                  />
                </button>

                {isChartsOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%+0.6rem)] w-80 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.16),transparent_42%)] p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                        Panel visual
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        Accesos rápidos para pasar del contexto histórico a lo
                        on-chain y a la práctica de DCA.
                      </p>
                    </div>
                    <div className="mt-2 space-y-1">
                      {CHART_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenus}
                          className={`block rounded-2xl px-4 py-3 transition ${
                            isActivePath(pathname, item.href)
                              ? "bg-background text-foreground"
                              : "hover:bg-background hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                  {item.label}
                                </p>
                                <span className="rounded-full border border-btc-soft bg-btc/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-btc">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-text-secondary">
                                {item.description}
                              </p>
                            </div>
                            <FiBarChart2 className="shrink-0 text-btc" size={16} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenus}
                    className="inline-flex items-center rounded-full px-4 py-1.5 transition hover:bg-card hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/dca-calculator"
            onClick={closeMenus}
            className="inline-flex items-center gap-2 rounded-full border border-btc-soft bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition hover:border-btc hover:text-btc"
          >
            <FiDollarSign size={15} />
            DCA
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar modo claro/oscuro"
            className="cursor-pointer rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-background"
          >
            <FiMoon size={17} className="block dark:hidden" />
            <FiSun size={17} className="hidden dark:block" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar modo claro/oscuro"
            className="cursor-pointer rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-background"
          >
            <FiMoon size={17} className="block dark:hidden" />
            <FiSun size={17} className="hidden dark:block" />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-label="Abrir menu de navegacion"
            aria-expanded={isMobileOpen}
            className="cursor-pointer rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-background"
          >
            {isMobileOpen ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div className="border-t border-border bg-background-secondary lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={closeMenus}
              className="block rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
            >
              Inicio
            </Link>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-btc">
                Gráficos
              </p>
              <div className="mt-3 space-y-2">
                {CHART_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-2xl bg-background px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <span className="rounded-full border border-btc-soft bg-btc/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-btc">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className="block rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
