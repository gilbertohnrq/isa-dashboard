import { cva } from "class-variance-authority";

import type { DashboardStatusTone } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const statusPillVariants = cva(
  "relative flex h-[70px] w-[155px] items-center gap-2 overflow-hidden rounded-[100px] px-[14px] shadow-[var(--shadow-button)] backdrop-blur-xl",
  {
    variants: {
      tone: {
        positive:
          "border border-white/6 bg-[linear-gradient(180deg,rgba(36,36,36,0.88),rgba(36,36,36,0.72))] text-white",
        negative:
          "border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(225,229,236,0.68))] text-black",
      },
    },
  },
);

export function StatusPill({
  title,
  label,
  tone,
}: {
  title: string;
  label: string;
  tone: DashboardStatusTone;
}) {
  const isPositive = tone === "positive";

  return (
    <div className={statusPillVariants({ tone })}>
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          isPositive ? "bg-white/12" : "bg-black/6",
        )}
      >
        <span
          className={cn(
            "block size-4 rounded-full border-4 border-white",
            isPositive ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]",
          )}
        />
      </div>
      <div className="flex flex-col justify-center leading-none">
        <span className={cn("dashboard-text-label", !isPositive && "text-black")}>{title}</span>
        <span
          className={cn(
            "dashboard-text-detail mt-1",
            !isPositive && "text-[var(--text-dark-secondary)]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
