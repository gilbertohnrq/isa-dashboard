"use client";

import { motion } from "framer-motion";

import type { DashboardStatusTone } from "@/features/dashboard/types";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const startPoint = polarToCartesian(cx, cy, r, end);
  const endPoint = polarToCartesian(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;

  return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y}`;
}

export function GaugeMetric({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: DashboardStatusTone;
}) {
  const progress = Math.min(value / max, 1);
  const track = arcPath(72, 72, 44, 215, 505);
  const endAngle = 215 + progress * 290;
  const progressPath = arcPath(72, 72, 44, 215, endAngle);
  const endPoint = polarToCartesian(72, 72, 44, endAngle);
  const color = tone === "positive" && value >= max ? "var(--accent-green)" : "#f0f4f8";
  const glow = tone === "positive" && value >= max ? "rgba(52, 199, 89, 0.45)" : "rgba(255,255,255,0.45)";

  return (
    <div className="relative flex h-[118px] w-[118px] flex-col items-center justify-end text-center">
      <svg
        viewBox="0 0 144 118"
        className="absolute left-1/2 top-0 h-[96px] w-[118px] -translate-x-1/2 overflow-visible"
        aria-hidden="true"
      >
        <path
          d={track}
          stroke="rgba(228, 235, 240, 0.32)"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <motion.path
          d={progressPath}
          stroke={color}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="6.5"
          fill={color}
          stroke="white"
          strokeWidth="3"
          animate={{ cx: endPoint.x, cy: endPoint.y }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <motion.span
        key={`${label}-${value}`}
        initial={{ opacity: 0.55, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="dashboard-number-xl z-10 mt-3 text-[32px] sm:text-[36px]"
      >
        {value}
      </motion.span>
      <span className="mt-1 text-[13px] font-[500] text-white">{label}</span>
    </div>
  );
}
