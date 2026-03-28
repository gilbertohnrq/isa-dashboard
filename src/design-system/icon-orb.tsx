import Image from "next/image";

import type { DashboardOrbTone } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const orbToneStyles: Record<DashboardOrbTone, string> = {
  neutral:
    "before:bg-white/10 after:bg-[rgba(239,242,255,0.08)]",
  danger:
    "before:bg-[rgba(255,112,133,0.24)] after:bg-[rgba(245,214,220,0.12)]",
  success:
    "before:bg-[rgba(123,210,132,0.24)] after:bg-[rgba(219,245,221,0.12)]",
};

export function IconOrb({
  src,
  alt,
  tone,
  className,
  iconClassName,
  precomposed = false,
}: {
  src: string;
  alt: string;
  tone: DashboardOrbTone;
  className?: string;
  iconClassName?: string;
  precomposed?: boolean;
}) {
  if (precomposed) {
    return (
      <div className={cn("relative size-[38px] shrink-0", className)}>
        <Image alt={alt} fill src={src} unoptimized className="object-contain" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex size-[36px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/6 shadow-[var(--shadow-button)] before:absolute before:inset-0 after:absolute after:inset-0",
        orbToneStyles[tone],
        className,
      )}
    >
      <Image
        alt={alt}
        width={24}
        height={24}
        src={src}
        unoptimized
        className={cn("relative z-10 size-5 object-contain", iconClassName)}
      />
    </div>
  );
}
