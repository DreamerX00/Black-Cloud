/* eslint-disable @next/next/no-img-element */
// Brand + cloud-service marks.
// - Provider service icons: official SVGs the user dropped in /public/providers/
//   ({aws,gcp}/<catalogId>.svg). Rendered as <img> (they're color SVGs, not glyph
//   fonts). Azure has no asset pack yet + GCP Pub/Sub has no unique icon → those
//   fall back to a provider-tinted lucide Cloud.
// - Tech/tooling logos (marquees, integrations): react-icons Simple Icons (si).
import type { ComponentType } from "react";
import { Cloud } from "lucide-react";
import {
  SiGooglecloud,
  SiKubernetes,
  SiTerraform,
  SiCloudflare,
  SiVercel,
  SiPulumi,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiFlydotio,
} from "react-icons/si";
import type { Provider } from "@/lib/catalog/nodes";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string; size?: number }>;

export const PROVIDER_COLOR: Record<Provider, string> = {
  aws: "var(--provider-aws)",
  azure: "var(--provider-azure)",
  gcp: "var(--provider-gcp)",
};

// Catalog service ids (lib/catalog/nodes.ts) that have a real SVG in /public/providers.
const AWS_ASSETS = new Set(["ec2", "s3", "lambda", "rds", "dynamodb", "eks", "ecs", "sqs", "cloudfront"]);
const GCP_ASSETS = new Set(["gce", "gcs", "run", "spanner", "bigquery", "gke", "cloudsql"]);

/** Public URL for a service icon asset, or null if none exists (→ use fallback). */
export function serviceIconSrc(provider: Provider, id: string): string | null {
  if (provider === "aws" && AWS_ASSETS.has(id)) return `/providers/aws/${id}.svg`;
  if (provider === "gcp" && GCP_ASSETS.has(id)) return `/providers/gcp/${id}.svg`;
  return null;
}

/**
 * Renders the official cloud-service mark for a catalog service, falling back to
 * a provider-tinted Cloud glyph when no asset exists (Azure, GCP Pub/Sub).
 */
export function ServiceIcon({
  provider,
  id,
  name,
  className,
  size = 40,
}: {
  provider: Provider;
  id: string;
  name?: string;
  className?: string;
  size?: number;
}) {
  const src = serviceIconSrc(provider, id);
  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} icon` : `${provider} service icon`}
        width={size}
        height={size}
        className={cn("object-contain", className)}
        loading="lazy"
      />
    );
  }
  return (
    <Cloud
      className={className}
      size={size}
      style={{ color: PROVIDER_COLOR[provider] }}
      aria-label={name ? `${name} icon` : `${provider} service icon`}
    />
  );
}

// Tech/tooling logos used across marketing.
export const TECH_ICON: Record<string, IconType> = {
  "Google Cloud": SiGooglecloud,
  Kubernetes: SiKubernetes,
  Terraform: SiTerraform,
  Cloudflare: SiCloudflare,
  Vercel: SiVercel,
  Pulumi: SiPulumi,
  Docker: SiDocker,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  "Fly.io": SiFlydotio,
};
