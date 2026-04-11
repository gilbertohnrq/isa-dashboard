import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// ── internal types ────────────────────────────────────────────────────────────

type NotionProp = Record<string, unknown>;
type NotionFileRef =
  | { type: "file"; file?: { url?: string | null } | null }
  | { type: "external"; external?: { url?: string | null } | null };

type NotionCover = NotionFileRef | null;

type NotionPage = {
  id: string;
  cover?: NotionCover;
  properties: Record<string, NotionProp>;
};
type QueryResult = { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
type DataSources = { query: (args: Record<string, unknown>) => Promise<QueryResult> };

// ── helpers ──────────────────────────────────────────────────────────────────

function text(prop: NotionProp | undefined): string {
  if (!prop) return "";
  const rt = prop.rich_text as Array<{ plain_text: string }> | undefined;
  const title = prop.title as Array<{ plain_text: string }> | undefined;
  return rt?.[0]?.plain_text ?? title?.[0]?.plain_text ?? "";
}

function num(prop: NotionProp | undefined): number | null {
  if (!prop) return null;
  return typeof prop.number === "number" ? prop.number : null;
}

function select(prop: NotionProp | undefined): string | null {
  if (!prop) return null;
  const s = prop.select as { name: string } | null | undefined;
  return s?.name ?? null;
}

function multiSelect(prop: NotionProp | undefined): string[] {
  if (!prop) return [];
  const ms = prop.multi_select as Array<{ name: string }> | undefined;
  return ms?.map((s) => s.name) ?? [];
}

function urlProp(prop: NotionProp | undefined): string | null {
  if (!prop) return null;
  return typeof prop.url === "string" ? prop.url : null;
}

function filesUrl(prop: NotionProp | undefined): string | null {
  if (!prop) return null;

  const files = prop.files as Array<NotionFileRef> | undefined;

  if (!files?.length) return null;

  return getNotionFileUrl(files[0] ?? null);
}

function getNotionFileUrl(fileRef: NotionFileRef | null): string | null {
  if (!fileRef) return null;

  if (fileRef.type === "file") {
    return fileRef.file?.url ?? null;
  }

  if (fileRef.type === "external") {
    return fileRef.external?.url ?? null;
  }

  return null;
}

function normalizeHandle(value: string | null): string | null {
  if (!value) return null;

  const cleaned = value.trim().replace(/^@/, "");
  return cleaned.length > 0 ? cleaned : null;
}

function getUsernameFromUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return normalizeHandle(segments[0] ?? null);
  } catch {
    return null;
  }
}

function getUnavatarUrl(platform: string, handle: string | null): string | null {
  const normalized = normalizeHandle(handle);

  if (!normalized) return null;

  return `https://unavatar.io/${platform}/${encodeURIComponent(normalized)}`;
}

function getAvatarFallback(input: {
  twitch: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  kick: string | null;
  login: string | null;
  nickname: string;
}): string | null {
  return (
    getUnavatarUrl("twitch", getUsernameFromUrl(input.twitch) ?? input.login ?? input.nickname) ??
    getUnavatarUrl("instagram", getUsernameFromUrl(input.instagram)) ??
    getUnavatarUrl("tiktok", getUsernameFromUrl(input.tiktok)) ??
    getUnavatarUrl("youtube", getUsernameFromUrl(input.youtube)) ??
    getUnavatarUrl("twitch", getUsernameFromUrl(input.kick)) ??
    null
  );
}

function dateProp(prop: NotionProp | undefined): string | null {
  if (!prop) return null;
  const d = prop.date as { start: string } | null | undefined;
  return d?.start ?? null;
}

function checkbox(prop: NotionProp | undefined): boolean {
  if (!prop) return false;
  return prop.checkbox === true;
}

async function queryAll(dataSourceId: string): Promise<NotionPage[]> {
  const results: NotionPage[] = [];
  let cursor: string | undefined;
  const ds = (notion.dataSources as unknown as DataSources);

  do {
    const res = await ds.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results.push(...res.results);
    cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined;
  } while (cursor);

  return results;
}

// ── Criadores ─────────────────────────────────────────────────────────────────

export type Criador = {
  id: string;
  nome: string;
  nickname: string;
  nomeCompleto: string;
  login: string | null;
  situacao: string | null;
  tier: number | null;
  plataformas: string[];
  projeto: string[];
  conteudo: string;
  horasLive: number | null;
  videosLongos: number | null;
  videosCurtos: number | null;
  valorReais: number | null;
  inicio: string | null;
  theClassicId: number | null;
  twitch: string | null;
  youtube: string | null;
  tiktok: string | null;
  kick: string | null;
  instagram: string | null;
  x: string | null;
  discord: string | null;
  avatarUrl: string | null;
  possuiWebcam: boolean;
  cadastrado: boolean;
};

