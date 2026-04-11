export type CreatorSection = "dashboard" | "conteudos" | "financeiro" | "dados";

export type CreatorDirectoryItem = {
  id: string;
  name: string;
  nickname: string;
  fullName: string;
  initials: string;
  status: string;
  statusTone: "positive" | "negative";
  tierLabel: string;
  tierNum: number;
  stars: number;
  content: string;
  projects: string[];
  platforms: string[];
  amountLabel: string;
  sinceLabel: string;
  avatarUrl: string | null;
  goals: {
    liveHours: { realized: number | null; target: number | null } | null;
    longVideos: { delivered: number | null; target: number | null } | null;
    shortVideos: { delivered: number | null; target: number | null } | null;
  } | null;
  monthlyInfo: {
    clicks: number | null;
    convertedClicks: number | null;
    couponUsageReal: number | null;
  } | null;
  receivables: {
    amountReal: { current: number | null; contract: number | null } | null;
    amountTCC: { current: number | null; contract: number | null } | null;
    cashbackTCC: number | null;
  } | null;
  lastActivity: string;
  notes: string[];
};
