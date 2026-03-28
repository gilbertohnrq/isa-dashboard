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
        "relative flex h-[24px] w-[46px] items-center overflow-hidden rounded-full border border-white/18 p-px shadow-[var(--shadow-soft)] backdrop-blur-xl",
        checked
          ? "bg-[linear-gradient(180deg,rgba(123,210,132,0.5),rgba(123,210,132,0.26))]"
          : "bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08)),rgba(235,240,255,0.04)]",
      )}
    >
      {!checked && <span className="absolute right-[6px] size-[7px] rounded-full border border-white/45" />}
      <motion.span
        className="block h-[20px] w-[20px] rounded-full bg-white shadow-[0_1px_8px_rgba(255,255,255,0.28)]"
        animate={{ x: checked ? 22 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
