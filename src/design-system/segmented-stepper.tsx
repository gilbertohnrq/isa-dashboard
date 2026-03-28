"use client";

import { motion } from "framer-motion";

import type { DashboardPreset } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const options: Array<{ value: DashboardPreset; label: string }> = [
  { value: "perfil", label: "Perfil" },
  { value: "painel", label: "Painel" },
];

export function SegmentedStepper({
  value,
  onChange,
}: {
  value: DashboardPreset;
  onChange: (value: DashboardPreset) => void;
}) {
  return (
    <div className="relative flex h-[42px] w-[252px] overflow-hidden rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08)),rgba(235,240,255,0.06)] p-[3px] shadow-[var(--shadow-button)] backdrop-blur-xl">
      <motion.div
        className="absolute inset-y-[3px] left-[3px] z-0 w-[calc(50%-3px)] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08)),rgba(235,240,255,0.08)]"
        animate={{ x: value === "perfil" ? "0%" : "100%" }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      />
      <span className="absolute left-1/2 top-1/2 z-10 h-[22px] w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/18" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center text-[14px] font-[590] tracking-[-0.24px] text-white transition-opacity",
            value === option.value ? "opacity-100" : "opacity-75",
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
