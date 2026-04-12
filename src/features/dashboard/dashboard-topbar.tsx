import Image from "next/image";
import { Link } from "next-view-transitions";

import { StatusPill } from "@/design-system/status-pill";
import { cn } from "@/lib/utils";
import type { DashboardTopBar as DashboardTopBarSnapshot } from "@/features/dashboard/types";

type NavigationItem = {
  href: string;
  label: string;
  isActive: boolean;
};

export function DashboardTopBar({
  snapshot,
  backHref,
  backLabel,
  navigation,
}: {
  snapshot: DashboardTopBarSnapshot;
  backHref: string;
  backLabel: string;
  navigation: NavigationItem[];
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-3">
          <StatusPill
            title={snapshot.status.title}
            label={snapshot.status.label}
            tone={snapshot.status.tone}
          />
          <div className="creator-topbar__logo">
            <Image
              alt="The Classic Alvorecer"
              src={snapshot.gameLogoSrc}
              width={60}
              height={52}
              className="relative z-10 h-[38px] w-[42px] object-contain"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-[23px] font-semibold tracking-[-0.05em] text-white">
              {snapshot.heading}
            </p>
            <p className="mt-1 text-[14px] text-white/56">{snapshot.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="glass-button-shell flex h-[36px] items-center rounded-full px-[14px] text-[11px] font-[510] tracking-[0.12em] text-white/68 uppercase">
            <span>{snapshot.dateLabel}</span>
          </div>
          <Link href={backHref} className="creator-back-link">
            {backLabel}
          </Link>
        </div>
      </div>

      <nav className="creator-section-nav" aria-label="Seções do criador">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("creator-section-nav__link", item.isActive && "creator-section-nav__link--active")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

