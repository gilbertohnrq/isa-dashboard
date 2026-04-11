import type { ReactNode } from "react";

export function WorkspaceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame">
      <main className="workspace-main">{children}</main>
    </div>
  );
}
