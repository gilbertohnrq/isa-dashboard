import type {
  DashboardPreset,
  DashboardSocialMetric,
  PartnerDashboardSnapshot,
} from "@/features/dashboard/types";

const assets = {
  background: "/figma-assets/background.jpg",
  profile: "/figma-assets/profile-photo.jpg",
  gameLogo: "/figma-assets/logo-game.png",
  discordLogo: "/figma-assets/logo-discord.png",
  power: "/figma-assets/power.svg",
  refresh: "/figma-assets/refresh.svg",
  libraryAdd: "/figma-assets/library-add.svg",
  confirmationNumber: "/figma-assets/confirmation-number.svg",
  notification: "/figma-assets/notification.svg",
  twitch: "/figma-assets/twitch.svg",
  youtube: "/figma-assets/youtube.svg",
  tiktok: "/figma-assets/tiktok.svg",
  instagram: "/figma-assets/instagram.svg",
  x: "/figma-assets/x.svg",
};

const socialsBase: DashboardSocialMetric[] = [
  { platform: "twitch", label: "Twitch", value: "1250", src: assets.twitch },
  { platform: "youtube", label: "Youtube", value: "1250", src: assets.youtube },
  { platform: "tiktok", label: "TikTok", value: "-", src: assets.tiktok },
  {
    platform: "instagram",
    label: "Instagram",
    value: "-",
    src: assets.instagram,
  },
  { platform: "x", label: "X", value: "-", src: assets.x, standalone: true },
];

const commonData = [
  { label: "The Classic ID", value: "459177910" },
  { label: "Discord ID", value: "271040954201276450" },
  { label: "PIX", value: "123456789" },
  { label: "Nickname", value: "Devo" },
  { label: "Discord Usuário", value: "belladevecchi" },
  { label: "Conteúdo", value: "PvE e PvP" },
  { label: "Login", value: "devoisa" },
  { label: "Parceiro desde", value: "7 de fevereiro de 2026" },
  { label: "Tier", value: "1" },
];

const commonLog = [
  {
    title: "Parceria modificada",
    description: "Meta de horas atualizada",
    time: "12:37",
    iconSrc: assets.notification,
  },
  {
    title: "Parceria iniciada",
    description: "PW Alvorecer Sombrio",
    time: "12:37",
    iconSrc: assets.notification,
  },
  {
    title: "Parceria encerrada",
    description: "Parceiro não cumpriu as metas",
    time: "12:37",
    iconSrc: assets.notification,
  },
  {
    title: "Parceria iniciada",
    description: "TERA",
    time: "12:37",
    iconSrc: assets.notification,
  },
];

const snapshots: Record<DashboardPreset, PartnerDashboardSnapshot> = {
  perfil: {
    preset: "perfil",
    profile: {
      title: "Perfil do Parceiro",
      name: "Isa",
      imageSrc: assets.profile,
    },
    topBar: {
      status: { title: "Status", label: "Ativo", tone: "positive" },
      actions: [
        {
          id: "power",
          label: "Encerrar",
          src: assets.power,
          tone: "danger",
        },
        {
          id: "library-add",
          label: "Registrar conteúdo",
          src: assets.libraryAdd,
          tone: "neutral",
        },
        {
          id: "confirmation-number",
          label: "Registrar ticket",
          src: assets.confirmationNumber,
          tone: "danger",
        },
      ],
      activePreset: "perfil",
      dateLabel: "27 de Fevereiro de 2026",
      timeLabel: "12:30",
      liveEnabled: false,
      periodMode: "datetime",
      gameLogoSrc: assets.gameLogo,
      discordLogoSrc: assets.discordLogo,
    },
    contract: {
      title: "Contrato",
      partnerName: "Isabella Santiago Devecchi",
      alias: "DEVO10",
      chips: [
        { label: "Twitch", tone: "twitch" },
        { label: "Youtube", tone: "youtube" },
      ],
      stats: [
        { label: "Base", value: "R$ 350,00" },
        { label: "Vídeos Curtos", value: "5" },
        { label: "Horas de Live", value: "120h" },
        { label: "Vídeos Longos", value: "5" },
      ],
    },
    contentMetrics: {
      title: "Conteúdos entregues",
      accentTone: "positive",
      gauges: [
        { label: "Curtos", value: 3, max: 5 },
        { label: "Longos", value: 4, max: 5 },
      ],
    },
    finance: {
      title: "R$",
      cashback: 456,
      money: 217,
    },
    hours: {
      title: "Horas transmitidas",
      current: 85,
      target: 120,
      unit: "Horas",
    },
    socials: {
      title: "Redes sociais",
      items: socialsBase,
    },
    partnerData: {
      title: "Dados",
      fields: commonData,
    },
    log: {
      title: "Registro",
      items: commonLog,
    },
    footer: "Copyright ₢ 2026 - The Classic Games",
  },
  painel: {
    preset: "painel",
    profile: {
      title: "Perfil do Parceiro",
      name: "Isa",
      imageSrc: assets.profile,
    },
    topBar: {
      status: { title: "Status", label: "Suspenso", tone: "negative" },
      actions: [
        {
          id: "refresh",
          label: "Atualizar",
          src: assets.refresh,
          tone: "success",
          precomposed: true,
        },
        {
          id: "library-add",
          label: "Registrar conteúdo",
          src: assets.libraryAdd,
          tone: "neutral",
        },
        {
          id: "confirmation-number",
          label: "Registrar ticket",
          src: assets.confirmationNumber,
          tone: "success",
        },
      ],
      activePreset: "painel",
      dateLabel: "Fevereiro de 2026",
      liveEnabled: true,
      periodMode: "month",
      gameLogoSrc: assets.gameLogo,
      discordLogoSrc: assets.discordLogo,
    },
    contract: {
      title: "Contrato",
      partnerName: "Isabella Santiago Devecchi",
      alias: "DEVO10",
      chips: [
        { label: "Twitch", tone: "twitch" },
        { label: "Youtube", tone: "youtube" },
      ],
      stats: [
        { label: "Base", value: "R$ 350,00" },
        { label: "Vídeos Curtos", value: "5" },
        { label: "Horas de Live", value: "120h" },
        { label: "Vídeos Longos", value: "5" },
      ],
    },
    contentMetrics: {
      title: "Conteúdos entregues",
      accentTone: "positive",
      gauges: [
        { label: "Curtos", value: 5, max: 5 },
        { label: "Longos", value: 5, max: 5 },
      ],
    },
    finance: {
      title: "R$",
      cashback: 456,
      money: 350,
    },
    hours: {
      title: "Horas transmitidas",
      current: 120,
      target: 120,
      unit: "Horas",
    },
    socials: {
      title: "Redes sociais",
      items: socialsBase,
    },
    partnerData: {
      title: "Dados",
      fields: commonData,
    },
    log: {
      title: "Registro",
      items: commonLog,
    },
    footer: "Copyright ₢ 2026 - The Classic Games",
  },
};

export function cloneSnapshot(preset: DashboardPreset) {
  return structuredClone(snapshots[preset]);
}

export function getDashboardBackgroundAsset() {
  return assets.background;
}
