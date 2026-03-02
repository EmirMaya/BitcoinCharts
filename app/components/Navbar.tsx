"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/rainbow", label: "Rainbow Chart" },
] as const;

export default function Navbar() {
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

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", nextTheme);
  };

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

        <div className="flex items-center gap-6">
          <nav aria-label="Navegacion principal">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar modo claro/oscuro"
            className="rounded-md p-2 text-foreground hover:bg-background cursor-pointer"
          >
            <FiMoon size={20} className="block dark:hidden" />
            <FiSun size={20} className="hidden dark:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
