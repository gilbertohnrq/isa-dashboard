import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse rounded-[inherit] bg-white/10", {
  variants: {
    tone: {
      default: "bg-white/10",
      soft: "bg-white/6",
      bright: "bg-white/14",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, tone, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ tone }), className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
