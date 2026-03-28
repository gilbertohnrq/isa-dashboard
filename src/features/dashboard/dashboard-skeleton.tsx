import { Skeleton } from "@/components/ui/skeleton";
import { GlassPanel } from "@/design-system/glass-panel";

function SkeletonPanel({
  className,
  titleWidth,
  children,
}: {
  className: string;
  titleWidth: string;
  children?: React.ReactNode;
}) {
  return (
    <GlassPanel className={className}>
      <Skeleton className={`h-[29px] ${titleWidth}`} tone="bright" />
      {children}
    </GlassPanel>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-[58px] w-[122px] rounded-full" tone="bright" />
        <div className="flex gap-3">
          <Skeleton className="size-[52px] rounded-full" />
          <Skeleton className="h-[52px] w-[138px] rounded-full" />
        </div>
        <Skeleton className="h-[42px] w-[252px] rounded-full" tone="bright" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-[36px] w-[170px] rounded-full" />
          <Skeleton className="h-[36px] w-[58px] rounded-full" />
          <Skeleton className="h-[24px] w-[46px] rounded-full" />
          <Skeleton className="size-[52px] rounded-full" />
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-5 xl:flex-row xl:gap-[var(--shell-gap)]">
        <div className="flex w-full flex-col gap-5 xl:w-[var(--sidebar-width)] xl:gap-[var(--sidebar-gap)]">
          <SkeletonPanel className="h-[356px] p-[18px]" titleWidth="w-[160px]">
            <Skeleton className="mx-auto mt-3 size-[252px] rounded-full" />
            <Skeleton className="mx-auto mt-3 h-[34px] w-[78px] rounded-full" />
          </SkeletonPanel>
          <SkeletonPanel className="min-h-[330px] p-[18px]" titleWidth="w-[110px]">
            <div className="mt-4 flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[50px] rounded-[18px]" />
              ))}
            </div>
          </SkeletonPanel>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 xl:gap-[var(--content-gap)]">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-[var(--content-gap)]">
            <SkeletonPanel className="h-[184px] w-full p-[18px]" titleWidth="w-[110px]">
              <Skeleton className="mt-3 h-5 w-[200px]" />
              <Skeleton className="mt-3 h-[24px] w-[118px] rounded-full" />
            </SkeletonPanel>
            <SkeletonPanel className="h-[184px] w-full p-[18px]" titleWidth="w-[180px]">
              <div className="mt-3 flex items-center justify-around gap-4">
                <Skeleton className="h-[118px] w-[118px] rounded-[26px]" />
                <Skeleton className="h-[118px] w-[118px] rounded-[26px]" />
              </div>
            </SkeletonPanel>
            <SkeletonPanel className="h-[184px] w-full p-[18px]" titleWidth="w-[64px]">
              <div className="mt-3 grid h-[132px] gap-1.5">
                <Skeleton className="mx-auto h-10 w-[176px]" />
                <Skeleton className="mx-auto h-10 w-[188px]" />
              </div>
            </SkeletonPanel>
          </div>
          <SkeletonPanel className="min-h-[188px] p-[18px]" titleWidth="w-[190px]">
            <Skeleton className="mt-7 h-[10px] w-full rounded-full" />
            <Skeleton className="ml-auto mt-14 h-12 w-[118px]" />
          </SkeletonPanel>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-[var(--content-gap)]">
            <SkeletonPanel className="h-full min-h-[188px] w-full p-[18px]" titleWidth="w-[150px]">
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Skeleton className="h-[64px] w-[64px] rounded-full" />
                    <Skeleton className="mt-2 h-3.5 w-12" />
                  </div>
                ))}
              </div>
            </SkeletonPanel>
            <SkeletonPanel className="h-full min-h-[188px] w-full p-[18px]" titleWidth="w-[84px]">
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-3.5 w-18" />
                    <Skeleton className="mt-1.5 h-3.5 w-22" />
                  </div>
                ))}
              </div>
            </SkeletonPanel>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center xl:mt-5">
        <Skeleton className="h-3.5 w-[220px]" />
      </div>
    </div>
  );
}
