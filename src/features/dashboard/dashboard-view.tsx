import type { DashboardPreset, PartnerDashboardSnapshot } from "@/features/dashboard/types";

import {
  ContentMetricsCard,
  ContractCard,
  DataCard,
  FinanceCard,
  Footer,
  HoursCard,
  LogCard,
  ProfileCard,
  SocialsCard,
} from "@/features/dashboard/dashboard-cards";
import { DashboardTopBar } from "@/features/dashboard/dashboard-topbar";

export function DashboardView({
  snapshot,
  onPresetChange,
}: {
  snapshot: PartnerDashboardSnapshot;
  onPresetChange: (preset: DashboardPreset) => void;
}) {
  return (
    <div className="dashboard-shell">
      <DashboardTopBar snapshot={snapshot.topBar} onPresetChange={onPresetChange} />
      <div className="mt-7 flex flex-col gap-5 xl:flex-row xl:gap-[var(--shell-gap)]">
        <div className="flex w-full flex-col gap-5 xl:w-[var(--sidebar-width)] xl:gap-[var(--sidebar-gap)]">
          <ProfileCard snapshot={snapshot.profile} />
          <LogCard snapshot={snapshot.log} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 xl:gap-[var(--content-gap)]">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-[var(--content-gap)]">
            <ContractCard snapshot={snapshot.contract} />
            <ContentMetricsCard snapshot={snapshot.contentMetrics} />
            <FinanceCard snapshot={snapshot.finance} />
          </div>
          <HoursCard snapshot={snapshot.hours} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-[var(--content-gap)]">
            <SocialsCard snapshot={snapshot.socials} />
            <DataCard snapshot={snapshot.partnerData} />
          </div>
        </div>
      </div>
      <Footer copyright={snapshot.footer} />
    </div>
  );
}
