import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CommonProps = {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
};

const styles = (v: CommonProps["variant"], s: CommonProps["size"]) => {
  const size = s === "sm" ? "px-3 py-1.5 text-xs" : s === "lg" ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm";
  const variant =
    v === "ghost"
      ? "border border-white/10 bg-white/[0.02] text-ink-dim hover:text-ink hover:bg-white/[0.06]"
      : v === "outline"
      ? "border border-white/15 bg-transparent text-ink hover:bg-white/[0.04]"
      : v === "danger"
      ? "bg-danger/90 text-white hover:bg-danger"
      : "clay text-ink hover:-translate-y-0.5";
  return cn(
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full font-medium transition-all",
    size,
    variant
  );
};

export function PillButton({
  href,
  onClick,
  type,
  disabled,
  variant = "primary",
  size = "md",
  icon,
  trailing,
  children,
  className,
}: CommonProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const inner = (
    <>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      {icon && <span className="relative -ml-0.5 grid place-items-center">{icon}</span>}
      <span className="relative">{children}</span>
      {trailing && <span className="relative">{trailing}</span>}
    </>
  );
  const cls = cn(styles(variant, size), disabled && "pointer-events-none opacity-50", className);

  if (href) {
    return (
      <Link href={href} data-cursor="magnet" className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} data-cursor="magnet" className={cls} disabled={disabled}>
      {inner}
    </button>
  );
}
