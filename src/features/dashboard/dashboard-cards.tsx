import Image from "next/image";

import { GaugeMetric } from "@/design-system/gauge-metric";
import { GlassChip } from "@/design-system/glass-chip";
import { GlassPanel } from "@/design-system/glass-panel";
import { NotificationItem } from "@/design-system/notification-item";
import { ProgressMetric } from "@/design-system/progress-metric";
import { CreatorAvatar } from "@/features/creators/creator-avatar";
import type { PartnerDashboardSnapshot } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-white/[0.025] px-5 text-center">
      <p className="text-[16px] font-semibold tracking-[-0.04em] text-white">{title}</p>
      <p className="mt-2 max-w-[26rem] text-[13px] leading-6 text-white/52">{description}</p>
    </div>
  );
}

export function ProfileCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["profile"] }) {
  return (
    <GlassPanel className="h-auto p-[18px] xl:h-[490px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-4 flex flex-col items-center">
        <CreatorAvatar
          name={snapshot.name}
          initials={snapshot.initials ?? snapshot.name.slice(0, 2).toUpperCase()}
          src={snapshot.imageSrc}
          className="size-[252px] xl:size-[349px]"
          fallbackClassName="text-[54px] font-semibold tracking-[0.16em] xl:text-[74px]"
        />
        <div className="glass-button-shell mt-4 flex min-h-[34px] min-w-[92px] items-center justify-center rounded-full px-4 py-2 text-center text-[16px] font-[590] text-white">
          {snapshot.name}
        </div>
        {snapshot.subtitle ? (
          <p className="mt-3 text-center text-[13px] leading-6 text-white/56">{snapshot.subtitle}</p>
        ) : null}
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
        <span className="glass-button-shell mt-0.5 inline-flex min-h-[24px] shrink-0 items-center rounded-full px-3 py-1 text-[11px] text-white">
          {snapshot.alias}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {snapshot.chips.length > 0 ? (
          snapshot.chips.map((chip) => <GlassChip key={chip.label} label={chip.label} tone={chip.tone} />)
        ) : (
          <span className="creator-card__chip">Sem plataforma principal</span>
        )}
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
  const hasIntegratedData = snapshot.gauges.some((metric) => metric.hasData);

  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[259px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>

      {hasIntegratedData ? (
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
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {snapshot.gauges.map((metric) => (
            <div key={metric.label} className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
              <p className="text-[12px] uppercase tracking-[0.18em] text-white/35">{metric.label}</p>
              <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-white">
                {metric.max > 0 ? metric.max : "—"}
              </p>
              <p className="mt-1 text-[13px] text-white/48">Meta contratada</p>
            </div>
          ))}
          {snapshot.emptyMessage ? (
            <div className="sm:col-span-2">
              <EmptyState title="Sem dados de progresso" description={snapshot.emptyMessage} />
            </div>
          ) : null}
        </div>
      )}
    </GlassPanel>
  );
}

export function FinanceCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["finance"] }) {
  const showCashback = snapshot.hasCashbackData ?? true;
  const showMoney = snapshot.hasMoneyData ?? true;

  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[259px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      <div className="mt-3 grid h-auto grid-rows-2 gap-3 xl:h-[190px]">
        <div className="rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-[510] text-white">Cashback TCC</span>
            {showCashback ? (
              <span className="dashboard-number-xl text-[30px] xl:text-[36px]">
                {formatMoney(snapshot.cashback)}
              </span>
            ) : (
              <span className="text-[13px] text-white/48">Sem dados ainda</span>
            )}
          </div>
        </div>
        <div className="rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-[510] text-white">Valor base</span>
            {showMoney ? (
              <span className="dashboard-number-xl text-[30px] xl:text-[36px]">
                R$ {formatMoney(snapshot.money)}
              </span>
            ) : (
              <span className="text-[13px] text-white/48">Sem dados ainda</span>
            )}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function HoursCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["hours"] }) {
  const hasIntegratedData = snapshot.hasData ?? true;

  return (
    <GlassPanel className="h-auto p-[18px] pb-2 xl:h-[265px]">
      <h2 className="dashboard-text-title">{snapshot.title}</h2>
      {hasIntegratedData ? (
        <ProgressMetric current={snapshot.current} target={snapshot.target} unit={snapshot.unit} />
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
          <EmptyState
            title="Sem horas integradas"
            description="A meta contratada já está carregada, mas o acompanhamento automático ainda não foi conectado."
          />
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/35">Meta</p>
            <p className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-white">
              {snapshot.target > 0 ? snapshot.target : "—"}
            </p>
            <p className="text-[13px] text-white/52">{snapshot.unit}</p>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}

export function SocialsCard({ snapshot }: { snapshot: PartnerDashboardSnapshot["socials"] }) {
  return (
    <GlassPanel className="h-auto w-full p-[18px] xl:h-[265px]">
      <div className="flex items-start justify-between gap-4">
        <h2 className="dashboard-text-title">{snapshot.title}</h2>
        {snapshot.emptyMessage ? (
          <p className="max-w-[220px] text-right text-[12px] leading-5 text-white/42">
            {snapshot.emptyMessage}
          </p>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 xl:grid-cols-6">
        {snapshot.items.map((item) => {
          const content = (
            <>
              {item.standalone && item.src ? (
                <div className="relative h-[74px] w-[74px] xl:h-[90px] xl:w-[90px]">
                  <Image alt={item.label} fill src={item.src} className="object-contain" unoptimized />
                </div>
              ) : (
                <div
                  className={cn(
                    "relative flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08)),rgba(235,240,255,0.08)] shadow-[var(--shadow-soft)] backdrop-blur-[18px] transition duration-200 xl:h-[90px] xl:w-[90px]",
                    item.isAvailable
                      ? "group-hover:border-white/30 group-hover:bg-white/[0.16]"
                      : "opacity-55",
                  )}
                >
                  {item.src ? (
                    <Image
                      alt={item.label}
                      width={50}
                      height={50}
                      src={item.src}
                      className="relative z-10 h-[32px] w-[32px] object-contain xl:h-[50px] xl:w-[50px]"
                      unoptimized
                    />
                  ) : (
                    <span className="relative z-10 text-[17px] font-semibold tracking-[0.18em] text-white">
                      {item.monogram ?? item.label.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              )}
              <span className="mt-2 text-[13px] font-[510] leading-none text-white">{item.label}</span>
              <span className="dashboard-text-detail mt-1">{item.value}</span>
            </>
          );

          if (item.href) {
            return (
              <a
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-w-0 flex-col items-center rounded-[22px] px-2 py-2 transition duration-200 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/28"
              >
                {content}
              </a>
            );
          }

          return (
            <div key={item.platform} className="flex min-w-0 flex-col items-center rounded-[22px] px-2 py-2">
              {content}
            </div>
          );
        })}
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
            <span className="dashboard-text-detail break-words">{field.value}</span>
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
      {snapshot.items.length > 0 ? (
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
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Nada registrado por enquanto"
            description={snapshot.emptyMessage ?? "Os eventos operacionais do criador ainda não foram integrados."}
          />
        </div>
      )}
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

