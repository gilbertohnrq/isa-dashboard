import { describe, expect, it, vi } from "vitest";

import { fetchDashboardSnapshot } from "@/services/dashboard-service";

describe("fetchDashboardSnapshot", () => {
  it("waits for the mocked latency before resolving", async () => {
    vi.useFakeTimers();

    const promise = fetchDashboardSnapshot("perfil");
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(799);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    const snapshot = await promise;

    expect(snapshot.preset).toBe("perfil");
    expect(snapshot.contract.title).toBe("Contrato");

    vi.useRealTimers();
  });
});
