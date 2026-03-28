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
    <GlassPanel className="h-[490px] p-[25px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-5 flex flex-col items-center">
        <div className="relative size-[349px] overflow-hidden rounded-full">
          <Image
            alt={snapshot.name}
            fill
            src={snapshot.imageSrc}
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/4" />
        </div>
        <div className="glass-button-shell mt-[13px] flex h-[44px] min-w-[89px] items-center justify-center rounded-full px-[17px] text-[24px] font-[590] text-white">
          {snapshot.name}
        </div>
      </div>
    </GlassPanel>
  );
}

export function ContractCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["contract"] }) {
  return (
    <GlassPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 flex items-center gap-3">
        <p className="text-[20px] font-[510] tracking-[-0.2px] text-[var(--text-tertiary)]">
          {snapshot.partnerName}
        </p>
        <span className="glass-button-shell inline-flex h-[26px] items-center rounded-full px-3 text-[12px] text-white">
          {snapshot.alias}
        </span>
      </div>
      <div className="mt-[43px] flex gap-2">
        {snapshot.chips.map((chip) => (
          <GlassChip key={chip.label} label={chip.label} tone={chip.tone} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-[25px] gap-y-[14px]">
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
    <GlassPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-[23px] flex items-center justify-center gap-8">
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
    <GlassPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-[15px] flex flex-col items-center">
        <div className="relative flex h-[148px] w-[260px] flex-col items-center justify-center">
          <Image
            alt=""
            width={35}
            height={35}
            src="/figma-assets/coin.svg"
            className="absolute left-[28px] top-[56px] h-[35px] w-[35px]"
            unoptimized
          />
          <span className="dashboard-number-xl ml-8">{formatMoney(snapshot.cashback)}</span>
          <span className="mt-3 text-[16px] font-[510] text-white">Cashback TCC</span>
        </div>
        <div className="relative mt-[-6px] flex h-[148px] w-[336px] flex-col items-center justify-center">
          <span className="dashboard-number-xl">R$ {formatMoney(snapshot.money)}</span>
          <span className="mt-3 text-[16px] font-[510] text-white">Dinheiro</span>
        </div>
      </div>
    </GlassPanel>
  );
}

export function HoursCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["hours"] }) {
  return (
    <GlassPanel className="h-[265px] p-[25px] pb-[10px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <ProgressMetric current={snapshot.current} target={snapshot.target} unit={snapshot.unit} />
    </GlassPanel>
  );
}

export function SocialsCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["socials"] }) {
  return (
    <GlassPanel className="h-[265px] w-full p-[25px] 2xl:w-[649px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-[38px] flex items-start justify-between gap-3">
        {snapshot.items.map((item) => (
          <div key={item.platform} className="flex w-[90px] flex-col items-center">
            {item.standalone ? (
              <div className="relative h-[91px] w-[90px]">
                <Image alt={item.label} fill src={item.src} className="object-contain" unoptimized />
              </div>
            ) : (
              <div className="relative flex h-[91px] w-[90px] items-center justify-center overflow-hidden rounded-full bg-white/5 opacity-75">
                <div className="absolute inset-0 rounded-full bg-[rgba(17,17,17,0.6)] [mix-blend-mode:luminosity]" />
                <div className="absolute inset-0 rounded-full bg-[#919191] [mix-blend-mode:color-dodge]" />
                <div className="absolute inset-0 rounded-full bg-[#222] [mix-blend-mode:plus-lighter]" />
                <Image
                  alt={item.label}
                  width={50}
                  height={50}
                  src={item.src}
                  className="relative z-10 h-[50px] w-[50px] object-contain"
                  unoptimized
                />
              </div>
            )}
            <span className="mt-4 text-[15px] font-[510] leading-none text-white">{item.label}</span>
            <span className="dashboard-text-detail mt-1">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function DataCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["partnerData"] }) {
  return (
    <GlassPanel className="h-[265px] w-full p-[25px] 2xl:w-[649px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-[15px] grid grid-cols-3 gap-x-[17px] gap-y-[18px]">
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
    <GlassPanel className="h-[475px] p-[25px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-[34px] flex flex-col gap-[23px]">
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
    <footer className="mt-8 flex justify-center xl:mt-[26px]">
      <span className="dashboard-text-detail text-center">{copyright}</span>
    </footer>
  );
}
