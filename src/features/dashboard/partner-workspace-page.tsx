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
import { DashboardView } from "@/features/dashboard/dashboard-view";
import type { PartnerDashboardSnapshot } from "@/features/dashboard/types";
import { getCreatorSectionLinks } from "@/features/creators/server";
import type { CreatorSection } from "@/features/creators/types";
import { WorkspaceFrame } from "@/features/navigation/workspace-frame";

export function PartnerWorkspacePage({
  section,
  criadorId,
  snapshot,
}: {
  section: CreatorSection;
  criadorId: string;
  snapshot: PartnerDashboardSnapshot;
}) {
  const navigation = getCreatorSectionLinks(criadorId, section);
  const viewTransitionName = `avatar-${criadorId}`;

  return (
    <WorkspaceFrame>
      <div className="dashboard-shell">
        <DashboardTopBar
          snapshot={snapshot.topBar}
          backHref="/"
          backLabel="Voltar para a lista"
          navigation={navigation}
        />

        <div className="mt-5">
          {section === "dashboard" ? renderOverview(snapshot, viewTransitionName) : renderSection(snapshot, section)}
        </div>

        <Footer copyright={snapshot.footer} />
      </div>
    </WorkspaceFrame>
  );
}

function renderOverview(snapshot: PartnerDashboardSnapshot, viewTransitionName?: string) {
  return <DashboardView snapshot={snapshot} viewTransitionName={viewTransitionName} />;
}

function renderSection(snapshot: PartnerDashboardSnapshot, section: Exclude<CreatorSection, "dashboard">) {
  if (section === "conteudos") {
    return (
      <div className="flex flex-col gap-6 xl:gap-[var(--content-gap)]">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <ContentMetricsCard snapshot={snapshot.contentMetrics} />
          <SocialsCard snapshot={snapshot.socials} />
        </div>
        <HoursCard snapshot={snapshot.hours} />
      </div>
    );
  }

  if (section === "financeiro") {
    return (
      <div className="flex flex-col gap-6 xl:gap-[var(--content-gap)]">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <ContractCard snapshot={snapshot.contract} />
          <FinanceCard snapshot={snapshot.finance} />
        </div>
        <HoursCard snapshot={snapshot.hours} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 xl:gap-[var(--content-gap)]">
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <ProfileCard snapshot={snapshot.profile} />
        <DataCard snapshot={snapshot.partnerData} />
      </div>
      <LogCard snapshot={snapshot.log} />
    </div>
  );
}
