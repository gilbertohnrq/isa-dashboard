import { PartnerWorkspacePage } from "@/features/dashboard/partner-workspace-page";
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
  return <PartnerWorkspacePage section="dashboard" criadorId={id} />;
}
