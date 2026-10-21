import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionVariant = "primary" | "secondary" | "ghost";
type ActionSize = "sm" | "md" | "lg";
type ActionIcon = "arrow-up-right" | "arrow-right" | "send" | "none";

interface BaseActionProps {
  children: React.ReactNode;
  variant?: ActionVariant;
  size?: ActionSize;
  icon?: ActionIcon;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

type LinkActionProps = BaseActionProps & {
  href: string;
  onClick?: () => void;
};

type ButtonActionProps = BaseActionProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseActionProps> & {
    href?: undefined;
  };

export type ActionButtonProps = LinkActionProps | ButtonActionProps;

const SIZE_STYLES: Record<ActionSize, string> = {
  sm: "h-9 px-4 text-[12.5px] gap-2",
  md: "h-11 px-5 text-[13.5px] gap-2.5",
  lg: "h-12 px-6.5 text-[14px] gap-2.5",
};

function ActionIconGlyph({
  icon,
  variant,
  loading,
}: {
  icon: ActionIcon;
  variant: ActionVariant;
  loading?: boolean;
}) {
  if (loading) {
    return <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />;
  }
  if (icon === "none") return null;

  if (variant === "ghost") {
    return icon === "arrow-up-right" ? (
      <ArrowUpRight
        className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    ) : (
      <ArrowRight
        className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
        variant === "primary"
          ? "bg-black/[0.08] text-[#070709] group-hover:bg-black/[0.13]"
          : "bg-white/[0.08] text-foreground group-hover:bg-white/[0.14]"
      )}
    >
      {icon === "send" ? (
        <Send className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      ) : icon === "arrow-right" ? (
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : (
        <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </span>
  );
}

/**
 * Bouton signature 4ur — géométrie capsule haute précision, biseau spéculaire
 * et micro-médaillon directionnel animé sur GPU.
 */
export function ActionButton(props: ActionButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon = "arrow-up-right",
    loading = false,
    fullWidth = false,
    className,
  } = props;

  const classes = cn(
    "group inline-flex select-none items-center justify-center rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
    SIZE_STYLES[size],
    variant === "primary" && "btn-pearl btn-sheen font-semibold",
    variant === "secondary" && "btn-obsidian font-medium",
    variant === "ghost" &&
      "h-auto px-0 py-1 font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      <span>{children}</span>
      <ActionIconGlyph icon={icon} variant={variant} loading={loading} />
    </>
  );

  if (typeof props.href === "string") {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    loading: _l,
    fullWidth: _f,
    href: _h,
    ...buttonRest
  } = props;
  void _v;
  void _s;
  void _i;
  void _l;
  void _f;
  void _h;

  return (
    <button
      {...buttonRest}
      disabled={buttonRest.disabled || loading}
      className={cn(classes, "disabled:pointer-events-none disabled:opacity-55")}
    >
      {content}
    </button>
  );
}

/** Capsule de surtitre minimaliste en verre fumé. */
export function EyebrowPill({
  children,
  dot = "emerald",
  className,
}: {
  children: React.ReactNode;
  dot?: "emerald" | "white" | "none";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)] backdrop-blur-md",
        className
      )}
    >
      {dot !== "none" && (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            dot === "emerald"
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]"
              : "bg-white/80"
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
