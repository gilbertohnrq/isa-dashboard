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
  const markerOffset = `calc(${progress * 100}% - 6.5px)`;

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative mt-7 h-[96px]">
        <div className="absolute left-0 right-0 top-0 h-[10px] rounded-full bg-white/22">
          <motion.div
            className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-white/86"
            animate={{
              width: `${progress * 100}%`,
              backgroundColor: isComplete ? "var(--accent-green)" : "rgba(255,255,255,0.82)",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          <motion.span
            className="absolute top-1/2 block size-[13px] -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_16px_rgba(255,255,255,0.35)]"
            animate={{
              left: markerOffset,
              backgroundColor: isComplete ? "var(--accent-green)" : "#ffffff",
              boxShadow: isComplete
                ? "0 0 18px rgba(52, 199, 89, 0.48)"
                : "0 0 18px rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
        <motion.div
          className="absolute top-[30px] w-[104px] -translate-x-1/2 text-center"
          animate={{ left: `clamp(52px, calc(${progress * 100}% + 0px), calc(100% - 52px))` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.span
            key={current}
            initial={{ opacity: 0.5, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block text-[36px] font-bold leading-none tracking-[-1px] sm:text-[40px]"
          >
            {current}
          </motion.span>
          <span className="mt-1 block text-[13px] font-[500] text-white">{unit}</span>
        </motion.div>
      </div>
      <span className="absolute right-0 top-[6px] text-[12px] leading-[16px] text-white/35">
        {target}h
      </span>
      <div className="mt-auto pb-2" />
    </div>
  );
}
