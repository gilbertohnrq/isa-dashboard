import { notFound } from "next/navigation";

import { PartnerWorkspacePage } from "@/features/dashboard/partner-workspace-page";
import { getCreatorSnapshot, getCreatorStaticParams } from "@/features/creators/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getCreatorStaticParams();
}

export default async function CriadorFinanceiroPage({ params }: Props) {
  const { id } = await params;
  const snapshot = await getCreatorSnapshot(id, "financeiro");

  if (!snapshot) {
    notFound();
  }

  return <PartnerWorkspacePage section="financeiro" criadorId={id} snapshot={snapshot} />;
}

