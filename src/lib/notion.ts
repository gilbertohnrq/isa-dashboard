import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// ── internal types ────────────────────────────────────────────────────────────

type NotionProp = Record<string, unknown>;
type NotionPage = { id: string; properties: Record<string, NotionProp> };
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
  situacao: string | null;
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
  discord: string | null;
  possuiWebcam: boolean;
  cadastrado: boolean;
};

export async function getCriadores(): Promise<Criador[]> {
  const pages = await queryAll(process.env.NOTION_CRIADORES_DB_ID!);

  return pages.map((page) => {
    const p = page.properties;
    return {
      id: page.id,
      nome: text(p["Nome"]),
      nickname: text(p["Nickname"]),
      nomeCompleto: text(p["Nome completo"]),
      situacao: select(p["Situação"]),
      plataformas: multiSelect(p["Plataformas"]),
      projeto: multiSelect(p["Projeto"]),
      conteudo: text(p["Conteúdo"]),
      horasLive: num(p["Horas de Live"]),
      videosLongos: num(p["Vídeos Longos"]),
      videosCurtos: num(p["Vídeos Curtos"]),
      valorReais: num(p["Valor (R$)"]),
      inicio: dateProp(p["Início"]),
      theClassicId: num(p["TheClassic ID"]),
      twitch: urlProp(p["Twitch"]),
      youtube: urlProp(p["Youtube"]),
      tiktok: urlProp(p["TikTok"]),
      kick: urlProp(p["Kick"]),
      discord: text(p["Discord"]) || null,
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
