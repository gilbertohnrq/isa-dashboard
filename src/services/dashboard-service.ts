import { cloneSnapshot } from "@/mocks/dashboard-snapshots";
import type { DashboardPreset } from "@/features/dashboard/types";

export async function fetchDashboardSnapshot(preset: DashboardPreset) {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  return cloneSnapshot(preset);
}
