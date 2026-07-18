import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  align = "center",
  className,
  headerClassName,
  contentClassName,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <section
      id={id}
      className={cn(
        "section-shell relative mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-14",
        className,
      )}
    >
      {(eyebrow || title || intro) && (
        <header
          className={cn(
            "mb-16 flex flex-col gap-5 md:mb-20",
            centered && "items-center text-center",
            headerClassName,
          )}
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-ai animate-pulse-slow" />
              {eyebrow}
            </span>
          )}
          {title && (
            <h2
              className={cn(
                "font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-ink",
                centered ? "mx-auto max-w-4xl" : "max-w-4xl",
              )}
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              className={cn(
                "text-base leading-relaxed text-ink-dim md:text-lg",
                centered ? "mx-auto max-w-2xl" : "max-w-2xl",
              )}
            >
              {intro}
            </p>
          )}
        </header>
      )}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </section>
  );
}
