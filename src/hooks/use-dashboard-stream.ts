"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { subscribeToDashboardStream, applyDashboardStreamEvent } from "@/services/dashboard-stream";
import type { PartnerDashboardSnapshot } from "@/features/dashboard/types";

export function useDashboardStream(snapshot: PartnerDashboardSnapshot | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    return subscribeToDashboardStream(snapshot, (event) => {
      queryClient.setQueryData<PartnerDashboardSnapshot>(
        ["dashboard-snapshot", snapshot.preset],
        (current) => {
          if (!current) {
            return current;
          }

          return applyDashboardStreamEvent(current, event);
        },
      );
    });
  }, [queryClient, snapshot]);
}
