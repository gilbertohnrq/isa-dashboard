import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const glassPanelVariants = cva("glass-panel", {
  variants: {
    tone: {
      default: "",
      strong:
        "border-[color:var(--glass-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.11)),rgba(235,240,255,0.08)]",
      bright:
        "border-[color:rgba(255,255,255,0.28)] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.18)),rgba(246,248,255,0.14)]",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

type GlassPanelProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof glassPanelVariants> & {
    as?: "section" | "article" | "aside" | "div";
  };

export function GlassPanel({
  as: Component = "section",
  className,
  tone,
  ...props
}: GlassPanelProps) {
  return <Component className={cn(glassPanelVariants({ tone }), className)} {...props} />;
}
