"use client";

import { create } from "zustand";

import type { DashboardPreset, DashboardViewState } from "@/features/dashboard/types";

type DashboardStore = DashboardViewState & {
  setPreset: (preset: DashboardPreset) => void;
  syncSnapshotState: (snapshot: Pick<DashboardViewState, "liveEnabled" | "periodMode">) => void;
  reset: () => void;
};

const initialState: DashboardViewState = {
  preset: "perfil",
  liveEnabled: false,
  periodMode: "datetime",
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,
  setPreset: (preset) => set({ preset }),
  syncSnapshotState: (snapshot) => set(snapshot),
  reset: () => set(initialState),
}));
