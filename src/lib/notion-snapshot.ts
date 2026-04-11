import type {
  DashboardSocialPlatform,
  PartnerDashboardSnapshot,
} from "@/features/dashboard/types";
import type { Criador } from "@/lib/notion";

const assets = {
  gameLogo: "/figma-assets/logo-game.png",
  discordLogo: "/figma-assets/logo-discord.png",
  power: "/figma-assets/power.svg",
  libraryAdd: "/figma-assets/library-add.svg",
  confirmationNumber: "/figma-assets/confirmation-number.svg",
  notification: "/figma-assets/notification.svg",
  profile: "/figma-assets/profile-photo.jpg",
  twitch: "/figma-assets/twitch.svg",
  youtube: "/figma-assets/youtube.svg",
  tiktok: "/figma-assets/tiktok.svg",
  instagram: "/figma-assets/instagram.svg",
  x: "/figma-assets/x.svg",
};

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const SOCIAL_ICON: Record<string, { src: string; platform: DashboardSocialPlatform }> = {
  Twitch: { src: assets.twitch, platform: "twitch" },
  Youtube: { src: assets.youtube, platform: "youtube" },
  YouTube: { src: assets.youtube, platform: "youtube" },
  TikTok: { src: assets.tiktok, platform: "tiktok" },
  Instagram: { src: assets.instagram, platform: "instagram" },
  X: { src: assets.x, platform: "x" },
};

const ALL_SOCIALS: Array<{ key: string; label: string; platform: DashboardSocialPlatform; src: string; standalone?: boolean }> = [
  { key: "Twitch", label: "Twitch", platform: "twitch", src: assets.twitch },
  { key: "Youtube", label: "Youtube", platform: "youtube", src: assets.youtube },
  { key: "TikTok", label: "TikTok", platform: "tiktok", src: assets.tiktok },
  { key: "Instagram", label: "Instagram", platform: "instagram", src: assets.instagram },
  { key: "X", label: "X", platform: "x", src: assets.x, standalone: true },
];

export function buildSnapshotFromCriador(criador: Criador): PartnerDashboardSnapshot {
  const situacaoAtiva = criador.situacao === "Ativo";
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Contract chips: only twitch/youtube supported by the type
  const chipMap: Record<string, { label: string; tone: "twitch" | "youtube" }> = {
    Twitch: { label: "Twitch", tone: "twitch" },
    Youtube: { label: "Youtube", tone: "youtube" },
    YouTube: { label: "Youtube", tone: "youtube" },
  };
  const chips = criador.plataformas
    .map((p) => chipMap[p])
    .filter(Boolean) as Array<{ label: string; tone: "twitch" | "youtube" }>;

  // Social metrics: show all 5, mark active ones with URL
  const plataformasSet = new Set(criador.plataformas.map((p) => p.toLowerCase()));
  const socialItems = ALL_SOCIALS.map((s) => ({
    platform: s.platform,
    label: s.label,
    value: plataformasSet.has(s.key.toLowerCase()) ? "—" : "—",
    src: s.src,
    ...(s.standalone ? { standalone: true } : {}),
  }));

  // Data fields
  const dataFields = [
    { label: "The Classic ID", value: criador.theClassicId != null ? String(criador.theClassicId) : "—" },
    { label: "Nickname", value: criador.nickname || "—" },
    { label: "Discord", value: criador.discord ?? "—" },
    { label: "Conteúdo", value: criador.conteudo || "—" },
    { label: "Parceiro desde", value: formatDate(criador.inicio) },
    { label: "Projeto", value: criador.projeto.join(", ") || "—" },
    { label: "Plataformas", value: criador.plataformas.join(", ") || "—" },
    { label: "Valor base", value: formatCurrency(criador.valorReais) },
    { label: "Situação", value: criador.situacao ?? "—" },
  ];

  return {
    preset: "perfil",
    profile: {
      title: "Perfil do Parceiro",
      name: criador.nome || criador.nomeCompleto,
      imageSrc: assets.profile,
    },
    topBar: {
      status: {
        title: "Status",
        label: criador.situacao ?? "—",
        tone: situacaoAtiva ? "positive" : "negative",
      },
      actions: [
        { id: "power", label: "Encerrar", src: assets.power, tone: "danger" },
        { id: "library-add", label: "Registrar conteúdo", src: assets.libraryAdd, tone: "neutral" },
        { id: "confirmation-number", label: "Registrar ticket", src: assets.confirmationNumber, tone: "danger" },
      ],
      activePreset: "perfil",
      dateLabel: hoje,
      liveEnabled: false,
      periodMode: "datetime",
      gameLogoSrc: assets.gameLogo,
      discordLogoSrc: assets.discordLogo,
    },
    contract: {
      title: "Contrato",
      partnerName: criador.nomeCompleto || criador.nome,
      alias: criador.nickname || criador.nome,
      chips,
      stats: [
        { label: "Base", value: formatCurrency(criador.valorReais) },
        { label: "Vídeos Curtos", value: criador.videosCurtos != null ? String(criador.videosCurtos) : "—" },
        { label: "Horas de Live", value: criador.horasLive != null ? `${criador.horasLive}h` : "—" },
        { label: "Vídeos Longos", value: criador.videosLongos != null ? String(criador.videosLongos) : "—" },
      ],
    },
    contentMetrics: {
      title: "Metas de conteúdo",
      accentTone: "positive",
      gauges: [
        { label: "Curtos", value: 0, max: criador.videosCurtos ?? 0 },
        { label: "Longos", value: 0, max: criador.videosLongos ?? 0 },
      ],
    },
    finance: {
      title: "R$",
      cashback: 0,
      money: criador.valorReais ?? 0,
    },
    hours: {
      title: "Horas transmitidas",
      current: 0,
      target: criador.horasLive ?? 0,
      unit: "Horas",
    },
    socials: {
      title: "Redes sociais",
      items: socialItems,
    },
    partnerData: {
      title: "Dados",
      fields: dataFields,
    },
    log: {
      title: "Registro",
      items: [],
    },
    footer: "Copyright ₢ 2026 - The Classic Games",
  };
}

// keep SOCIAL_ICON export for potential future use
export { SOCIAL_ICON };
