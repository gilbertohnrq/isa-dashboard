"use client";

import { useDeferredValue, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDashboardStore } from "@/features/dashboard/dashboard-store";
import { useDashboardStream } from "@/hooks/use-dashboard-stream";
import { fetchCriadorSnapshot, fetchDashboardSnapshot } from "@/services/dashboard-service";

export function useDashboardSnapshot(criadorId?: string) {
  const preset = useDashboardStore((state) => state.preset);
  const syncSnapshotState = useDashboardStore((state) => state.syncSnapshotState);
  const setPreset = useDashboardStore((state) => state.setPreset);
  const deferredPreset = useDeferredValue(preset);

  const query = useQuery({
    queryKey: criadorId
      ? ["criador-snapshot", criadorId]
      : ["dashboard-snapshot", deferredPreset],
    queryFn: criadorId
      ? () => fetchCriadorSnapshot(criadorId)
      : () => fetchDashboardSnapshot(deferredPreset),
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

  useDashboardStream(criadorId ? undefined : query.data);

  return {
    snapshot: query.data,
    isLoading: !query.data,
    setPreset,
  };
}
