import { getCriadores, type Criador } from "@/lib/notion";

const situacaoCor: Record<string, string> = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-red-100 text-red-800",
  Pausado: "bg-yellow-100 text-yellow-800",
};

function PlataformaIcon({ nome }: { nome: string }) {
  const icons: Record<string, string> = {
    Twitch: "🟣",
    Youtube: "🔴",
    TikTok: "⚫",
    Kick: "🟢",
    Facebook: "🔵",
  };
  return <span title={nome}>{icons[nome] ?? "🌐"} {nome}</span>;
}

function CriadorCard({ c }: { c: Criador }) {
  const links = [
    c.twitch && { label: "Twitch", href: c.twitch },
    c.youtube && { label: "YouTube", href: c.youtube },
    c.tiktok && { label: "TikTok", href: c.tiktok },
    c.kick && { label: "Kick", href: c.kick },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {c.nickname || c.nome}
          </h2>
          {c.nomeCompleto && (
            <p className="text-sm text-zinc-500">{c.nomeCompleto}</p>
          )}
        </div>
        {c.situacao && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              situacaoCor[c.situacao] ?? "bg-zinc-100 text-zinc-700"
            }`}
          >
            {c.situacao}
          </span>
        )}
      </div>

      {c.plataformas.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm text-zinc-600">
          {c.plataformas.map((p) => (
            <PlataformaIcon key={p} nome={p} />
          ))}
        </div>
      )}

      {c.conteudo && (
        <p className="text-sm text-zinc-500">{c.conteudo}</p>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-50 p-3 text-center text-sm">
        <div>
          <p className="font-semibold text-zinc-900">{c.horasLive ?? "—"}</p>
          <p className="text-xs text-zinc-500">Horas live</p>
        </div>
        <div>
          <p className="font-semibold text-zinc-900">{c.videosLongos ?? "—"}</p>
          <p className="text-xs text-zinc-500">Vídeos longos</p>
        </div>
        <div>
          <p className="font-semibold text-zinc-900">{c.videosCurtos ?? "—"}</p>
          <p className="text-xs text-zinc-500">Vídeos curtos</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {c.valorReais != null ? (
          <p className="text-sm font-medium text-zinc-700">
            R$ {c.valorReais.toFixed(2)}
          </p>
        ) : <span />}
        {c.projeto.length > 0 && (
          <div className="flex gap-1">
            {c.projeto.map((proj) => (
              <span
                key={proj}
                className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
              >
                {proj}
              </span>
            ))}
          </div>
        )}
      </div>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function Home() {
  const criadores = await getCriadores();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Criadores Parceiros</h1>
          <p className="mt-1 text-zinc-500">{criadores.length} criadores cadastrados</p>
        </div>

        {criadores.length === 0 ? (
          <p className="text-zinc-400">Nenhum criador encontrado.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criadores.map((c) => (
              <CriadorCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
