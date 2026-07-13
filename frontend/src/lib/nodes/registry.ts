/**
 * Node Registry — the single source of truth for cloud services the MVP
 * supports on the playground canvas.
 *
 * MVP scope (plan/MVP.md §Node Library):
 *   AWS   × 13 : VPC, InternetGateway, NATGateway, EC2, ECS, Lambda, ALB, NLB,
 *                RDS, DynamoDB, S3, CloudFront, Route53
 *   Azure ×  5 : VM, AKS, Functions, SQL, BlobStorage
 *   GCP   ×  5 : ComputeEngine, CloudRun, GKE, CloudSQL, CloudStorage
 *
 * Icon paths point at the assets already in `public/` — AWS official pack
 * (Architecture Service Icons Q2-2026, `_48.svg`) and the GCP Unique Icons
 * SVG variants. Azure icons are `null` for now (asset pack pending); node
 * components render an initials fallback in the provider accent color.
 */

export type Provider = "aws" | "azure" | "gcp";

export type NodeCategory =
  | "compute"
  | "container"
  | "serverless"
  | "networking"
  | "database"
  | "storage"
  | "cdn"
  | "dns"
  | "load-balancer";

/** Coarse capability tags used by the validation engine (M4). */
export type NodeCapability =
  | "public-endpoint"     // can receive traffic from the internet
  | "private-only"        // must sit behind a load balancer / gateway
  | "layer-7"             // HTTP-aware (ALB, CloudFront, API GW)
  | "layer-4"             // TCP/UDP only (NLB)
  | "stateful"            // holds durable data
  | "stateless"
  | "vpc-scoped"          // requires a containing VPC/VNet
  | "global";             // provider-global (Route53, CloudFront)

export interface NodeDefinition {
  /** Registry key — stable, kebab-case, "provider.slug". */
  id: string;
  provider: Provider;
  /** Short human-friendly label shown on the canvas. */
  label: string;
  /** Full product name — used in tooltips + inspector. */
  fullName: string;
  category: NodeCategory;
  /** Absolute path under `public/`. `null` → render initials fallback. */
  iconPath: string | null;
  /** Accent color for chrome (border, shadow, badge). */
  accent: string;
  capabilities: NodeCapability[];
  /** Free-text summary — powers inspector + AI "explain" (MVP AI is limited). */
  description: string;
  /** Tokens the search bar (MVP.md §Search) also matches on. */
  searchTags: string[];
}

// ── Colors (mirrored from DESIGN_SYSTEM tokens; kept literal because these
//    strings also appear in canvas node components where CSS vars aren't
//    convenient for SVG stroke etc.) ────────────────────────────────────────
const AWS_ORANGE = "#FF9900";
const AZURE_BLUE = "#0078D4";
const GCP_BLUE = "#4285F4";

// ── AWS ────────────────────────────────────────────────────────────────────
const AWS_BASE = "/AWS-ICONS/Architecture-Service-Icons_04302026";
const AWS_RES = "/AWS-ICONS/Resource-Icons_04302026";

