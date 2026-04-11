import { NextRequest, NextResponse } from "next/server";

import { buildSnapshotFromCriador } from "@/lib/notion-snapshot";
import { getCriadores } from "@/lib/notion";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const criadores = await getCriadores();
    const criador = criadores.find((c) => String(c.theClassicId) === id);

    if (!criador) {
      return NextResponse.json({ error: "Criador não encontrado" }, { status: 404 });
    }

    const snapshot = buildSnapshotFromCriador(criador);
    return NextResponse.json(snapshot);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}
