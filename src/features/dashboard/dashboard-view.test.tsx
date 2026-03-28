import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { cloneSnapshot } from "@/mocks/dashboard-snapshots";

describe("Dashboard view states", () => {
  it("renders the skeleton layout while loading", () => {
    const { container } = render(<DashboardSkeleton />);

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(10);
  });

  it("invokes preset changes through the stepper and renders the perfil snapshot", () => {
    const onPresetChange = vi.fn();

    render(<DashboardView snapshot={cloneSnapshot("perfil")} onPresetChange={onPresetChange} />);

    expect(screen.getByText("Perfil do Parceiro")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Painel" }));

    expect(onPresetChange).toHaveBeenCalledWith("painel");
  });

  it("renders the painel snapshot with suspended state", () => {
    render(<DashboardView snapshot={cloneSnapshot("painel")} onPresetChange={vi.fn()} />);

    expect(screen.getByText("Suspenso")).toBeInTheDocument();
    expect(screen.getAllByText("R$ 350,00")).toHaveLength(2);
  });
});
