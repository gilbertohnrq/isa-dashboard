import { getEntregas } from "@/lib/notion";

const statusCor: Record<string, string> = {
  Entregue: "bg-green-100 text-green-800",
  Pendente: "bg-yellow-100 text-yellow-800",
  Atrasado: "bg-red-100 text-red-800",
  "Em andamento": "bg-blue-100 text-blue-800",
};

export default async function ConteudosPage() {
  const entregas = await getEntregas();

  if (entregas.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-zinc-900">Conteúdos / Entregas</h1>
          <p className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Database "Entregas" ainda não compartilhado com a integração. Acesse o
            Notion → database → ••• → Connections → adicione a integração.
          </p>
        </div>
      </main>
    );
  }

  const porStatus = entregas.reduce<Record<string, number>>((acc, e) => {
    const k = e.status ?? "Sem status";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Conteúdos / Entregas</h1>
          <p className="mt-1 text-zinc-500">{entregas.length} entregas no total</p>
        </div>

        {/* Status summary */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(porStatus).map(([status, count]) => (
            <div
              key={status}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                statusCor[status] ?? "bg-zinc-100 text-zinc-700"
              }`}
            >
              {status}: {count}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Criador</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Data entrega</th>
                <th className="px-4 py-3 font-medium">Projeto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {entregas.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{e.nome || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{e.criador ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{e.tipo ?? "—"}</td>
                  <td className="px-4 py-3">
                    {e.status ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusCor[e.status] ?? "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {e.status}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{e.dataEntrega ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {e.projeto.join(", ") || "—"}
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
