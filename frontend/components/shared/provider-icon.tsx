import { Cloud } from "lucide-react";
import { getService, PROVIDER_META } from "@/lib/catalog/nodes";
import { cn } from "@/lib/utils";

/**
 * Renders a service's provider icon.
 * - AWS/GCP: the real brand SVG via <img> (never recolored — DESIGN_SYSTEM rule).
 * - Azure (no assets yet): a monochrome Lucide glyph tinted with the Azure accent.
 *
 * ponytail: <img> over SVGR — 23 known, full-color, cached static assets don't
 * justify a bundler transform. See lib/catalog/nodes.ts.
 */
export function ProviderIcon({
  serviceId,
  size = 28,
  className,
}: {
  serviceId: string;
  size?: number;
  className?: string;
}) {
  const svc = getService(serviceId);
  if (!svc) return null;

  if (svc.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static provider SVGs, no optimization wanted
      <img
        src={svc.icon}
        alt={`${PROVIDER_META[svc.provider].label} ${svc.label}`}
        width={size}
        height={size}
        className={cn("shrink-0 select-none", className)}
        draggable={false}
      />
    );
  }

  return (
    <Cloud
      size={size}
      aria-label={`${PROVIDER_META[svc.provider].label} ${svc.label}`}
      className={cn("shrink-0", className)}
      style={{ color: PROVIDER_META[svc.provider].accentVar }}
    />
  );
}
