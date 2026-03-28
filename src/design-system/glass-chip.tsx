import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  "glass-button-shell relative inline-flex h-[26px] min-w-[66px] items-center justify-center rounded-[1000px] px-4 py-1.5 text-center text-[11px] font-[510] text-white",
  {
    variants: {
      tone: {
        twitch: "before:bg-[var(--accent-purple)]/36",
        youtube: "before:bg-[var(--accent-youtube)]/38",
      },
    },
  },
);

export function GlassChip({
  label,
  tone,
}: {
  label: string;
  tone: "twitch" | "youtube";
}) {
  return (
    <span
      className={cn(
        chipVariants({ tone }),
        "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-30",
      )}
    >
      <span className="relative z-10">{label}</span>
    </span>
  );
}
