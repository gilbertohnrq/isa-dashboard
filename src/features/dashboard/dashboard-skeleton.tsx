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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[70px] w-[155px] rounded-full" tone="bright" />
        <div className="flex gap-4">
          <Skeleton className="size-[70px] rounded-full" />
          <Skeleton className="h-[70px] w-[155px] rounded-full" />
        </div>
        <Skeleton className="h-8 w-[308px] rounded-full" tone="bright" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-[34px] w-[204px] rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="size-[70px] rounded-full" />
        </div>
      </div>
      <div className="mt-[42px] flex flex-col gap-6 xl:flex-row xl:gap-[61px]">
        <div className="flex w-full flex-col gap-6 xl:w-[435px] xl:gap-[64px]">
          <SkeletonPanel className="h-[490px] p-[25px]" titleWidth="w-[180px]">
            <Skeleton className="mx-auto mt-5 size-[349px] rounded-full" />
            <Skeleton className="mx-auto mt-[13px] h-[44px] w-[89px] rounded-full" />
          </SkeletonPanel>
          <SkeletonPanel className="h-[475px] p-[25px]" titleWidth="w-[123px]">
            <div className="mt-[34px] flex flex-col gap-[23px]">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[69px] rounded-[24px]" />
              ))}
            </div>
          </SkeletonPanel>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6 xl:w-[1363px] xl:gap-[64px]">
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
            <SkeletonPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]" titleWidth="w-[123px]">
              <Skeleton className="mt-3 h-6 w-[240px]" />
              <Skeleton className="mt-[43px] h-[26px] w-[140px] rounded-full" />
            </SkeletonPanel>
            <SkeletonPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]" titleWidth="w-[230px]">
              <div className="mt-[23px] flex items-center justify-center gap-8">
                <Skeleton className="h-[148px] w-[144px] rounded-[30px]" />
                <Skeleton className="h-[148px] w-[144px] rounded-[30px]" />
              </div>
            </SkeletonPanel>
            <SkeletonPanel className="h-[259px] w-full p-[25px] 2xl:w-[412px]" titleWidth="w-[80px]">
              <Skeleton className="mx-auto mt-6 h-12 w-[200px]" />
              <Skeleton className="mx-auto mt-10 h-12 w-[220px]" />
            </SkeletonPanel>
          </div>
          <SkeletonPanel className="h-[265px] p-[25px]" titleWidth="w-[250px]">
            <Skeleton className="mt-[42px] h-[18px] w-full rounded-full" />
            <Skeleton className="ml-auto mt-16 h-16 w-[160px]" />
          </SkeletonPanel>
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:justify-between">
            <SkeletonPanel className="h-[265px] w-full p-[25px] 2xl:w-[649px]" titleWidth="w-[190px]">
              <div className="mt-[38px] flex items-center justify-between gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex w-[90px] flex-col items-center">
                    <Skeleton className="h-[91px] w-[90px] rounded-full" />
                    <Skeleton className="mt-4 h-4 w-14" />
                  </div>
                ))}
              </div>
            </SkeletonPanel>
            <SkeletonPanel className="h-[265px] w-full p-[25px] 2xl:w-[649px]" titleWidth="w-[100px]">
              <div className="mt-[15px] grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                ))}
              </div>
            </SkeletonPanel>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center xl:mt-[26px]">
        <Skeleton className="h-4 w-[240px]" />
      </div>
    </div>
  );
}
