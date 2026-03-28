"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassPanel } from "@/design-system/glass-panel";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", tag: "DG", index: "01" },
  { href: "/conteudos", label: "Conteudos", tag: "CT", index: "02" },
  { href: "/financeiro", label: "Financeiro", tag: "FN", index: "03" },
  { href: "/dados", label: "Dados", tag: "DD", index: "04" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <GlassPanel
      as="aside"
      tone="strong"
      className="workspace-sidebar border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06)),linear-gradient(180deg,rgba(27,29,33,0.92),rgba(20,22,24,0.74))]"
    >
      <div className="workspace-sidebar__brand">
        <div className="workspace-sidebar__brand-mark">TC</div>
        <div className="workspace-sidebar__brand-copy">
          <span className="workspace-sidebar__eyebrow">Partner</span>
          <strong className="workspace-sidebar__brand-title">Classic</strong>
        </div>
      </div>
      <nav className="workspace-sidebar__nav" aria-label="Paginas">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("workspace-sidebar__link", isActive && "workspace-sidebar__link--active")}
            >
              <span className="workspace-sidebar__index">{item.index}</span>
              <span className="workspace-sidebar__icon" aria-hidden="true">
                {item.tag}
              </span>
              <span className="workspace-sidebar__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </GlassPanel>
  );
}
