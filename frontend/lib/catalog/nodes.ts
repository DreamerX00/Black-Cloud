export type Provider = "aws" | "azure" | "gcp";

export interface Service {
  id: string;
  name: string;
  provider: Provider;
  blurb: string;
}

export const PROVIDER_META: Record<Provider, { label: string }> = {
  aws: { label: "AWS" },
  azure: { label: "Azure" },
  gcp: { label: "Google Cloud" },
};

export const CATALOG: Service[] = [
  { id: "ec2", name: "Compute", provider: "aws", blurb: "Elastic virtual machines that scale on demand." },
  { id: "s3", name: "Object Storage", provider: "aws", blurb: "Durable, infinitely scalable object store." },
  { id: "lambda", name: "Functions", provider: "aws", blurb: "Run code without provisioning servers." },
  { id: "rds", name: "Managed SQL", provider: "aws", blurb: "Managed relational databases, six engines." },
  { id: "dynamodb", name: "NoSQL", provider: "aws", blurb: "Single-digit-ms key-value at any scale." },
  { id: "eks", name: "Kubernetes", provider: "aws", blurb: "Managed control plane for containers." },
  { id: "sqs", name: "Queues", provider: "aws", blurb: "Decoupled, durable message queues." },
  { id: "cloudfront", name: "CDN", provider: "aws", blurb: "Low-latency global content delivery." },
  { id: "vm", name: "Virtual Machines", provider: "azure", blurb: "On-demand Windows and Linux compute." },
  { id: "blob", name: "Blob Storage", provider: "azure", blurb: "Massively scalable object storage." },
  { id: "aci", name: "Containers", provider: "azure", blurb: "Serverless containers, per-second billing." },
  { id: "cosmos", name: "Cosmos DB", provider: "azure", blurb: "Globally distributed multi-model database." },
  { id: "functions", name: "Functions", provider: "azure", blurb: "Event-driven serverless compute." },
  { id: "aks", name: "Kubernetes", provider: "azure", blurb: "Managed Kubernetes with autoscaling." },
  { id: "servicebus", name: "Service Bus", provider: "azure", blurb: "Enterprise messaging with topics." },
  { id: "cdn", name: "CDN", provider: "azure", blurb: "Cache content at the network edge." },
  { id: "gce", name: "Compute Engine", provider: "gcp", blurb: "High-performance configurable VMs." },
  { id: "gcs", name: "Cloud Storage", provider: "gcp", blurb: "Unified object storage, any class." },
  { id: "run", name: "Cloud Run", provider: "gcp", blurb: "Serverless containers that scale to zero." },
  { id: "spanner", name: "Spanner", provider: "gcp", blurb: "Horizontally scalable, strongly consistent SQL." },
  { id: "bigquery", name: "BigQuery", provider: "gcp", blurb: "Serverless petabyte-scale analytics." },
  { id: "gke", name: "GKE", provider: "gcp", blurb: "The Kubernetes platform, fully managed." },
  { id: "pubsub", name: "Pub/Sub", provider: "gcp", blurb: "Global real-time messaging bus." },
];
