import { buildSnapshotFromCriador } from "@/lib/notion-snapshot";
import { createCriadorFixture } from "@/test-support/creator-fixtures";

describe("buildSnapshotFromCriador", () => {
  it("maps real social links and uses avatar fallback metadata", () => {
    const snapshot = buildSnapshotFromCriador(
      createCriadorFixture({
        instagram: "https://www.instagram.com/devoisa",
        x: "https://x.com/devoisa",
      }),
      { section: "dashboard" },
    );

    expect(snapshot.creatorId).toBe("459177910");
    expect(snapshot.profile.imageSrc).toBeNull();
    expect(snapshot.profile.initials).toBe("IS");
    expect(snapshot.socials.items.find((item) => item.platform === "twitch")?.href).toBe(
      "https://www.twitch.tv/devoisa",
    );
    expect(snapshot.socials.items.find((item) => item.platform === "instagram")?.href).toBe(
      "https://www.instagram.com/devoisa",
    );
    expect(snapshot.socials.items.find((item) => item.platform === "x")?.isAvailable).toBe(true);
  });

  it("marks operational cards as empty when only contract targets exist", () => {
    const snapshot = buildSnapshotFromCriador(createCriadorFixture(), { section: "financeiro" });

    expect(snapshot.contentMetrics.gauges.every((metric) => metric.hasData === false)).toBe(true);
    expect(snapshot.hours.hasData).toBe(false);
    expect(snapshot.finance.hasCashbackData).toBe(false);
    expect(snapshot.log.items).toHaveLength(0);
    expect(snapshot.log.emptyMessage).toMatch(/Sem registros integrados/i);
  });
});