const aws: NodeDefinition[] = [
  {
    id: "aws.vpc",
    provider: "aws",
    label: "VPC",
    fullName: "Amazon Virtual Private Cloud",
    category: "networking",
    iconPath: `${AWS_BASE}/Arch_Networking-Content-Delivery/48/Arch_Amazon-Virtual-Private-Cloud_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["vpc-scoped"],
    description:
      "Isolated virtual network that contains subnets, gateways, and workloads.",
    searchTags: ["vpc", "network", "subnet", "cidr"],
  },
  {
    id: "aws.internet-gateway",
    provider: "aws",
    label: "IGW",
    fullName: "Internet Gateway",
    category: "networking",
    iconPath: `${AWS_RES}/Res_Networking-Content-Delivery/Res_Amazon-VPC_Internet-Gateway_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["public-endpoint", "vpc-scoped"],
    description: "Provides internet ingress/egress for a VPC's public subnets.",
    searchTags: ["igw", "internet", "gateway", "ingress"],
  },
  {
    id: "aws.nat-gateway",
    provider: "aws",
    label: "NAT",
    fullName: "NAT Gateway",
    category: "networking",
    iconPath: `${AWS_RES}/Res_Networking-Content-Delivery/Res_Amazon-VPC_NAT-Gateway_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["vpc-scoped"],
    description:
      "Lets private-subnet resources reach the internet without inbound exposure.",
    searchTags: ["nat", "gateway", "egress", "private"],
  },
  {
    id: "aws.ec2",
    provider: "aws",
    label: "EC2",
    fullName: "Amazon EC2",
    category: "compute",
    iconPath: `${AWS_BASE}/Arch_Compute/48/Arch_Amazon-EC2_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Elastic virtual machines. The general-purpose AWS compute unit.",
    searchTags: ["ec2", "compute", "vm", "virtual machine"],
  },
  {
    id: "aws.ecs",
    provider: "aws",
    label: "ECS",
    fullName: "Amazon Elastic Container Service",
    category: "container",
    iconPath: `${AWS_BASE}/Arch_Containers/48/Arch_Amazon-Elastic-Container-Service_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Managed container orchestrator. Runs tasks on EC2 or Fargate.",
    searchTags: ["ecs", "container", "docker", "fargate"],
  },
  {
    id: "aws.lambda",
    provider: "aws",
    label: "Lambda",
    fullName: "AWS Lambda",
    category: "serverless",
    iconPath: `${AWS_BASE}/Arch_Compute/48/Arch_AWS-Lambda_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateless"],
    description: "Serverless functions. Runs code in response to events.",
    searchTags: ["lambda", "serverless", "function", "faas"],
  },
  {
    id: "aws.alb",
    provider: "aws",
    label: "ALB",
    fullName: "Application Load Balancer",
    category: "load-balancer",
    iconPath: `${AWS_BASE}/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["public-endpoint", "layer-7", "vpc-scoped"],
    description:
      "Layer-7 HTTP/HTTPS load balancer. Routes to targets based on rules.",
    searchTags: ["alb", "load balancer", "http", "elb", "layer 7"],
  },
  {
    id: "aws.nlb",
    provider: "aws",
    label: "NLB",
    fullName: "Network Load Balancer",
    category: "load-balancer",
    iconPath: `${AWS_BASE}/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["public-endpoint", "layer-4", "vpc-scoped"],
    description: "Layer-4 TCP/UDP load balancer optimized for extreme performance.",
    searchTags: ["nlb", "load balancer", "tcp", "layer 4"],
  },
  {
    id: "aws.rds",
    provider: "aws",
    label: "RDS",
    fullName: "Amazon RDS",
    category: "database",
    iconPath: `${AWS_BASE}/Arch_Databases/48/Arch_Amazon-RDS_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateful", "vpc-scoped"],
    description:
      "Managed relational database (PostgreSQL, MySQL, MariaDB, Aurora, ...).",
    searchTags: ["rds", "database", "postgres", "mysql", "aurora", "sql"],
  },
  {
    id: "aws.dynamodb",
    provider: "aws",
    label: "DynamoDB",
    fullName: "Amazon DynamoDB",
    category: "database",
    iconPath: `${AWS_BASE}/Arch_Databases/48/Arch_Amazon-DynamoDB_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateful"],
    description: "Managed serverless key-value / document NoSQL database.",
    searchTags: ["dynamodb", "database", "nosql", "key value"],
  },
  {
    id: "aws.s3",
    provider: "aws",
    label: "S3",
    fullName: "Amazon S3",
    category: "storage",
    iconPath: `${AWS_BASE}/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["stateful"],
    description: "Object storage with 11-nines durability. Powers static sites & backups.",
    searchTags: ["s3", "storage", "object", "bucket"],
  },
  {
    id: "aws.cloudfront",
    provider: "aws",
    label: "CloudFront",
    fullName: "Amazon CloudFront",
    category: "cdn",
    iconPath: `${AWS_BASE}/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["public-endpoint", "layer-7", "global"],
    description: "Global CDN. Caches content at 400+ edge locations.",
    searchTags: ["cloudfront", "cdn", "edge", "distribution"],
  },
  {
    id: "aws.route53",
    provider: "aws",
    label: "Route 53",
    fullName: "Amazon Route 53",
    category: "dns",
    iconPath: `${AWS_BASE}/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg`,
    accent: AWS_ORANGE,
    capabilities: ["public-endpoint", "global"],
    description: "Highly available authoritative DNS + health-check routing.",
    searchTags: ["route53", "dns", "domain", "record"],
  },
];

// ── Azure (icons pending; see plan/MVP.md gap analysis) ────────────────────
const azure: NodeDefinition[] = [
  {
    id: "azure.vm",
    provider: "azure",
    label: "VM",
    fullName: "Azure Virtual Machine",
    category: "compute",
    iconPath: null,
    accent: AZURE_BLUE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Managed virtual machines on Microsoft Azure.",
    searchTags: ["vm", "compute", "azure", "virtual machine"],
  },
  {
    id: "azure.aks",
    provider: "azure",
    label: "AKS",
    fullName: "Azure Kubernetes Service",
    category: "container",
    iconPath: null,
    accent: AZURE_BLUE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Managed Kubernetes control-plane. Runs container workloads.",
    searchTags: ["aks", "kubernetes", "k8s", "container"],
  },
  {
    id: "azure.functions",
    provider: "azure",
    label: "Functions",
    fullName: "Azure Functions",
    category: "serverless",
    iconPath: null,
    accent: AZURE_BLUE,
    capabilities: ["stateless"],
    description: "Event-driven serverless functions on Azure.",
    searchTags: ["azure functions", "serverless", "faas"],
  },
  {
    id: "azure.sql",
    provider: "azure",
    label: "SQL",
    fullName: "Azure SQL Database",
    category: "database",
    iconPath: null,
    accent: AZURE_BLUE,
    capabilities: ["stateful", "vpc-scoped"],
    description: "Fully managed relational database (SQL Server engine).",
    searchTags: ["azure sql", "database", "sql server", "mssql"],
  },
  {
    id: "azure.blob",
    provider: "azure",
    label: "Blob Storage",
    fullName: "Azure Blob Storage",
    category: "storage",
    iconPath: null,
    accent: AZURE_BLUE,
    capabilities: ["stateful"],
    description: "Massively scalable object store on Azure.",
    searchTags: ["blob", "storage", "container", "azure storage"],
  },
];

