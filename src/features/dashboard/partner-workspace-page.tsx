"use client";

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
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { DashboardTopBar } from "@/features/dashboard/dashboard-topbar";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { WorkspaceFrame } from "@/features/navigation/workspace-frame";
import { useDashboardSnapshot } from "@/hooks/use-dashboard-snapshot";

export type WorkspaceSection = "dashboard" | "conteudos" | "financeiro" | "dados";

export function PartnerWorkspacePage({ section }: { section: WorkspaceSection }) {
  const { snapshot, isLoading, setPreset } = useDashboardSnapshot();

  if (isLoading || !snapshot) {
    return (
      <WorkspaceFrame>
        <DashboardSkeleton />
      </WorkspaceFrame>
    );
  }

  return <WorkspaceFrame>{renderSection(snapshot)}</WorkspaceFrame>;

  function renderSection(currentSnapshot: NonNullable<typeof snapshot>) {
    if (section === "dashboard") {
      return <DashboardView snapshot={currentSnapshot} onPresetChange={setPreset} />;
    }

    if (section === "conteudos") {
      return (
        <div className="dashboard-shell">
          <DashboardTopBar snapshot={currentSnapshot.topBar} onPresetChange={setPreset} />
          <div className="mt-[42px] flex flex-col gap-6 xl:gap-[64px]">
            <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
              <ContentMetricsCard snapshot={currentSnapshot.contentMetrics} />
              <SocialsCard snapshot={currentSnapshot.socials} />
            </div>
            <HoursCard snapshot={currentSnapshot.hours} />
          </div>
          <Footer copyright={currentSnapshot.footer} />
        </div>
      );
    }

    if (section === "financeiro") {
      return (
        <div className="dashboard-shell">
          <DashboardTopBar snapshot={currentSnapshot.topBar} onPresetChange={setPreset} />
          <div className="mt-[42px] flex flex-col gap-6 xl:gap-[64px]">
            <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
              <ContractCard snapshot={currentSnapshot.contract} />
              <FinanceCard snapshot={currentSnapshot.finance} />
            </div>
            <HoursCard snapshot={currentSnapshot.hours} />
          </div>
          <Footer copyright={currentSnapshot.footer} />
        </div>
      );
    }

    return (
      <div className="dashboard-shell">
        <DashboardTopBar snapshot={currentSnapshot.topBar} onPresetChange={setPreset} />
        <div className="mt-[42px] flex flex-col gap-6 xl:gap-[64px]">
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
            <ProfileCard snapshot={currentSnapshot.profile} />
            <DataCard snapshot={currentSnapshot.partnerData} />
          </div>
          <LogCard snapshot={currentSnapshot.log} />
        </div>
        <Footer copyright={currentSnapshot.footer} />
      </div>
    );
  }
}
