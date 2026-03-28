import type { ReactNode } from "react";

import { AppSidebar } from "@/features/navigation/app-sidebar";

export function WorkspaceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame">
      <div className="workspace-shell">
        <AppSidebar />
        <main className="workspace-main">{children}</main>
      </div>
    </div>
  );
}
