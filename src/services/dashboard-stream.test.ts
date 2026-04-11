import { describe, expect, it, vi } from "vitest";

import { cloneSnapshot } from "@/mocks/dashboard-snapshots";
import {
  applyDashboardStreamEvent,
  subscribeToDashboardStream,
} from "@/services/dashboard-stream";

describe("dashboard stream", () => {
  it("emits a patch every 8 seconds for the live preset", async () => {
    vi.useFakeTimers();

    const snapshot = cloneSnapshot("painel");
    const onEvent = vi.fn();
    const unsubscribe = subscribeToDashboardStream(snapshot, onEvent);

    await vi.advanceTimersByTimeAsync(8_000);

    expect(onEvent).toHaveBeenCalledTimes(1);
    const event = onEvent.mock.calls[0][0];
    const nextSnapshot = applyDashboardStreamEvent(snapshot, event);

    expect(nextSnapshot.hours.current).toBeLessThanOrEqual(nextSnapshot.hours.target);
    expect(nextSnapshot.finance.money).toBeGreaterThanOrEqual(snapshot.finance.money);

    unsubscribe();
    vi.useRealTimers();
  });
});
