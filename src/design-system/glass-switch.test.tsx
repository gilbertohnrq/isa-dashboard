import React from "react";
import { render, screen } from "@testing-library/react";

import { GlassSwitch } from "@/design-system/glass-switch";

describe("GlassSwitch", () => {
  it("reflects checked state through the rendered data attribute", () => {
    const { rerender } = render(<GlassSwitch checked={false} />);

    expect(screen.getByTestId("glass-switch")).toHaveAttribute("data-state", "unchecked");

    rerender(<GlassSwitch checked />);

    expect(screen.getByTestId("glass-switch")).toHaveAttribute("data-state", "checked");
  });
});
