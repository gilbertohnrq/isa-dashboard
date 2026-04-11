import React from "react";
import { render, screen } from "@testing-library/react";

import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { createSnapshotFixture } from "@/test-support/creator-fixtures";

describe("Dashboard view states", () => {
  it("renders the skeleton layout while loading", () => {
    const { container } = render(<DashboardSkeleton />);

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(10);
  });

  it("renders the overview cards with the creator profile", () => {
    render(<DashboardView snapshot={createSnapshotFixture("dashboard")} />);

    expect(screen.getByText("Perfil do Criador")).toBeInTheDocument();
    expect(screen.getByText("Contrato")).toBeInTheDocument();
    expect(screen.getByText("Financeiro")).toBeInTheDocument();
    expect(screen.getByText("Isa")).toBeInTheDocument();
  });

  it("shows empty states instead of fake progress values", () => {
    render(<DashboardView snapshot={createSnapshotFixture("dashboard")} />);

    expect(screen.getByText("Sem dados de progresso")).toBeInTheDocument();
    expect(screen.getByText("Sem horas integradas")).toBeInTheDocument();
    expect(screen.getByText("Nada registrado por enquanto")).toBeInTheDocument();
  });
});

