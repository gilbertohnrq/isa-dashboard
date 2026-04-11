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
  content: string;
  projects: string[];
  platforms: string[];
  amountLabel: string;
  sinceLabel: string;
  avatarUrl: string | null;
};
