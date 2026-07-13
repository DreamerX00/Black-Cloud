/**
 * Cloud service catalog — the MVP node library.
 * Source of truth for scope: plan/MVP.md § Node Library (AWS 13 / Azure 5 / GCP 5).
 *
 * Icons are static assets under /public. AWS + GCP ship real provider SVGs;
 * Azure ships none yet (see ICON note below), so Azure entries carry `icon: null`
 * and the UI falls back to a monochrome Lucide glyph tinted with the Azure accent.
 *
 * ponytail: Azure fallback is a stopgap. Drop official Azure SVGs into
 * public/AZURE-ICON/ and set the `icon` paths here — no other code changes needed.
 */

export type Provider = "aws" | "azure" | "gcp";

export type ServiceCategory =
  | "compute"
  | "containers"
  | "serverless"
  | "networking"
  | "database"
  | "storage"
  | "cdn"
  | "dns";

export interface ServiceDefinition {
  /** Stable unique id, used as the node "kind". */
  id: string;
  provider: Provider;
  label: string;
  category: ServiceCategory;
  /** Public URL to the provider SVG, or null to use the Lucide fallback. */
  icon: string | null;
  /** Short one-liner shown in the inspector / tooltips. */
  blurb: string;
}

// URL-encode a /public path so directory spaces survive as valid URLs.
const asset = (p: string) => "/" + p.split("/").map(encodeURIComponent).join("/");

const AWS_ARCH = "AWS-ICONS/Architecture-Service-Icons_04302026";
const AWS_RES = "AWS-ICONS/Resource-Icons_04302026";
const GCP = "GCP-ICON/Unique Icons";