// ── GCP ────────────────────────────────────────────────────────────────────
const GCP_BASE = "/GCP-ICON/Unique Icons";

const gcp: NodeDefinition[] = [
  {
    id: "gcp.compute-engine",
    provider: "gcp",
    label: "Compute Engine",
    fullName: "Google Compute Engine",
    category: "compute",
    iconPath: `${GCP_BASE}/Compute Engine/SVG/ComputeEngine-512-color-rgb.svg`,
    accent: GCP_BLUE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Google Cloud virtual machines. Highly configurable IaaS compute.",
    searchTags: ["gce", "compute engine", "vm"],
  },
  {
    id: "gcp.cloud-run",
    provider: "gcp",
    label: "Cloud Run",
    fullName: "Google Cloud Run",
    category: "serverless",
    iconPath: `${GCP_BASE}/Cloud Run/SVG/CloudRun-512-color-rgb.svg`,
    accent: GCP_BLUE,
    capabilities: ["stateless", "public-endpoint"],
    description: "Serverless containers. Deploy any HTTP workload, scale to zero.",
    searchTags: ["cloud run", "container", "serverless"],
  },
  {
    id: "gcp.gke",
    provider: "gcp",
    label: "GKE",
    fullName: "Google Kubernetes Engine",
    category: "container",
    iconPath: `${GCP_BASE}/GKE/SVG/GKE-512-color.svg`,
    accent: GCP_BLUE,
    capabilities: ["stateless", "vpc-scoped"],
    description: "Managed Kubernetes control plane on Google Cloud.",
    searchTags: ["gke", "kubernetes", "k8s", "container"],
  },
  {
    id: "gcp.cloud-sql",
    provider: "gcp",
    label: "Cloud SQL",
    fullName: "Google Cloud SQL",
    category: "database",
    iconPath: `${GCP_BASE}/Cloud SQL/SVG/CloudSQL-512-color.svg`,
    accent: GCP_BLUE,
    capabilities: ["stateful", "vpc-scoped"],
    description: "Managed PostgreSQL / MySQL / SQL Server on Google Cloud.",
    searchTags: ["cloud sql", "postgres", "mysql", "database"],
  },
  {
    id: "gcp.cloud-storage",
    provider: "gcp",
    label: "Cloud Storage",
    fullName: "Google Cloud Storage",
    category: "storage",
    iconPath: `${GCP_BASE}/Cloud Storage/SVG/Cloud_Storage-512-color.svg`,
    accent: GCP_BLUE,
    capabilities: ["stateful"],
    description: "Object storage. Buckets across multi-region / regional / dual-region.",
    searchTags: ["gcs", "cloud storage", "bucket", "object"],
  },
];

// ── Aggregate & lookups ────────────────────────────────────────────────────
export const NODE_REGISTRY: readonly NodeDefinition[] = [...aws, ...azure, ...gcp];

export const NODE_BY_ID: ReadonlyMap<string, NodeDefinition> = new Map(
  NODE_REGISTRY.map((n) => [n.id, n]),
);

export const NODES_BY_PROVIDER: Record<Provider, NodeDefinition[]> = {
  aws,
  azure,
  gcp,
};

export const PROVIDER_META = {
  aws: { label: "AWS", accent: AWS_ORANGE, count: aws.length },
  azure: { label: "Azure", accent: AZURE_BLUE, count: azure.length },
  gcp: { label: "GCP", accent: GCP_BLUE, count: gcp.length },
} as const;

/** Free-text search matching label, full name, and searchTags. Case-insensitive. */
export function searchNodes(query: string): NodeDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...NODE_REGISTRY];
  return NODE_REGISTRY.filter(
    (n) =>
      n.label.toLowerCase().includes(q) ||
      n.fullName.toLowerCase().includes(q) ||
      n.provider.includes(q) ||
      n.category.includes(q) ||
      n.searchTags.some((t) => t.includes(q)),
  );
}
