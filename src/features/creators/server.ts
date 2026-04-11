import { cache } from "react";

import type { DashboardStatusTone, PartnerDashboardSnapshot } from "@/features/dashboard/types";
import type { CreatorDirectoryItem, CreatorSection } from "@/features/creators/types";
import { buildSnapshotFromCriador } from "@/lib/notion-snapshot";
import { getCriadores } from "@/lib/notion";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const listDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

const creatorSectionLabels: Record<CreatorSection, string> = {
  dashboard: "Visão geral",
  conteudos: "Conteúdos",
  financeiro: "Financeiro",
  dados: "Dados",
};

const getCriadoresCached = cache(async () => getCriadores());

function getDisplayName(input: { nome: string; nickname: string; nomeCompleto: string }) {
  return input.nome || input.nickname || input.nomeCompleto || "Criador";
}

export function getCreatorInitials(name: string) {
  const normalized = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (normalized.length === 0) {
    return "TC";
  }

  if (normalized.length === 1) {
    return normalized[0].slice(0, 2).toUpperCase();
  }

  return `${normalized[0][0] ?? ""}${normalized[1][0] ?? ""}`.toUpperCase();
}

function formatAmountLabel(value: number | null) {
  if (value == null) {
    return "Valor não informado";
  }

  return currencyFormatter.format(value);
}

function formatSinceLabel(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  return listDateFormatter.format(new Date(value));
}

function formatTierLabel(value: number | null) {
  if (value == null) {
    return "Sem tier";
  }

  return `Tier ${value}`;
}

function getStatusTone(status: string | null): DashboardStatusTone {
  return status === "Ativo" ? "positive" : "negative";
}

function buildDirectoryItem(
  criador: Awaited<ReturnType<typeof getCriadores>>[number],
): CreatorDirectoryItem | null {
  if (criador.theClassicId == null) {
    return null;
  }

  const displayName = getDisplayName(criador);
  const status = criador.situacao ?? "Sem status";

  return {
    id: String(criador.theClassicId),
    name: displayName,
    nickname: criador.nickname || "Sem nickname",
    fullName: criador.nomeCompleto || displayName,
    initials: getCreatorInitials(criador.nomeCompleto || displayName),
    status,
    statusTone: getStatusTone(criador.situacao),
    tierLabel: formatTierLabel(criador.tier),
    content: criador.conteudo || "Conteúdo não informado",
    projects: criador.projeto,
    platforms: criador.plataformas,
    amountLabel: formatAmountLabel(criador.valorReais),
    sinceLabel: formatSinceLabel(criador.inicio),
    avatarUrl: criador.avatarUrl,
  };
}

export const getCreatorDirectoryItems = cache(async () => {
  const criadores = await getCriadoresCached();

  return criadores
    .map((criador) => buildDirectoryItem(criador))
    .filter((item): item is CreatorDirectoryItem => item != null)
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
});

export const getCreatorStaticParams = cache(async () => {
  const items = await getCreatorDirectoryItems();
  return items.map((item) => ({ id: item.id }));
});

export const getCriadorByClassicId = cache(async (id: string) => {
  const criadores = await getCriadoresCached();
  return criadores.find((criador) => String(criador.theClassicId) === id) ?? null;
});

export const getCreatorSnapshot = cache(
  async (id: string, section: CreatorSection): Promise<PartnerDashboardSnapshot | null> => {
    const criador = await getCriadorByClassicId(id);

    if (!criador) {
      return null;
    }

    return buildSnapshotFromCriador(criador, { section });
  },
);

export function buildCreatorHref(id: string, section: CreatorSection = "dashboard") {
  if (section === "dashboard") {
    return `/criadores/${id}`;
  }

  return `/criadores/${id}/${section}`;
}

export function getCreatorSectionLinks(id: string, activeSection: CreatorSection) {
  return (Object.keys(creatorSectionLabels) as CreatorSection[]).map((section) => ({
    href: buildCreatorHref(id, section),
    label: creatorSectionLabels[section],
    isActive: section === activeSection,
  }));
}