export const CATALOG: ServiceDefinition[] = [
  // ─── AWS (13) ────────────────────────────────────────────────
  {
    id: "aws-vpc",
    provider: "aws",
    label: "VPC",
    category: "networking",
    icon: asset(`${AWS_ARCH}/Arch_Networking-Content-Delivery/48/Arch_Amazon-Virtual-Private-Cloud_48.svg`),
    blurb: "Isolated virtual network for your resources.",
  },
  {
    id: "aws-igw",
    provider: "aws",
    label: "Internet Gateway",
    category: "networking",
    icon: asset(`${AWS_RES}/Res_Networking-Content-Delivery/Res_Amazon-VPC_Internet-Gateway_48.svg`),
    blurb: "Connects a VPC to the public internet.",
  },
  {
    id: "aws-nat",
    provider: "aws",
    label: "NAT Gateway",
    category: "networking",
    icon: asset(`${AWS_RES}/Res_Networking-Content-Delivery/Res_Amazon-VPC_NAT-Gateway_48.svg`),
    blurb: "Outbound internet for private subnets.",
  },
  {
    id: "aws-ec2",
    provider: "aws",
    label: "EC2",
    category: "compute",
    icon: asset(`${AWS_ARCH}/Arch_Compute/48/Arch_Amazon-EC2_48.svg`),
    blurb: "Resizable virtual machine compute.",
  },
  {
    id: "aws-ecs",
    provider: "aws",
    label: "ECS",
    category: "containers",
    icon: asset(`${AWS_ARCH}/Arch_Containers/48/Arch_Amazon-Elastic-Container-Service_48.svg`),
    blurb: "Managed container orchestration.",
  },
  {
    id: "aws-lambda",
    provider: "aws",
    label: "Lambda",
    category: "serverless",
    icon: asset(`${AWS_ARCH}/Arch_Compute/48/Arch_AWS-Lambda_48.svg`),
    blurb: "Run code without provisioning servers.",
  },
  {
    id: "aws-alb",
    provider: "aws",
    label: "ALB",
    category: "networking",
    icon: asset(`${AWS_RES}/Res_Networking-Content-Delivery/Res_Elastic-Load-Balancing_Application-Load-Balancer_48.svg`),
    blurb: "Layer-7 application load balancer.",
  },
  {
    id: "aws-nlb",
    provider: "aws",
    label: "NLB",
    category: "networking",
    icon: asset(`${AWS_RES}/Res_Networking-Content-Delivery/Res_Elastic-Load-Balancing_Network-Load-Balancer_48.svg`),
    blurb: "Layer-4 network load balancer.",
  },
  {
    id: "aws-rds",
    provider: "aws",
    label: "RDS",
    category: "database",
    icon: asset(`${AWS_ARCH}/Arch_Databases/48/Arch_Amazon-RDS_48.svg`),
    blurb: "Managed relational database.",
  },
  {
    id: "aws-dynamodb",
    provider: "aws",
    label: "DynamoDB",
    category: "database",
    icon: asset(`${AWS_ARCH}/Arch_Databases/48/Arch_Amazon-DynamoDB_48.svg`),
    blurb: "Managed NoSQL key-value store.",
  },
  {
    id: "aws-s3",
    provider: "aws",
    label: "S3",
    category: "storage",
    icon: asset(`${AWS_ARCH}/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg`),
    blurb: "Object storage at scale.",
  },
  {
    id: "aws-cloudfront",
    provider: "aws",
    label: "CloudFront",
    category: "cdn",
    icon: asset(`${AWS_ARCH}/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg`),
    blurb: "Global content delivery network.",
  },
  {
    id: "aws-route53",
    provider: "aws",
    label: "Route 53",
    category: "dns",
    icon: asset(`${AWS_ARCH}/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg`),
    blurb: "Scalable DNS and domain routing.",
  },

  // ─── Azure (5) — no provider icons yet, Lucide fallback ───────
  {
    id: "azure-vm",
    provider: "azure",
    label: "Virtual Machine",
    category: "compute",
    icon: null,
    blurb: "On-demand, scalable compute.",
  },
  {
    id: "azure-aks",
    provider: "azure",
    label: "AKS",
    category: "containers",
    icon: null,
    blurb: "Managed Kubernetes service.",
  },
  {
    id: "azure-functions",
    provider: "azure",
    label: "Azure Functions",
    category: "serverless",
    icon: null,
    blurb: "Event-driven serverless compute.",
  },
  {
    id: "azure-sql",
    provider: "azure",
    label: "Azure SQL",
    category: "database",
    icon: null,
    blurb: "Managed relational SQL database.",
  },
  {
    id: "azure-blob",
    provider: "azure",
    label: "Blob Storage",
    category: "storage",
    icon: null,
    blurb: "Massively scalable object storage.",
  },

  // ─── GCP (5) ──────────────────────────────────────────────────
  {
    id: "gcp-compute-engine",
    provider: "gcp",
    label: "Compute Engine",
    category: "compute",
    icon: asset(`${GCP}/Compute Engine/SVG/ComputeEngine-512-color-rgb.svg`),
    blurb: "Configurable virtual machines.",
  },
  {
    id: "gcp-cloud-run",
    provider: "gcp",
    label: "Cloud Run",
    category: "serverless",
    icon: asset(`${GCP}/Cloud Run/SVG/CloudRun-512-color-rgb.svg`),
    blurb: "Serverless containers.",
  },
  {
    id: "gcp-gke",
    provider: "gcp",
    label: "GKE",
    category: "containers",
    icon: asset(`${GCP}/GKE/SVG/GKE-512-color.svg`),
    blurb: "Managed Kubernetes engine.",
  },
  {
    id: "gcp-cloud-sql",
    provider: "gcp",
    label: "Cloud SQL",
    category: "database",
    icon: asset(`${GCP}/Cloud SQL/SVG/CloudSQL-512-color.svg`),
    blurb: "Managed relational database.",
  },
  {
    id: "gcp-cloud-storage",
    provider: "gcp",
    label: "Cloud Storage",
    category: "storage",
    icon: asset(`${GCP}/Cloud Storage/SVG/Cloud_Storage-512-color.svg`),
    blurb: "Unified object storage.",
  },
];

/** All valid node kinds, derived from the catalog. */
export type ServiceId = (typeof CATALOG)[number]["id"];

const BY_ID = new Map(CATALOG.map((s) => [s.id, s]));

export function getService(id: string): ServiceDefinition | undefined {
  return BY_ID.get(id);
}

export const PROVIDER_META: Record<
  Provider,
  { label: string; accentVar: string }
> = {
  aws: { label: "AWS", accentVar: "var(--color-aws)" },
  azure: { label: "Azure", accentVar: "var(--color-azure)" },
  gcp: { label: "GCP", accentVar: "var(--color-gcp)" },
};

/** Filter the catalog by free-text over label, provider, and category (MVP search). */
export function searchCatalog(query: string): ServiceDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG;
  return CATALOG.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.provider.includes(q) ||
      PROVIDER_META[s.provider].label.toLowerCase().includes(q) ||
      s.category.includes(q),
  );
}
