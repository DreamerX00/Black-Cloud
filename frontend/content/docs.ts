export type DocPage = {
  slug: string;
  title: string;
  section: string;
  order: number;
  body: string[];
};

const DOCS: DocPage[] = [
  {
    slug: "getting-started",
    section: "Start here",
    order: 1,
    title: "Getting started",
    body: [
      "Sign up at /signup. No credit card. First project is unlimited.",
      "The onboarding tour lands you in a Cloud Playground pre-populated with a Route53 → CloudFront → ALB → ECS → RDS starter architecture.",
      "Ninety seconds from signup to your first Health Score.",
    ],
  },
  {
    slug: "quickstart-aws",
    section: "Start here",
    order: 2,
    title: "AWS quickstart",
    body: [
      "Drag AWS services from the left drawer. Any provider-approved service icon works — we ship the full AWS icon library.",
      "Try: VPC · Subnet · EC2 · ALB · RDS.",
      "Right-click a node to configure. Connect two nodes by dragging from the port on the right side.",
    ],
  },
  {
    slug: "quickstart-multi-cloud",
    section: "Start here",
    order: 3,
    title: "Multi-cloud in ten minutes",
    body: [
      "Mix providers freely — an AWS VPC connecting to a GCP Cloud SQL is a first-class citizen.",
      "The validation engine understands cross-cloud edges: VPN, Direct Connect, Interconnect are inferred where needed.",
    ],
  },
  {
    slug: "canvas-shortcuts",
    section: "Playground",
    order: 4,
    title: "Keyboard shortcuts",
    body: [
      "⌘K — command palette; ⌘Z / ⇧⌘Z — undo / redo; Space + drag — pan; ⌘F — search node; L — toggle traffic; G — toggle grid; V — validation panel.",
    ],
  },
  {
    slug: "validation-rules",
    section: "Playground",
    order: 5,
    title: "How validation works",
    body: [
      "BlackCloud ships with ~180 hand-authored rules covering the most common architecture mistakes.",
      "Every rule has: a name, a fixture example, a suggested fix. Ambiguous edges show yellow, hard-invalid edges show red with a one-line explanation.",
    ],
  },
  {
    slug: "ai-architect-usage",
    section: "AI Architect",
    order: 6,
    title: "Prompting the Council",
    body: [
      "Be specific about scale, region, compliance, and budget. Every constraint tightens the Council's proposals.",
      "Example: \"HIPAA-compliant patient portal, 30k concurrent users, us-east and eu-west, hard budget $18k/mo, RTO under 15 min.\"",
      "The five agents draft independently, cross-examine, then hand you a single recommendation with the disagreement log attached.",
    ],
  },
  {
    slug: "cli",
    section: "CLI",
    order: 7,
    title: "BlackCloud CLI",
    body: [
      "Install: `curl -fsSL https://blackcloud.dev/cli | sh`",
      "Auth: `bc login` opens a browser to your workspace.",
      "Push a Terraform project: `bc import ./terraform`. Emit a diagram: `bc export ./project --format png`.",
    ],
  },
  {
    slug: "api-graph",
    section: "API",
    order: 8,
    title: "Graph API reference",
    body: [
      "Every graph is queryable via GraphQL at `https://api.blackcloud.dev/graphql`.",
      "Rate limit: 60 requests / minute on Solo, 600 / minute on Pro, unlimited on Team+.",
    ],
  },
  {
    slug: "security",
    section: "Trust",
    order: 9,
    title: "Security & compliance",
    body: [
      "SOC2 Type II. Least-privilege by default. Live Twin ships read-only first.",
      "Data residency: US-East, EU-West, AP-South regions. Choose at org creation.",
      "Encryption: TLS 1.3 in transit; AES-256 at rest; per-org keys on Enterprise.",
    ],
  },
  {
    slug: "importing-git-history",
    section: "Migration",
    order: 10,
    title: "Importing git history",
    body: [
      "Point `bc replay` at a git repository containing Terraform history. Each commit becomes a Time Machine snapshot.",
      "Rationale is inferred from commit messages via the Why Engine; you'll be prompted to confirm before it's saved.",
    ],
  },
];

export function getAllDocs() {
  return DOCS.slice().sort((a, b) => a.order - b.order);
}

export function getDoc(slug: string) {
  return DOCS.find(d => d.slug === slug);
}

export function getDocSlugs() {
  return DOCS.map(d => d.slug);
}

export function getDocSections() {
  const sections: Record<string, DocPage[]> = {};
  for (const d of getAllDocs()) {
    (sections[d.section] ??= []).push(d);
  }
  return sections;
}
