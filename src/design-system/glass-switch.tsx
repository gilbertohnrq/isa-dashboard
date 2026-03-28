"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function GlassSwitch({ checked }: { checked: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-testid="glass-switch"
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "relative flex h-7 w-16 items-center overflow-hidden rounded-full p-0.5",
        checked ? "bg-[var(--accent-green)]" : "bg-[rgba(60,60,67,0.3)]",
      )}
    >
      {!checked && (
        <span className="absolute right-[7px] top-1/2 h-2.5 w-[21px] -translate-y-1/2 rounded-full bg-white/65" />
      )}
      <motion.span
        className="block h-6 w-[39px] rounded-full bg-white"
        animate={{ x: checked ? 21 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
