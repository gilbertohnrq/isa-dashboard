import Image from "next/image";

import { cn } from "@/lib/utils";

export function CreatorAvatar({
  name,
  initials,
  src,
  className,
  imageClassName,
  fallbackClassName,
}: {
  name: string;
  initials: string;
  src?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_52%),linear-gradient(180deg,rgba(79,125,73,0.35),rgba(16,20,24,0.94))]",
        className,
      )}
    >
      {src ? (
        src.startsWith("/") ? (
          <Image
            alt={name}
            fill
            src={src}
            unoptimized
            className={cn("object-cover", imageClassName)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={name}
            src={src}
            className={cn("h-full w-full object-cover", imageClassName)}
          />
        )
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "flex h-full w-full items-center justify-center text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
            fallbackClassName,
          )}
        >
          {initials}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 bg-white/4" />
    </div>
  );
}
