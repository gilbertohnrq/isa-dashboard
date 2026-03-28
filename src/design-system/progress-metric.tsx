"use client";

import { motion } from "framer-motion";

export function ProgressMetric({
  current,
  target,
  unit,
}: {
  current: number;
  target: number;
  unit: string;
}) {
  const progress = Math.min(current / target, 1);
  const isComplete = progress >= 1;

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative mt-[42px] h-[18px] rounded-full bg-white/18">
        <motion.div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/80"
          animate={{
            width: `${progress * 100}%`,
            backgroundColor: isComplete ? "var(--accent-green)" : "rgba(255,255,255,0.82)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.span
          className="absolute top-1/2 block size-[13px] -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          animate={{
            left: `calc(${progress * 100}% - 6.5px)`,
            backgroundColor: isComplete ? "var(--accent-green)" : "#ffffff",
            boxShadow: isComplete
              ? "0 0 18px rgba(52, 199, 89, 0.48)"
              : "0 0 18px rgba(255,255,255,0.35)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
      <span className="absolute right-0 top-[18px] text-[14px] leading-[18px] text-white/35">
        {target}h
      </span>
      <div className="mt-auto flex flex-col items-end pb-[18px]">
        <motion.span
          key={current}
          initial={{ opacity: 0.5, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[48px] font-bold leading-none tracking-[-1px]"
        >
          {current}
        </motion.span>
        <span className="mt-1 text-[16px] font-[510] text-white">{unit}</span>
      </div>
    </div>
  );
}
