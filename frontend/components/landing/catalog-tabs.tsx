"use client";

import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { cn } from "@/lib/utils";

type Service = { id: string; label: string; category: string };

const CATALOG: Record<string, Service[]> = {
  aws: [
    { id: "aws-vpc", label: "VPC", category: "networking" },
    { id: "aws-igw", label: "Internet Gateway", category: "networking" },
    { id: "aws-nat", label: "NAT Gateway", category: "networking" },
    { id: "aws-ec2", label: "EC2", category: "compute" },
    { id: "aws-ecs", label: "ECS", category: "containers" },
    { id: "aws-lambda", label: "Lambda", category: "serverless" },
    { id: "aws-alb", label: "ALB", category: "networking" },
    { id: "aws-nlb", label: "NLB", category: "networking" },
    { id: "aws-rds", label: "RDS", category: "database" },
    { id: "aws-dynamodb", label: "DynamoDB", category: "database" },
    { id: "aws-s3", label: "S3", category: "storage" },
    { id: "aws-cloudfront", label: "CloudFront", category: "cdn" },
    { id: "aws-route53", label: "Route 53", category: "dns" },
  ],
  azure: [
    { id: "azure-vm", label: "Virtual Machine", category: "compute" },
    { id: "azure-aks", label: "AKS", category: "containers" },
    { id: "azure-functions", label: "Azure Functions", category: "serverless" },
    { id: "azure-sql", label: "Azure SQL", category: "database" },
    { id: "azure-blob", label: "Blob Storage", category: "storage" },
  ],
  gcp: [
    { id: "gcp-compute-engine", label: "Compute Engine", category: "compute" },
    { id: "gcp-cloud-run", label: "Cloud Run", category: "serverless" },
    { id: "gcp-gke", label: "GKE", category: "containers" },
    { id: "gcp-cloud-sql", label: "Cloud SQL", category: "database" },
    { id: "gcp-cloud-storage", label: "Cloud Storage", category: "storage" },
  ],
};

const PROVIDERS = [
  { key: "aws", label: "AWS", accent: "text-aws" },
  { key: "azure", label: "Azure", accent: "text-azure" },
  { key: "gcp", label: "GCP", accent: "text-gcp" },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function CatalogTabs() {
  return (
    <section id="catalog" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mb-12 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">The node library</p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">23 services, ready to drag.</h2>
      </motion.div>

      <Tabs defaultValue="aws" className="w-full">
        <TabsList className="mx-auto mb-10 flex w-fit">
          {PROVIDERS.map((p) => (
            <TabsTrigger key={p.key} value={p.key}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PROVIDERS.map((p) => (
          <TabsContent key={p.key} value={p.key}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {CATALOG[p.key].map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                >
                  <Card className="group flex flex-row items-center gap-3 p-4 transition-transform duration-300 hover:-translate-y-1 hover:border-border-strong">
                    <ProviderIcon serviceId={svc.id} size={32} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate text-sm font-medium text-fg">{svc.label}</span>
                      <Badge variant="outline" className={cn("w-fit font-mono text-[10px]", p.accent)}>
                        {svc.category}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
