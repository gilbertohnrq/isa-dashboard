import { startTransition } from "react";
import Image from "next/image";

import { GlassSwitch } from "@/design-system/glass-switch";
import { IconOrb } from "@/design-system/icon-orb";
import { SegmentedStepper } from "@/design-system/segmented-stepper";
import { StatusPill } from "@/design-system/status-pill";
import type { DashboardPreset, PartnerDashboardSnapshot } from "@/features/dashboard/types";

export function DashboardTopBar({
  snapshot,
  onPresetChange,
}: {
  snapshot: PartnerDashboardSnapshot["topBar"];
  onPresetChange: (preset: DashboardPreset) => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 xl:flex-nowrap">
      <div className="flex flex-wrap items-center gap-4">
        <StatusPill
          title={snapshot.status.title}
          label={snapshot.status.label}
          tone={snapshot.status.tone}
        />
        <div className="relative flex size-[70px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/14 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Image
            alt="The Classic Alvorecer"
            src={snapshot.gameLogoSrc}
            width={60}
            height={52}
            className="relative z-10 h-[52px] w-[60px] object-contain"
            unoptimized
          />
        </div>
        <div className="flex h-[70px] items-center gap-2 rounded-full border border-white/10 bg-[#242424]/90 px-[14px] shadow-[var(--shadow-button)] backdrop-blur-xl">
          {snapshot.actions.map((action) => (
            <IconOrb
              key={action.id}
              src={action.src}
              alt={action.label}
              tone={action.tone}
              precomposed={action.precomposed}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-1 justify-center xl:flex-none">
        <SegmentedStepper
          value={snapshot.activePreset}
          onChange={(preset) => {
            startTransition(() => onPresetChange(preset));
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="glass-button-shell flex h-[34px] items-center rounded-full px-[17px] text-[12px] font-[510] text-white">
          <span>{snapshot.dateLabel}</span>
          {snapshot.timeLabel ? <span className="ml-3">{snapshot.timeLabel}</span> : null}
        </div>
        <GlassSwitch checked={snapshot.liveEnabled} />
        <div className="relative flex size-[70px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/14 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Image
            alt="Discord logo"
            src={snapshot.discordLogoSrc}
            width={60}
            height={60}
            className="relative z-10 h-[60px] w-[60px] object-contain"
            unoptimized
          />
        </div>
      </div>
    </header>
  );
}
