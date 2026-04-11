import { getCriadores, type Criador } from "@/lib/notion";

const situacaoCor: Record<string, string> = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-red-100 text-red-800",
  Pausado: "bg-yellow-100 text-yellow-800",
};

export default async function DadosPage() {
  const criadores = await getCriadores();

  const ativos = criadores.filter((c) => c.situacao === "Ativo");
  const totalPago = criadores.reduce((s, c) => s + (c.valorReais ?? 0), 0);
  const totalConteudos = criadores.reduce(
    (s, c) =>
      s + (c.horasLive ?? 0) + (c.videosLongos ?? 0) + (c.videosCurtos ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Dados dos Criadores</h1>
          <p className="mt-1 text-zinc-500">{criadores.length} cadastros no total</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total cadastros", value: criadores.length },
            { label: "Ativos", value: ativos.length },
            { label: "Total conteúdos", value: totalConteudos },
            {
              label: "Valor base total",
              value: `R$ ${totalPago.toFixed(2)}`,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-zinc-900">{kpi.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Nickname</th>
                <th className="px-4 py-3 font-medium">Situação</th>
                <th className="px-4 py-3 font-medium">Plataformas</th>
                <th className="px-4 py-3 font-medium">Projeto</th>
                <th className="px-4 py-3 font-medium">Lives (h)</th>
                <th className="px-4 py-3 font-medium">Vídeos L</th>
                <th className="px-4 py-3 font-medium">Vídeos C</th>
                <th className="px-4 py-3 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {criadores.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {c.nomeCompleto || c.nome}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.nickname || "—"}</td>
                  <td className="px-4 py-3">
                    {c.situacao ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          situacaoCor[c.situacao] ?? "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {c.situacao}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.plataformas.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.projeto.join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.horasLive ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{c.videosLongos ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{c.videosCurtos ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.valorReais != null
                      ? `R$ ${c.valorReais.toFixed(2)}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
