import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// ── helpers ──────────────────────────────────────────────────────────────────

function text(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? prop?.title?.[0]?.plain_text ?? "";
}

function num(prop: any): number | null {
  return prop?.number ?? null;
}

function select(prop: any): string | null {
  return prop?.select?.name ?? null;
}

function multiSelect(prop: any): string[] {
  return prop?.multi_select?.map((s: any) => s.name) ?? [];
}

function url(prop: any): string | null {
  return prop?.url ?? null;
}

function date(prop: any): string | null {
  return prop?.date?.start ?? null;
}

function checkbox(prop: any): boolean {
  return prop?.checkbox ?? false;
}

async function queryAll(dataSourceId: string) {
  const results: any[] = [];
  let cursor: string | undefined;

  do {
    const res: any = await (notion.dataSources as any).query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
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

  return pages.map((page: any) => {
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
      inicio: date(p["Início"]),
      theClassicId: num(p["TheClassic ID"]),
      twitch: url(p["Twitch"]),
      youtube: url(p["Youtube"]),
      tiktok: url(p["TikTok"]),
      kick: url(p["Kick"]),
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
    return pages.map((page: any) => {
      const p = page.properties;
      return {
        id: page.id,
        nome: text(p["Nome"] ?? p["Title"] ?? p["Name"]),
        criador: text(p["Criador"]) || select(p["Criador"]) || null,
        tipo: select(p["Tipo"]) || null,
        status: select(p["Status"]) || select(p["Situação"]) || null,
        dataEntrega: date(p["Data de Entrega"] ?? p["Data"]) || null,
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
    return pages.map((page: any) => {
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
