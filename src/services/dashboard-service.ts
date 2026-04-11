import { cloneSnapshot } from "@/mocks/dashboard-snapshots";
import type { DashboardPreset, PartnerDashboardSnapshot } from "@/features/dashboard/types";

export async function fetchDashboardSnapshot(preset: DashboardPreset): Promise<PartnerDashboardSnapshot> {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  return cloneSnapshot(preset);
}

export async function fetchCriadorSnapshot(criadorId: string): Promise<PartnerDashboardSnapshot> {
  const res = await fetch(`/api/criadores/${criadorId}/snapshot`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar snapshot do criador ${criadorId}`);
  }

  return res.json() as Promise<PartnerDashboardSnapshot>;
}
