import { notFound } from "next/navigation";
import { getCriadores } from "@/lib/notion";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const criadores = await getCriadores();
  return criadores
    .filter((c) => c.theClassicId != null)
    .map((c) => ({ id: String(c.theClassicId) }));
}

export default async function CriadorPage({ params }: Props) {
  const { id } = await params;
  const criadores = await getCriadores();
  const criador = criadores.find((c) => String(c.theClassicId) === id);

  if (!criador) notFound();

  const links = [
    criador.twitch && { label: "Twitch", href: criador.twitch },
    criador.youtube && { label: "YouTube", href: criador.youtube },
    criador.tiktok && { label: "TikTok", href: criador.tiktok },
    criador.kick && { label: "Kick", href: criador.kick },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                {criador.nickname || criador.nome}
              </h1>
              {criador.nomeCompleto && (
                <p className="text-zinc-500">{criador.nomeCompleto}</p>
              )}
            </div>
            {criador.situacao && (
              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {criador.situacao}
              </span>
            )}
          </div>

          {criador.conteudo && (
            <p className="mt-3 text-zinc-600">{criador.conteudo}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Horas de live", value: criador.horasLive },
            { label: "Vídeos longos", value: criador.videosLongos },
            { label: "Vídeos curtos", value: criador.videosCurtos },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-zinc-900">
                {stat.value ?? "—"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-zinc-900">Informações</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            {criador.plataformas.length > 0 && (
              <>
                <dt className="text-zinc-500">Plataformas</dt>
                <dd className="text-zinc-900">{criador.plataformas.join(", ")}</dd>
              </>
            )}
            {criador.projeto.length > 0 && (
              <>
                <dt className="text-zinc-500">Projeto</dt>
                <dd className="text-zinc-900">{criador.projeto.join(", ")}</dd>
              </>
            )}
            {criador.inicio && (
              <>
                <dt className="text-zinc-500">Início</dt>
                <dd className="text-zinc-900">{criador.inicio}</dd>
              </>
            )}
            {criador.valorReais != null && (
              <>
                <dt className="text-zinc-500">Valor base</dt>
                <dd className="text-zinc-900 font-medium">
                  R$ {criador.valorReais.toFixed(2)}
                </dd>
              </>
            )}
            {criador.discord && (
              <>
                <dt className="text-zinc-500">Discord</dt>
                <dd className="text-zinc-900">{criador.discord}</dd>
              </>
            )}
            <dt className="text-zinc-500">TheClassic ID</dt>
            <dd className="font-mono text-zinc-900">{criador.theClassicId}</dd>
          </dl>
        </div>

        {links.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold text-zinc-900">Links</h2>
            <div className="flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
