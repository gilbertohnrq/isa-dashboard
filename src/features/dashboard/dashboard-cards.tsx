import Image from "next/image";

import { GaugeMetric } from "@/design-system/gauge-metric";
import { GlassChip } from "@/design-system/glass-chip";
import { GlassPanel } from "@/design-system/glass-panel";
import { NotificationItem } from "@/design-system/notification-item";
import { ProgressMetric } from "@/design-system/progress-metric";
import type { PartnerDashboardSnapshot } from "@/features/dashboard/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ProfileCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["profile"] }) {
  return (
    <GlassPanel className="h-auto p-[18px] xl:h-[490px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 flex flex-col items-center">
        <div className="relative size-[252px] overflow-hidden rounded-full xl:size-[349px]">
          <Image
            alt={snapshot.name}
            fill
            src={snapshot.imageSrc}
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/4" />
        </div>
        <div className="glass-button-shell mt-3 flex h-[34px] min-w-[78px] items-center justify-center rounded-full px-4 text-[16px] font-[590] text-white">
          {snapshot.name}
        </div>
      </div>
    </GlassPanel>
  );
}

export function ContractCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["contract"] }) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[259px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="max-w-[188px] text-[16px] font-[510] leading-[1.3] tracking-[-0.2px] text-[var(--text-tertiary)]">
          {snapshot.partnerName}
        </p>
        <span className="glass-button-shell mt-0.5 inline-flex h-[24px] shrink-0 items-center rounded-full px-3 text-[11px] text-white">
          {snapshot.alias}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {snapshot.chips.map((chip) => (
          <GlassChip key={chip.label} label={chip.label} tone={chip.tone} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {snapshot.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="dashboard-text-label">{stat.label}</span>
            <span className="dashboard-text-detail">{stat.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function ContentMetricsCard({
  snapshot,
}: {
  snapshot: PartnerDashboardSnapshot["contentMetrics"];
}) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[259px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 flex h-auto items-center justify-around gap-2 xl:h-[148px]">
        {snapshot.gauges.map((metric) => (
          <GaugeMetric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            max={metric.max}
            tone={snapshot.accentTone}
          />
        ))}
      </div>
    </GlassPanel>
  );
}

export function FinanceCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["finance"] }) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[259px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 grid h-auto grid-rows-2 gap-1.5 xl:h-[190px]">
        <div className="relative flex min-h-0 w-full min-w-0 flex-col items-center justify-center px-3 text-center">
          <Image
            alt=""
            width={35}
            height={35}
            src="/figma-assets/coin.svg"
            className="absolute left-2 top-1/2 h-[24px] w-[24px] -translate-y-1/2 sm:left-4 sm:h-[28px] sm:w-[28px]"
            unoptimized
          />
          <span className="dashboard-number-xl ml-5 text-[32px] xl:text-[40px]">
            {formatMoney(snapshot.cashback)}
          </span>
          <span className="mt-1 text-[13px] font-[510] text-white">Cashback TCC</span>
        </div>
        <div className="relative flex min-h-0 w-full min-w-0 flex-col items-center justify-center px-3 text-center">
          <span className="dashboard-number-xl text-[32px] xl:text-[40px]">
            R$ {formatMoney(snapshot.money)}
          </span>
          <span className="mt-1 text-[13px] font-[510] text-white">Dinheiro</span>
        </div>
      </div>
    </GlassPanel>
  );
}

export function HoursCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["hours"] }) {
  return (
    <GlassPanel className="h-auto p-[18px] pb-2 xl:h-[265px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <ProgressMetric current={snapshot.current} target={snapshot.target} unit={snapshot.unit} />
    </GlassPanel>
  );
}

export function SocialsCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["socials"] }) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[265px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 xl:grid-cols-5">
        {snapshot.items.map((item) => (
          <div key={item.platform} className="flex min-w-0 flex-col items-center">
            {item.standalone ? (
              <div className="relative h-[74px] w-[74px] xl:h-[90px] xl:w-[90px]">
                <Image alt={item.label} fill src={item.src} className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="relative flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08)),rgba(235,240,255,0.08)] shadow-[var(--shadow-soft)] backdrop-blur-[18px] xl:h-[90px] xl:w-[90px]">
                <Image
                  alt={item.label}
                  width={50}
                  height={50}
                  src={item.src}
                  className="relative z-10 h-[32px] w-[32px] object-contain xl:h-[50px] xl:w-[50px]"
                  unoptimized
                />
              </div>
            )}
            <span className="mt-2 text-[13px] font-[510] leading-none text-white">{item.label}</span>
            <span className="dashboard-text-detail mt-1">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function DataCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["partnerData"] }) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[265px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
        {snapshot.fields.map((field) => (
          <div key={field.label} className="flex min-w-0 flex-col">
            <span className="dashboard-text-label">{field.label}</span>
            <span className="dashboard-text-detail truncate">{field.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function LogCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["log"] }) {
  return (
    <GlassPanel className="h-auto p-[18px] xl:h-[475px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-4 flex flex-col gap-4 xl:gap-[23px]">
        {snapshot.items.map((item, index) => (
          <NotificationItem
            key={`${item.title}-${index}`}
            title={item.title}
            description={item.description}
            time={item.time}
            iconSrc={item.iconSrc}
          />
        ))}
      </div>
    </GlassPanel>
  );
}

export function Footer({ copyright }: { copyright: string }) {
  return (
    <footer className="mt-6 flex justify-center xl:mt-5">
      <span className="dashboard-text-detail text-center">{copyright}</span>
    </footer>
  );
}
