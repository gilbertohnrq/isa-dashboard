import type { CreatorSection } from "@/features/creators/types";
import type {
  DashboardSocialPlatform,
  PartnerDashboardSnapshot,
} from "@/features/dashboard/types";
import type { Criador } from "@/lib/notion";

const assets = {
  gameLogo: "/figma-assets/logo-game.png",
  twitch: "/figma-assets/twitch.svg",
  youtube: "/figma-assets/youtube.svg",
  tiktok: "/figma-assets/tiktok.svg",
  instagram: "/figma-assets/instagram.svg",
  x: "/figma-assets/x.svg",
};

type SocialSpec = {
  label: string;
  platform: DashboardSocialPlatform;
  src?: string;
  standalone?: boolean;
  monogram?: string;
  getHref: (criador: Criador) => string | null;
};

const SOCIAL_SPECS: SocialSpec[] = [
  {
    label: "Twitch",
    platform: "twitch",
    src: assets.twitch,
    getHref: (criador) => criador.twitch,
  },
  {
    label: "Youtube",
    platform: "youtube",
    src: assets.youtube,
    getHref: (criador) => criador.youtube,
  },
  {
    label: "TikTok",
    platform: "tiktok",
    src: assets.tiktok,
    getHref: (criador) => criador.tiktok,
  },
  {
    label: "Kick",
    platform: "kick",
    monogram: "KI",
    getHref: (criador) => criador.kick,
  },
  {
    label: "Instagram",
    platform: "instagram",
    src: assets.instagram,
    getHref: (criador) => criador.instagram,
  },
  {
    label: "X",
    platform: "x",
    src: assets.x,
    standalone: true,
    getHref: (criador) => criador.x,
  },
];

function getInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "TC";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

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

function formatBoolean(value: boolean) {
  return value ? "Sim" : "Não";
}

function formatExternalLabel(url: string | null) {
  if (!url) {
    return "Indisponível";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Abrir perfil";
  }
}

function getDisplayName(criador: Criador) {
  return criador.nome || criador.nickname || criador.nomeCompleto || "Criador";
}

function getContractChips(criador: Criador) {
  const chipMap: Record<string, { label: string; tone: "twitch" | "youtube" }> = {
    Twitch: { label: "Twitch", tone: "twitch" },
    Youtube: { label: "Youtube", tone: "youtube" },
    YouTube: { label: "Youtube", tone: "youtube" },
  };

  return criador.plataformas
    .map((plataforma) => chipMap[plataforma])
    .filter(Boolean) as Array<{ label: string; tone: "twitch" | "youtube" }>;
}

function getSectionSubtitle(section: CreatorSection) {
  const subtitles: Record<CreatorSection, string> = {
    dashboard: "Visão geral da parceria",
    conteudos: "Metas e canais de conteúdo",
    financeiro: "Resumo financeiro atual",
    dados: "Dados cadastrais e operacionais",
  };

  return subtitles[section];
}

export function buildSnapshotFromCriador(
  criador: Criador,
  options: { section: CreatorSection },
): PartnerDashboardSnapshot {
  const displayName = getDisplayName(criador);
  const fullName = criador.nomeCompleto || displayName;
  const nickname = criador.nickname || displayName;
  const situacaoAtiva = criador.situacao === "Ativo";
  const amount = criador.valorReais;
  const shortVideoTarget = criador.videosCurtos ?? 0;
  const longVideoTarget = criador.videosLongos ?? 0;
  const liveHoursTarget = criador.horasLive ?? 0;
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const socialItems = SOCIAL_SPECS.map((spec) => {
    const href = spec.getHref(criador);

    return {
      platform: spec.platform,
      label: spec.label,
      value: formatExternalLabel(href),
      src: spec.src,
      standalone: spec.standalone,
      monogram: spec.monogram,
      href,
      isAvailable: href != null,
    };
  });

  return {
    preset: "perfil",
    creatorId: String(criador.theClassicId ?? criador.id),
    profile: {
      title: "Perfil do Criador",
      name: displayName,
      subtitle: criador.nomeCompleto && criador.nomeCompleto !== displayName ? criador.nomeCompleto : nickname,
      imageSrc: criador.avatarUrl,
      initials: getInitials(fullName),
    },
    topBar: {
      status: {
        title: "Status",
        label: criador.situacao ?? "Sem status",
        tone: situacaoAtiva ? "positive" : "negative",
      },
      dateLabel: today,
      liveEnabled: false,
      periodMode: "datetime",
      gameLogoSrc: assets.gameLogo,
      heading: displayName,
      subtitle: getSectionSubtitle(options.section),
    },
    contract: {
      title: "Contrato",
      partnerName: fullName,
      alias: nickname,
      chips: getContractChips(criador),
      stats: [
        { label: "Base", value: formatCurrency(amount) },
        {
          label: "Vídeos Curtos",
          value: criador.videosCurtos != null ? String(criador.videosCurtos) : "—",
        },
        {
          label: "Horas de Live",
          value: criador.horasLive != null ? `${criador.horasLive}h` : "—",
        },
        {
          label: "Vídeos Longos",
          value: criador.videosLongos != null ? String(criador.videosLongos) : "—",
        },
      ],
    },
    contentMetrics: {
      title: "Metas de conteúdo",
      accentTone: "positive",
      gauges: [
        { label: "Curtos", value: 0, max: shortVideoTarget, hasData: false },
        { label: "Longos", value: 0, max: longVideoTarget, hasData: false },
      ],
      emptyMessage: "Sem dados de entrega integrados ainda.",
    },
    finance: {
      title: "Financeiro",
      cashback: 0,
      money: amount ?? 0,
      hasCashbackData: false,
      hasMoneyData: amount != null,
    },
    hours: {
      title: "Horas transmitidas",
      current: 0,
      target: liveHoursTarget,
      unit: "Horas",
      hasData: false,
    },
    socials: {
      title: "Redes sociais",
      items: socialItems,
      emptyMessage: "Links indisponíveis aparecem como inativos.",
    },
    partnerData: {
      title: "Dados",
      fields: [
        {
          label: "The Classic ID",
          value: criador.theClassicId != null ? String(criador.theClassicId) : "—",
        },
        { label: "Nickname", value: criador.nickname || "—" },
        { label: "Discord", value: criador.discord ?? "—" },
        { label: "Conteúdo", value: criador.conteudo || "—" },
        { label: "Parceiro desde", value: formatDate(criador.inicio) },
        { label: "Projeto", value: criador.projeto.join(", ") || "—" },
        { label: "Plataformas", value: criador.plataformas.join(", ") || "—" },
        { label: "Valor base", value: formatCurrency(amount) },
        { label: "Situação", value: criador.situacao ?? "—" },
        { label: "Webcam", value: formatBoolean(criador.possuiWebcam) },
        { label: "Cadastro", value: formatBoolean(criador.cadastrado) },
      ],
    },
    log: {
      title: "Registro",
      items: [],
      emptyMessage: "Sem registros integrados ainda.",
    },
    footer: "Copyright ₢ 2026 - The Classic Games",
  };
}

