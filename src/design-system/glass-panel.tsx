import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const glassPanelVariants = cva("glass-panel", {
  variants: {
    tone: {
      default: "",
      strong:
        "border-[color:var(--glass-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06)),linear-gradient(180deg,rgba(36,38,44,0.82),rgba(36,38,44,0.7))]",
      bright:
        "border-[color:rgba(255,255,255,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(255,255,255,0.12)),linear-gradient(180deg,rgba(215,219,226,0.2),rgba(215,219,226,0.06))]",
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
