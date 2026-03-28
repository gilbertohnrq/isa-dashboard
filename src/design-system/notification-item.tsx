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
    <GlassPanel className="flex min-h-[50px] items-center gap-2.5 rounded-[18px] px-3 py-2.5">
      <Image alt="" width={20} height={20} src={iconSrc} unoptimized className="h-5 w-5" />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-[590] leading-[15px] tracking-[-0.2px] text-white/96">
            {title}
          </p>
          <p className="truncate text-[12px] leading-[15px] tracking-[-0.14px] text-white/76">
            {description}
          </p>
        </div>
        <p className="shrink-0 pt-px text-[12px] leading-[15px] tracking-[-0.14px] text-white/42">
          {time}
        </p>
      </div>
    </GlassPanel>
  );
}
