"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Users, CalendarDays, Wallet, Target, Handshake, Sparkles } from "lucide-react";
import { adminLogout } from "@/app/actions/adminLogout";

const items = [
  { href: "/admin", label: "Aanvragen", Icon: Inbox, match: (p: string) => p === "/admin" },
  { href: "/admin/assistent", label: "Assistent", Icon: Sparkles, match: (p: string) => p.startsWith("/admin/assistent") },
  { href: "/admin/pipeline", label: "Pipeline", Icon: Target, match: (p: string) => p.startsWith("/admin/pipeline") },
  { href: "/admin/verwijzers", label: "Verwijzers", Icon: Handshake, match: (p: string) => p.startsWith("/admin/verwijzers") },
  { href: "/admin/agenda", label: "Agenda", Icon: CalendarDays, match: (p: string) => p.startsWith("/admin/agenda") },
  { href: "/admin/clienten", label: "Cliënten", Icon: Users, match: (p: string) => p.startsWith("/admin/clienten") },
  { href: "/admin/budget", label: "Budget", Icon: Wallet, match: (p: string) => p.startsWith("/admin/budget") },
];

export function AdminNav() {
  const pathname = usePathname();

  const logout = (
    <form action={adminLogout}>
      <button
        type="submit"
        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] transition-colors"
      >
        Uitloggen
      </button>
    </form>
  );

  return (
    <aside className="sm:w-56 sm:shrink-0 sm:min-h-screen bg-white dark:bg-[#02191c] border-b sm:border-b-0 sm:border-r border-[#ede7db] dark:border-[#086370] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-heading text-lg text-[#064a54] dark:text-white leading-tight">Parkstad Thuiszorg</div>
          <div className="text-xs text-[#8a9a8a]">Beheer</div>
        </div>
        <div className="sm:hidden">{logout}</div>
      </div>

      <nav className="flex sm:flex-col gap-1">
        {items.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors " +
                (active
                  ? "bg-[#064a54] text-white dark:bg-[#0b3b42] dark:text-white"
                  : "text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30]")
              }
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden sm:block sm:mt-auto">{logout}</div>
    </aside>
  );
}