export async function getCriadores(): Promise<Criador[]> {
  const pages = await queryAll(process.env.NOTION_CRIADORES_DB_ID!);

  return pages.map((page) => {
    const p = page.properties;
    const nickname = text(p["Nickname"]);
    const login = text(p["Login"]) || null;
    const twitch = urlProp(p["Twitch"]);
    const youtube = urlProp(p["Youtube"]);
    const tiktok = urlProp(p["TikTok"]);
    const kick = urlProp(p["Kick"]);
    const instagram = urlProp(p["Instagram"]) ?? urlProp(p["instagram"]);

    return {
      id: page.id,
      nome: text(p["Nome"]),
      nickname,
      nomeCompleto: text(p["Nome completo"]),
      login,
      situacao: select(p["Situação"]),
      tier: num(p["Tier"]),
      plataformas: multiSelect(p["Plataformas"]),
      projeto: multiSelect(p["Projeto"]),
      conteudo: text(p["Conteúdo"]),
      horasLive: num(p["Horas de Live"]),
      videosLongos: num(p["Vídeos Longos"]),
      videosCurtos: num(p["Vídeos Curtos"]),
      valorReais: num(p["Valor (R$)"]),
      inicio: dateProp(p["Início"]),
      theClassicId: num(p["TheClassic ID"]),
      twitch,
      youtube,
      tiktok,
      kick,
      instagram,
      x:
        urlProp(p["X"]) ??
        urlProp(p["x"]) ??
        urlProp(p["Twitter"]) ??
        urlProp(p["twitter"]),
      discord: text(p["Discord"]) || null,
      avatarUrl:
        getNotionFileUrl(page.cover ?? null) ??
        filesUrl(p["Avatar"]) ??
        filesUrl(p["Foto"]) ??
        filesUrl(p["Foto de Perfil"]) ??
        filesUrl(p["Imagem"]) ??
        urlProp(p["Avatar"]) ??
        urlProp(p["Foto"]) ??
        getAvatarFallback({
          twitch,
          instagram,
          tiktok,
          youtube,
          kick,
          login,
          nickname,
        }) ??
        null,
      possuiWebcam: checkbox(p["Possui Webcam?"]),
      cadastrado: checkbox(p["Cadastrado?"]),
    };
  });
}

// ── Entregas ──────────────────────────────────────────────────────────────────

export type Entrega = {
  id: string;
  nome: string;
  criador: string | null;
  tipo: string | null;
  status: string | null;
  dataEntrega: string | null;
  projeto: string[];
};

export async function getEntregas(): Promise<Entrega[]> {
  if (!process.env.NOTION_ENTREGAS_DB_ID) return [];

  try {
    const pages = await queryAll(process.env.NOTION_ENTREGAS_DB_ID);
    return pages.map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        nome: text(p["Nome"] ?? p["Title"] ?? p["Name"]),
        criador: text(p["Criador"]) || select(p["Criador"]) || null,
        tipo: select(p["Tipo"]) || null,
        status: select(p["Status"]) || select(p["Situação"]) || null,
        dataEntrega: dateProp(p["Data de Entrega"] ?? p["Data"]) || null,
        projeto: multiSelect(p["Projeto"]),
      };
    });
  } catch {
    return [];
  }
}

// ── Resumo ────────────────────────────────────────────────────────────────────

export type ResumoMes = {
  id: string;
  mes: string;
  totalCriadores: number | null;
  totalPago: number | null;
  totalConteudos: number | null;
  projeto: string[];
};

export async function getResumos(): Promise<ResumoMes[]> {
  if (!process.env.NOTION_RESUMO_DB_ID) return [];

  try {
    const pages = await queryAll(process.env.NOTION_RESUMO_DB_ID);
    return pages.map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        mes: text(p["Nome"] ?? p["Mês"] ?? p["Title"]),
        totalCriadores: num(p["Total Criadores"] ?? p["Criadores"]) || null,
        totalPago: num(p["Total Pago"] ?? p["Valor (R$)"] ?? p["Valor"]) || null,
        totalConteudos: num(p["Total Conteúdos"] ?? p["Conteúdos"]) || null,
        projeto: multiSelect(p["Projeto"]),
      };
    });
  } catch {
    return [];
  }
}
