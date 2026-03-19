"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "TASKS", path: "/tasks" },
    { name: "DEEP FOCUS", path: "/pomodoro" },
    { name: "STATS", path: "/stats" },
  ];

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] px-10 py-5 flex justify-between items-center shadow-2xl shadow-blue-500/5">
          
          {/* LOGO - Biraz daha büyütüldü */}
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white">
            FOCUS<span className="text-blue-600">OS</span>
          </Link>

          {/* MENÜ - Merkeze daha yakın ve daha iddialı */}
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-[11px] font-black tracking-[0.3em] transition-all duration-300 ${
                  pathname === item.path
                    ? "text-blue-600 scale-110"
                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* SAĞ TARAF - Toggle */}
          <div className="flex items-center gap-6 border-l border-slate-100 dark:border-white/10 pl-8">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}