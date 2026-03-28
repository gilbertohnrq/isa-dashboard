"use client";

import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { WorkspaceFrame } from "@/features/navigation/workspace-frame";
import { useDashboardSnapshot } from "@/hooks/use-dashboard-snapshot";

export function DashboardShell() {
  const { snapshot, isLoading, setPreset } = useDashboardSnapshot();

  return (
    <WorkspaceFrame>
      {isLoading || !snapshot ? (
        <DashboardSkeleton />
      ) : (
        <DashboardView snapshot={snapshot} onPresetChange={setPreset} />
      )}
    </WorkspaceFrame>
  );
}
