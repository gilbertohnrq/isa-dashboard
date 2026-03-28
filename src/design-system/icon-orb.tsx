import Image from "next/image";

import type { DashboardOrbTone } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const orbToneStyles: Record<DashboardOrbTone, string> = {
  neutral:
    "before:bg-[rgba(17,17,17,0.6)] before:[mix-blend-mode:luminosity] after:bg-[#777] after:[mix-blend-mode:color-dodge] bg-[#222]",
  danger:
    "before:bg-[rgba(17,17,17,0.6)] before:[mix-blend-mode:luminosity] after:bg-[var(--accent-red-soft)] after:[mix-blend-mode:color-dodge] bg-[#222]",
  success:
    "before:bg-[rgba(17,17,17,0.6)] before:[mix-blend-mode:luminosity] after:bg-[var(--accent-green-soft)] after:[mix-blend-mode:color-dodge] bg-[#222]",
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
        "relative flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[var(--shadow-button)] before:absolute before:inset-0 after:absolute after:inset-0",
        orbToneStyles[tone],
        className,
      )}
    >
      <span className="absolute inset-0 bg-[#222] [mix-blend-mode:plus-lighter]" />
      <Image
        alt={alt}
        width={24}
        height={24}
        src={src}
        unoptimized
        className={cn("relative z-10 size-6 object-contain", iconClassName)}
      />
    </div>
  );
}
