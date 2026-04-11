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
    <header className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <StatusPill
          title={snapshot.status.title}
          label={snapshot.status.label}
          tone={snapshot.status.tone}
        />
        <div className="relative flex size-[52px] items-center justify-center overflow-hidden rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08)),rgba(235,240,255,0.06)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Image
            alt="The Classic Alvorecer"
            src={snapshot.gameLogoSrc}
            width={60}
            height={52}
            className="relative z-10 h-[38px] w-[42px] object-contain"
            unoptimized
          />
        </div>
        <div className="glass-button-shell flex h-[52px] items-center gap-2 rounded-full border border-white/14 px-[10px]">
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
      <div className="flex justify-center xl:flex-1 xl:px-2">
        <SegmentedStepper
          value={snapshot.activePreset}
          onChange={(preset) => {
            startTransition(() => onPresetChange(preset));
          }}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="glass-button-shell flex h-[36px] items-center rounded-full px-[14px] text-[11px] font-[510] tracking-[-0.08px] text-white">
          <span>{snapshot.dateLabel}</span>
        </div>
        {snapshot.timeLabel ? (
          <div className="glass-button-shell flex h-[36px] items-center rounded-full px-[12px] text-[11px] font-[510] tracking-[-0.08px] text-white">
            <span>{snapshot.timeLabel}</span>
          </div>
        ) : null}
        <div className="pr-[2px]">
          <GlassSwitch checked={snapshot.liveEnabled} />
        </div>
        <div className="relative flex size-[52px] items-center justify-center overflow-hidden rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08)),rgba(235,240,255,0.06)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Image
            alt="Discord logo"
            src={snapshot.discordLogoSrc}
            width={60}
            height={60}
            className="relative z-10 h-[38px] w-[38px] object-contain"
            unoptimized
          />
        </div>
      </div>
    </header>
  );
}
