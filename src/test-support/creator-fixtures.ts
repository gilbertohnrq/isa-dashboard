import type { CreatorSection } from "@/features/creators/types";
import { buildSnapshotFromCriador } from "@/lib/notion-snapshot";
import type { Criador } from "@/lib/notion";

export function createCriadorFixture(overrides: Partial<Criador> = {}): Criador {
  return {
    id: "notion-page-id",
    nome: "Isa",
    nickname: "devoisa",
    nomeCompleto: "Isabella Santiago Devecchi",
    login: "devoisa",
    situacao: "Ativo",
    tier: 1,
    plataformas: ["Twitch", "Youtube", "TikTok"],
    projeto: ["TERA"],
    conteudo: "PvE e PvP",
    horasLive: 120,
    videosLongos: 5,
    videosCurtos: 2,
    valorReais: 350,
    inicio: "2026-02-07",
    theClassicId: 459177910,
    twitch: "https://www.twitch.tv/devoisa",
    youtube: "https://www.youtube.com/@devoisa",
    tiktok: "https://www.tiktok.com/@devoisa",
    kick: null,
    instagram: null,
    x: null,
    discord: "belladevecchi",
    avatarUrl: null,
    possuiWebcam: true,
    cadastrado: true,
    ...overrides,
  };
}

export function createSnapshotFixture(section: CreatorSection = "dashboard") {
  return buildSnapshotFromCriador(createCriadorFixture(), { section });
}
