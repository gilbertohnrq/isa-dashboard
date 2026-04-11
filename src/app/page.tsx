import { CreatorDirectory } from "@/features/creators/creator-directory";
import { getCreatorDirectoryItems } from "@/features/creators/server";
import { WorkspaceFrame } from "@/features/navigation/workspace-frame";

export default async function HomePage() {
  const items = await getCreatorDirectoryItems();

  return (
    <WorkspaceFrame className="app-frame--directory">
      <CreatorDirectory items={items} />
    </WorkspaceFrame>
  );
}
