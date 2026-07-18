/** Catalog of cloud services available in the Playground node drawer. */

export type Provider = "aws" | "azure" | "gcp";

export type NodeSpec = {
  id: string;
  provider: Provider;
  category: "compute" | "network" | "storage" | "data" | "ai" | "security" | "edge";
  label: string;
  short: string;
  description: string;
  color: string;
};

export const CATALOG: NodeSpec[] = [
  // AWS
  { id: "aws-route53", provider: "aws", category: "edge", label: "Route 53", short: "R53", description: "Managed DNS + health-checked routing.", color: "#8b5cf6" },
  { id: "aws-cloudfront", provider: "aws", category: "edge", label: "CloudFront", short: "CF", description: "Global CDN at the edge.", color: "#38bdf8" },
  { id: "aws-alb", provider: "aws", category: "network", label: "ALB", short: "ALB", description: "Layer-7 load balancer.", color: "#ff9900" },
  { id: "aws-nlb", provider: "aws", category: "network", label: "NLB", short: "NLB", description: "Layer-4 load balancer.", color: "#ff9900" },
  { id: "aws-vpc", provider: "aws", category: "network", label: "VPC", short: "VPC", description: "Isolated virtual network.", color: "#ff9900" },
  { id: "aws-nat", provider: "aws", category: "network", label: "NAT Gateway", short: "NAT", description: "Egress for private subnets.", color: "#ff9900" },
  { id: "aws-igw", provider: "aws", category: "network", label: "Internet Gateway", short: "IGW", description: "Ingress to public subnets.", color: "#ff9900" },
  { id: "aws-ec2", provider: "aws", category: "compute", label: "EC2", short: "EC2", description: "Virtual machines.", color: "#22c55e" },
  { id: "aws-ecs", provider: "aws", category: "compute", label: "ECS", short: "ECS", description: "Managed containers.", color: "#22c55e" },
  { id: "aws-eks", provider: "aws", category: "compute", label: "EKS", short: "EKS", description: "Managed Kubernetes.", color: "#22c55e" },
  { id: "aws-lambda", provider: "aws", category: "compute", label: "Lambda", short: "λ", description: "Serverless functions.", color: "#22c55e" },
  { id: "aws-rds", provider: "aws", category: "data", label: "RDS", short: "RDS", description: "Managed relational database.", color: "#ef4444" },
  { id: "aws-dynamo", provider: "aws", category: "data", label: "DynamoDB", short: "DDB", description: "Managed NoSQL.", color: "#ef4444" },
  { id: "aws-s3", provider: "aws", category: "storage", label: "S3", short: "S3", description: "Object storage.", color: "#f59e0b" },
  { id: "aws-sqs", provider: "aws", category: "network", label: "SQS", short: "SQS", description: "Message queue.", color: "#8b5cf6" },
  { id: "aws-sns", provider: "aws", category: "network", label: "SNS", short: "SNS", description: "Pub/sub topics.", color: "#8b5cf6" },
  { id: "aws-bedrock", provider: "aws", category: "ai", label: "Bedrock", short: "BR", description: "Managed foundation models.", color: "#8b5cf6" },
  { id: "aws-iam", provider: "aws", category: "security", label: "IAM", short: "IAM", description: "Identity & access.", color: "#38bdf8" },

  // Azure
  { id: "az-vm", provider: "azure", category: "compute", label: "Virtual Machine", short: "VM", description: "Managed VMs.", color: "#22c55e" },
  { id: "az-aks", provider: "azure", category: "compute", label: "AKS", short: "AKS", description: "Managed Kubernetes.", color: "#22c55e" },
  { id: "az-fn", provider: "azure", category: "compute", label: "Functions", short: "λ", description: "Serverless functions.", color: "#22c55e" },
  { id: "az-app", provider: "azure", category: "compute", label: "App Service", short: "APP", description: "Managed web apps.", color: "#22c55e" },
  { id: "az-sql", provider: "azure", category: "data", label: "Azure SQL", short: "SQL", description: "Managed SQL database.", color: "#ef4444" },
  { id: "az-cosmos", provider: "azure", category: "data", label: "Cosmos DB", short: "COS", description: "Globally distributed NoSQL.", color: "#ef4444" },
  { id: "az-blob", provider: "azure", category: "storage", label: "Blob Storage", short: "BLB", description: "Object storage.", color: "#f59e0b" },
  { id: "az-front", provider: "azure", category: "edge", label: "Front Door", short: "FD", description: "Global HTTP edge.", color: "#38bdf8" },
  { id: "az-vnet", provider: "azure", category: "network", label: "Virtual Network", short: "VNET", description: "Isolated network.", color: "#0078d4" },
  { id: "az-lb", provider: "azure", category: "network", label: "Load Balancer", short: "LB", description: "Layer-4 load balancer.", color: "#0078d4" },
  { id: "az-openai", provider: "azure", category: "ai", label: "Azure OpenAI", short: "AI", description: "Managed OpenAI models.", color: "#8b5cf6" },

  // GCP
  { id: "gcp-run", provider: "gcp", category: "compute", label: "Cloud Run", short: "RUN", description: "Managed serverless containers.", color: "#22c55e" },
  { id: "gcp-gke", provider: "gcp", category: "compute", label: "GKE", short: "GKE", description: "Managed Kubernetes.", color: "#22c55e" },
  { id: "gcp-compute", provider: "gcp", category: "compute", label: "Compute Engine", short: "CE", description: "Virtual machines.", color: "#22c55e" },
  { id: "gcp-fn", provider: "gcp", category: "compute", label: "Cloud Functions", short: "λ", description: "Serverless functions.", color: "#22c55e" },
  { id: "gcp-sql", provider: "gcp", category: "data", label: "Cloud SQL", short: "SQL", description: "Managed relational database.", color: "#ef4444" },
  { id: "gcp-firestore", provider: "gcp", category: "data", label: "Firestore", short: "FS", description: "Serverless document DB.", color: "#ef4444" },
  { id: "gcp-storage", provider: "gcp", category: "storage", label: "Cloud Storage", short: "GCS", description: "Object storage.", color: "#f59e0b" },
  { id: "gcp-cdn", provider: "gcp", category: "edge", label: "Cloud CDN", short: "CDN", description: "Global content delivery.", color: "#38bdf8" },
  { id: "gcp-lb", provider: "gcp", category: "network", label: "Cloud Load Balancing", short: "LB", description: "Global load balancer.", color: "#4285f4" },
  { id: "gcp-pubsub", provider: "gcp", category: "network", label: "Pub/Sub", short: "PS", description: "Messaging.", color: "#8b5cf6" },
  { id: "gcp-vertex", provider: "gcp", category: "ai", label: "Vertex AI", short: "VXA", description: "Managed AI platform.", color: "#8b5cf6" },
];

export function catalogByProvider(provider: Provider) {
  return CATALOG.filter(c => c.provider === provider);
}

export function catalogByCategory() {
  const by: Record<string, NodeSpec[]> = {};
  for (const c of CATALOG) (by[c.category] ??= []).push(c);
  return by;
}
