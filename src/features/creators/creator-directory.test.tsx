import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreatorDirectory } from "@/features/creators/creator-directory";
import type { CreatorDirectoryItem } from "@/features/creators/types";

const items: CreatorDirectoryItem[] = [
  {
    id: "1",
    name: "Isa",
    nickname: "devoisa",
    fullName: "Isabella Santiago Devecchi",
    initials: "IS",
    status: "Ativo",
    statusTone: "positive",
    tierLabel: "Tier 1",
    content: "PvE e PvP",
    projects: ["TERA"],
    platforms: ["Twitch", "Youtube"],
    amountLabel: "R$ 350,00",
    sinceLabel: "fev. de 2026",
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Kai",
    nickname: "kaiplayer",
    fullName: "Kai Player",
    initials: "KP",
    status: "Encerrado",
    statusTone: "negative",
    tierLabel: "Tier 2",
    content: "FPS",
    projects: ["PW"],
    platforms: ["Kick"],
    amountLabel: "R$ 500,00",
    sinceLabel: "mar. de 2026",
    avatarUrl: null,
  },
];

describe("CreatorDirectory", () => {
  it("filters creators by search and status", async () => {
    const user = userEvent.setup();

    render(<CreatorDirectory items={items} />);

    await user.type(screen.getByLabelText("Buscar"), "Kai");

    await waitFor(() => {
      expect(screen.getByText("Kai")).toBeInTheDocument();
      expect(screen.queryByText("Isa")).not.toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText("Buscar"));
    await user.selectOptions(screen.getByLabelText("Status"), "Ativo");

    await waitFor(() => {
      expect(screen.getByText("Isa")).toBeInTheDocument();
      expect(screen.queryByText("Kai")).not.toBeInTheDocument();
    });
  });

  it("renders links to the creator dashboards", () => {
    render(<CreatorDirectory items={items} />);

    expect(screen.getByRole("link", { name: /Isa/ })).toHaveAttribute("href", "/criadores/1");
    expect(screen.getByRole("link", { name: /Kai/ })).toHaveAttribute("href", "/criadores/2");
  });
});
