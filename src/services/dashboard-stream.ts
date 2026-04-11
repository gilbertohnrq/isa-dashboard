import { faker } from "@faker-js/faker";

import type {
  DashboardGaugeMetric,
  DashboardSocialMetric,
  DashboardStreamEvent,
  PartnerDashboardSnapshot,
} from "@/features/dashboard/types";

faker.seed(20260328);

function nextGaugeValue(metric: DashboardGaugeMetric) {
  if (metric.value >= metric.max) {
    return metric.value;
  }

  return Math.min(metric.max, metric.value + faker.number.int({ min: 0, max: 1 }));
}

function nextSocialValue(metric: DashboardSocialMetric) {
  if (metric.value === "-") {
    return metric.value;
  }

  const current = Number(metric.value);
  const delta = faker.number.int({ min: 0, max: 9 });
  return String(current + delta);
}

export function applyDashboardStreamEvent(
  snapshot: PartnerDashboardSnapshot,
  event: DashboardStreamEvent,
) {
  const nextSnapshot = structuredClone(snapshot);

  if (event.finance?.cashback !== undefined) {
    nextSnapshot.finance.cashback = event.finance.cashback;
  }

  if (event.finance?.money !== undefined) {
    nextSnapshot.finance.money = event.finance.money;
  }

  if (event.hours?.current !== undefined) {
    nextSnapshot.hours.current = event.hours.current;
  }

  if (event.contentMetrics) {
    nextSnapshot.contentMetrics.gauges = nextSnapshot.contentMetrics.gauges.map((metric) => {
      const patch = event.contentMetrics?.find((entry) => entry.label === metric.label);
      return patch ? { ...metric, value: patch.value } : metric;
    });
  }

  if (event.socials) {
    nextSnapshot.socials.items = nextSnapshot.socials.items.map((metric) => {
      const patch = event.socials?.find((entry) => entry.platform === metric.platform);
      return patch ? { ...metric, value: patch.value } : metric;
    });
  }

  return nextSnapshot;
}

export function createDashboardStreamEvent(
  snapshot: PartnerDashboardSnapshot,
): DashboardStreamEvent | null {
  if (!snapshot.topBar.liveEnabled) {
    return null;
  }

  const nextHours = Math.min(
    snapshot.hours.target,
    snapshot.hours.current + faker.number.int({ min: 0, max: 2 }),
  );

  return {
    generatedAt: faker.date.recent().toISOString(),
    finance: {
      cashback: snapshot.finance.cashback + faker.number.int({ min: 0, max: 8 }),
      money: snapshot.finance.money + faker.number.int({ min: 0, max: 12 }),
    },
    hours: {
      current: nextHours,
    },
    contentMetrics: snapshot.contentMetrics.gauges.map((metric) => ({
      label: metric.label,
      value: nextGaugeValue(metric),
    })),
    socials: snapshot.socials.items.map((metric) => ({
      platform: metric.platform,
      value: nextSocialValue(metric),
    })),
  };
}

export function subscribeToDashboardStream(
  snapshot: PartnerDashboardSnapshot,
  onEvent: (event: DashboardStreamEvent) => void,
) {
  if (!snapshot.topBar.liveEnabled) {
    return () => undefined;
  }

  let currentSnapshot = structuredClone(snapshot);

  const interval = setInterval(() => {
    const event = createDashboardStreamEvent(currentSnapshot);

    if (!event) {
      return;
    }

    currentSnapshot = applyDashboardStreamEvent(currentSnapshot, event);
    onEvent(event);
  }, 8_000);

  return () => clearInterval(interval);
}
