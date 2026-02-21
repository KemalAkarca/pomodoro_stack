"use client";

// Navbar: aktif sayfayı vurgulayan modern menü + dark mode toggle

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tasks", label: "Tasks" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/stats", label: "Stats" },
];

export default function Navbar({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/60 p-1 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
      {/* Linkler */}
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                  // ✅ görünürlük için text renkleri
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Tema butonu */}
      <button
        onClick={onToggleTheme}
        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        title="Toggle theme"
        aria-label="Toggle theme"
        type="button"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </nav>
  );
}