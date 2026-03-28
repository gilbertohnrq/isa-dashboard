import Image from "next/image";

import { GlassPanel } from "@/design-system/glass-panel";

export function NotificationItem({
  title,
  description,
  time,
  iconSrc,
}: {
  title: string;
  description: string;
  time: string;
  iconSrc: string;
}) {
  return (
    <GlassPanel className="flex h-[69px] items-center gap-[10px] rounded-[24px] px-[14px] py-3">
      <Image alt="" width={36} height={40} src={iconSrc} unoptimized className="h-10 w-9" />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-[590] leading-[17px] tracking-[-0.23px]">
            {title}
          </p>
          <p className="truncate text-[15px] leading-[18px] tracking-[-0.23px] text-white/80">
            {description}
          </p>
        </div>
        <p className="shrink-0 text-[15px] leading-[17px] tracking-[-0.23px] text-[#8a8a8a]">
          {time}
        </p>
      </div>
    </GlassPanel>
  );
}
