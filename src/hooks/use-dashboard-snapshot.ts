"use client";

import { useDeferredValue, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDashboardStore } from "@/features/dashboard/dashboard-store";
import { useDashboardStream } from "@/hooks/use-dashboard-stream";
import { fetchDashboardSnapshot } from "@/services/dashboard-service";

export function useDashboardSnapshot() {
  const preset = useDashboardStore((state) => state.preset);
  const syncSnapshotState = useDashboardStore((state) => state.syncSnapshotState);
  const setPreset = useDashboardStore((state) => state.setPreset);
  const deferredPreset = useDeferredValue(preset);

  const query = useQuery({
    queryKey: ["dashboard-snapshot", deferredPreset],
    queryFn: () => fetchDashboardSnapshot(deferredPreset),
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    syncSnapshotState({
      liveEnabled: query.data.topBar.liveEnabled,
      periodMode: query.data.topBar.periodMode,
    });
  }, [query.data, syncSnapshotState]);

  useDashboardStream(query.data);

  return {
    snapshot: query.data,
    isLoading: !query.data,
    setPreset,
  };
}
