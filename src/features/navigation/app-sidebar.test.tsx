import React from "react";
import { render, screen } from "@testing-library/react";

import { AppSidebar } from "@/features/navigation/app-sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/financeiro",
}));

describe("AppSidebar", () => {
  it("renders navigation links and marks the active page", () => {
    render(<AppSidebar />);

    expect(screen.getByRole("link", { name: /Dashboard$/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Conteudos$/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Financeiro$/ })).toHaveClass(
      "workspace-sidebar__link--active",
    );
  });
});
