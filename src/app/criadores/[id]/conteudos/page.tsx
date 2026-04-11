import { notFound } from "next/navigation";

import { PartnerWorkspacePage } from "@/features/dashboard/partner-workspace-page";
import { getCreatorSnapshot, getCreatorStaticParams } from "@/features/creators/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getCreatorStaticParams();
}

export default async function CriadorConteudosPage({ params }: Props) {
  const { id } = await params;
  const snapshot = await getCreatorSnapshot(id, "conteudos");

  if (!snapshot) {
    notFound();
  }

  return <PartnerWorkspacePage section="conteudos" criadorId={id} snapshot={snapshot} />;
}

