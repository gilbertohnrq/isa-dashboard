import { getResumos, getCriadores } from "@/lib/notion";

export default async function FinanceiroPage() {
  const [resumos, criadores] = await Promise.all([getResumos(), getCriadores()]);

  const totalBase = criadores.reduce((s, c) => s + (c.valorReais ?? 0), 0);
  const ativos = criadores.filter((c) => c.situacao === "Ativo");

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Financeiro</h1>
          <p className="mt-1 text-zinc-500">Visão geral de pagamentos e contratos</p>
        </div>

        {/* KPIs dos criadores ativos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-zinc-900">{ativos.length}</p>
            <p className="mt-1 text-sm text-zinc-500">Criadores ativos</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-zinc-900">
              R$ {totalBase.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Valor base total/mês</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-zinc-900">
              {ativos.length > 0
                ? `R$ ${(totalBase / ativos.length).toFixed(2)}`
                : "—"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Média por criador</p>
          </div>
        </div>

        {/* Tabela de criadores com valores */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">Por criador</h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Criador</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  <th className="px-4 py-3 font-medium">Projeto</th>
                  <th className="px-4 py-3 font-medium">Início</th>
                  <th className="px-4 py-3 font-medium">Valor (R$)</th>
                  <th className="px-4 py-3 font-medium">Valor (TCC)</th>
                  <th className="px-4 py-3 font-medium">Chave PIX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {criadores.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {c.nomeCompleto || c.nome}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{c.situacao ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {c.projeto.join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{c.inicio ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {c.valorReais != null ? `R$ ${c.valorReais.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">—</td>
                    <td className="px-4 py-3 text-zinc-500 font-mono text-xs">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo mensal - se disponível */}
        {resumos.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">Resumo mensal</h2>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mês</th>
                    <th className="px-4 py-3 font-medium">Criadores</th>
                    <th className="px-4 py-3 font-medium">Total pago</th>
                    <th className="px-4 py-3 font-medium">Conteúdos</th>
                    <th className="px-4 py-3 font-medium">Projeto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {resumos.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{r.mes}</td>
                      <td className="px-4 py-3 text-zinc-600">{r.totalCriadores ?? "—"}</td>
                      <td className="px-4 py-3 text-zinc-600">
                        {r.totalPago != null ? `R$ ${r.totalPago.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{r.totalConteudos ?? "—"}</td>
                      <td className="px-4 py-3 text-zinc-600">
                        {r.projeto.join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resumos.length === 0 && (
          <p className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Database "Resumo" ainda não compartilhado com a integração. Acesse o
            Notion → database → ••• → Connections → adicione a integração.
          </p>
        )}
      </div>
    </main>
  );
}
