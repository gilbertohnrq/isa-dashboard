import { cva } from "class-variance-authority";

import type { DashboardStatusTone } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const statusPillVariants = cva(
  "relative flex h-[58px] w-[122px] items-center gap-2 overflow-hidden rounded-[100px] px-[10px] shadow-[var(--shadow-button)] backdrop-blur-xl",
  {
    variants: {
      tone: {
        positive:
          "border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.09)),rgba(235,240,255,0.08)] text-white",
        negative:
          "border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(236,239,243,0.6))] text-black",
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
          "flex size-9 items-center justify-center rounded-full",
          isPositive ? "bg-white/18" : "bg-black/6",
        )}
      >
        <span
          className={cn(
            "block size-[18px] rounded-full border-[5px] border-white",
            isPositive ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]",
          )}
        />
      </div>
      <div className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            "text-[12px] font-[500] tracking-[-0.12px] text-white/88",
            !isPositive && "text-black",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "mt-[2px] text-[13px] font-[500] tracking-[-0.12px] text-white/62",
            !isPositive && "text-[var(--text-dark-secondary)]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
