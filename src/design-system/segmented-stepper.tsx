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
    <div className="relative flex h-8 w-[308px] overflow-hidden rounded-full border border-white/10 bg-white/10 p-0.5 shadow-[var(--shadow-button)] backdrop-blur-xl">
      <motion.div
        className="absolute inset-y-0 left-0 z-0 w-1/2 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)),linear-gradient(90deg,rgba(116,116,128,0.2),rgba(116,116,128,0.08))]"
        animate={{ x: value === "perfil" ? "0%" : "100%" }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      />
      <span className="absolute left-1/2 top-1/2 z-10 h-6 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center text-[17px] font-[590] tracking-[-0.43px] text-white transition-opacity",
            value === option.value ? "opacity-100" : "opacity-84",
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
