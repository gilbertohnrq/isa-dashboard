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
      <div className="mt-[42px] flex flex-col gap-6 xl:flex-row xl:gap-[61px]">
        <div className="flex w-full flex-col gap-6 xl:w-[435px] xl:gap-[64px]">
          <ProfileCard snapshot={snapshot.profile} />
          <LogCard snapshot={snapshot.log} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6 xl:w-[1363px] xl:gap-[64px]">
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
            <ContractCard snapshot={snapshot.contract} />
            <ContentMetricsCard snapshot={snapshot.contentMetrics} />
            <FinanceCard snapshot={snapshot.finance} />
          </div>
          <HoursCard snapshot={snapshot.hours} />
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
            <SocialsCard snapshot={snapshot.socials} />
            <DataCard snapshot={snapshot.partnerData} />
          </div>
        </div>
      </div>
      <Footer copyright={snapshot.footer} />
    </div>
  );
}
