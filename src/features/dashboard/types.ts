export type DashboardPreset = "perfil" | "painel";
export type DashboardStatusTone = "positive" | "negative";
export type DashboardPeriodMode = "datetime" | "month";
export type DashboardOrbTone = "neutral" | "danger" | "success";
export type DashboardSocialPlatform =
  | "twitch"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "x";

export type DashboardViewState = {
  preset: DashboardPreset;
  liveEnabled: boolean;
  periodMode: DashboardPeriodMode;
};

export type DashboardTopBarAction = {
  id: string;
  label: string;
  src: string;
  tone: DashboardOrbTone;
  precomposed?: boolean;
};

export type DashboardTopBar = {
  status: {
    title: string;
    label: string;
    tone: DashboardStatusTone;
  };
  actions: DashboardTopBarAction[];
  activePreset: DashboardPreset;
  dateLabel: string;
  timeLabel?: string;
  liveEnabled: boolean;
  periodMode: DashboardPeriodMode;
  gameLogoSrc: string;
  discordLogoSrc: string;
};

export type DashboardContractStat = {
  label: string;
  value: string;
};

export type DashboardContract = {
  title: string;
  partnerName: string;
  alias: string;
  chips: Array<{
    label: string;
    tone: "twitch" | "youtube";
  }>;
  stats: DashboardContractStat[];
};

export type DashboardGaugeMetric = {
  label: string;
  value: number;
  max: number;
};

export type DashboardFinance = {
  title: string;
  cashback: number;
  money: number;
};

export type DashboardHoursProgress = {
  title: string;
  current: number;
  target: number;
  unit: string;
};

export type DashboardSocialMetric = {
  platform: DashboardSocialPlatform;
  label: string;
  value: string;
  src: string;
  standalone?: boolean;
};

export type DashboardDataField = {
  label: string;
  value: string;
};

export type DashboardLogItem = {
  title: string;
  description: string;
  time: string;
  iconSrc: string;
};

export type PartnerDashboardSnapshot = {
  preset: DashboardPreset;
  profile: {
    title: string;
    name: string;
    imageSrc: string;
  };
  topBar: DashboardTopBar;
  contract: DashboardContract;
  contentMetrics: {
    title: string;
    accentTone: DashboardStatusTone;
    gauges: DashboardGaugeMetric[];
  };
  finance: DashboardFinance;
  hours: DashboardHoursProgress;
  socials: {
    title: string;
    items: DashboardSocialMetric[];
  };
  partnerData: {
    title: string;
    fields: DashboardDataField[];
  };
  log: {
    title: string;
    items: DashboardLogItem[];
  };
  footer: string;
};

export type DashboardStreamEvent = {
  generatedAt: string;
  finance?: Partial<Pick<DashboardFinance, "cashback" | "money">>;
  hours?: Pick<DashboardHoursProgress, "current">;
  contentMetrics?: Array<{
    label: DashboardGaugeMetric["label"];
    value: number;
  }>;
  socials?: Array<{
    platform: DashboardSocialPlatform;
    value: string;
  }>;
};
