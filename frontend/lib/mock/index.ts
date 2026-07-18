// ponytail: single-file mock data, no abstractions

export type Provider = 'aws' | 'azure' | 'gcp' | 'multi'
export type ProjectStatus = 'active' | 'archived' | 'draft'
export type ActivityType = 'created' | 'modified' | 'deployed' | 'shared' | 'validated' | 'exported'
export type ServiceCategory = 'compute' | 'storage' | 'database' | 'networking' | 'serverless' | 'container' | 'ai' | 'security' | 'monitoring' | 'cdn'
export type Complexity = 'low' | 'medium' | 'high'
export type ChangelogType = 'feature' | 'fix' | 'improvement'

export interface Stats {
  totalProjects: number
  totalNodes: number
  totalConnections: number
  aiGenerations: number
  costSaved: number
  activeUsers: number
  uptime: number
}

export interface Project {
  id: string
  name: string
  description: string
  provider: Provider
  nodeCount: number
  edgeCount: number
  lastModified: string
  status: ProjectStatus
  thumbnail: null
  tags: string[]
}

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  projectName: string
  timestamp: string
  user: { name: string; avatar: null }
}

export interface ServiceCatalogItem {
  id: string
  name: string
  provider: Provider
  category: ServiceCategory
  icon: string | null
  description: string
  isPopular: boolean
}

export interface MigrationPair {
  from: { name: string; provider: Provider }
  to: { name: string; provider: Provider }
  complexity: Complexity
  compatibility: number
}

export interface Snapshot {
  id: string
  version: string
  createdAt: string
  nodeCount: number
  changes: number
  description: string
}

export interface PricingPlan {
  name: string
  price: number | 'Custom'
  period: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: null
}

export interface ChangelogEntry {
  version: string
  date: string
  title: string
  description: string
  changes: string[]
  type: ChangelogType
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar: null
}

// ---------------------------------------------------------------------------
// 1. STATS
// ---------------------------------------------------------------------------
export const STATS: Stats = {
  totalProjects: 2847,
  totalNodes: 18432,
  totalConnections: 45231,
  aiGenerations: 12847,
  costSaved: 2340000,
  activeUsers: 8432,
  uptime: 99.97,
}

// ---------------------------------------------------------------------------
// 2. PROJECTS
// ---------------------------------------------------------------------------
export const PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Production API Gateway',
    description: 'High-availability API gateway with rate limiting, OAuth2 authentication, and multi-region failover across 4 AWS regions.',
    provider: 'aws',
    nodeCount: 47,
    edgeCount: 112,
    lastModified: '2026-07-17T14:23:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['production', 'api', 'high-availability', 'multi-region'],
  },
  {
    id: 'proj-002',
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce infrastructure with CDN, serverless checkout, managed Postgres, and Redis caching layer.',
    provider: 'gcp',
    nodeCount: 63,
    edgeCount: 189,
    lastModified: '2026-07-16T09:45:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['e-commerce', 'serverless', 'cdn', 'database'],
  },
  {
    id: 'proj-003',
    name: 'Data Pipeline v3',
    description: 'Real-time streaming data pipeline processing 2M events/sec with Kafka, Spark Structured Streaming, and Delta Lake on S3.',
    provider: 'aws',
    nodeCount: 38,
    edgeCount: 94,
    lastModified: '2026-07-15T18:12:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['data', 'streaming', 'kafka', 'spark', 'etl'],
  },
  {
    id: 'proj-004',
    name: 'ML Training Cluster',
    description: 'GPU-accelerated training cluster with auto-scaling node pools, distributed training orchestration, and model registry integration.',
    provider: 'gcp',
    nodeCount: 24,
    edgeCount: 56,
    lastModified: '2026-07-14T11:30:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['ml', 'gpu', 'training', 'auto-scaling'],
  },
  {
    id: 'proj-005',
    name: 'Multi-Cloud DR Setup',
    description: 'Disaster recovery architecture spanning AWS and Azure with RPO < 15 min, automated failover, and cross-cloud DNS routing.',
    provider: 'multi',
    nodeCount: 82,
    edgeCount: 234,
    lastModified: '2026-07-13T16:05:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['disaster-recovery', 'multi-cloud', 'failover', 'dns'],
  },
  {
    id: 'proj-006',
    name: 'Microservices Migration',
    description: 'Phased migration of monolithic .NET application to 14 containerized microservices on AKS with service mesh and observability.',
    provider: 'azure',
    nodeCount: 56,
    edgeCount: 143,
    lastModified: '2026-07-12T08:50:00Z',
    status: 'draft',
    thumbnail: null,
    tags: ['migration', 'microservices', 'kubernetes', 'service-mesh'],
  },
  {
    id: 'proj-007',
    name: 'Serverless Backend',
    description: 'Event-driven serverless backend with API Gateway, Lambda functions, DynamoDB, SQS queues, and Step Functions workflows.',
    provider: 'aws',
    nodeCount: 31,
    edgeCount: 78,
    lastModified: '2026-07-10T20:15:00Z',
    status: 'active',
    thumbnail: null,
    tags: ['serverless', 'lambda', 'event-driven', 'step-functions'],
  },
  {
    id: 'proj-008',
    name: 'IoT Edge Network',
    description: 'Edge computing network for 10K+ IoT devices with local inference, MQTT broker mesh, and tiered data aggregation to cloud.',
    provider: 'azure',
    nodeCount: 95,
    edgeCount: 310,
    lastModified: '2026-07-08T13:40:00Z',
    status: 'archived',
    thumbnail: null,
    tags: ['iot', 'edge', 'mqtt', 'inference'],
  },
]

// ---------------------------------------------------------------------------
// 3. ACTIVITY
// ---------------------------------------------------------------------------
export const ACTIVITY: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'deployed',
    message: 'Deployed to production (us-east-1, eu-west-1)',
    projectName: 'Production API Gateway',
    timestamp: '2026-07-17T14:23:00Z',
    user: { name: 'Sarah Chen', avatar: null },
  },
  {
    id: 'act-002',
    type: 'modified',
    message: 'Updated auto-scaling policy for checkout service',
    projectName: 'E-Commerce Platform',
    timestamp: '2026-07-17T12:10:00Z',
    user: { name: 'Marcus Johnson', avatar: null },
  },
  {
    id: 'act-003',
    type: 'validated',
    message: 'Infrastructure validation passed (47 resources, 0 warnings)',
    projectName: 'Production API Gateway',
    timestamp: '2026-07-17T11:55:00Z',
    user: { name: 'Sarah Chen', avatar: null },
  },
  {
    id: 'act-004',
    type: 'created',
    message: 'Created new VPC peering connection to DR region',
    projectName: 'Multi-Cloud DR Setup',
    timestamp: '2026-07-17T09:30:00Z',
    user: { name: 'Alex Rivera', avatar: null },
  },
  {
    id: 'act-005',
    type: 'shared',
    message: 'Shared project with Platform Engineering team',
    projectName: 'Microservices Migration',
    timestamp: '2026-07-16T17:45:00Z',
    user: { name: 'Priya Patel', avatar: null },
  },
  {
    id: 'act-006',
    type: 'exported',
    message: 'Exported Terraform configuration (HCL)',
    projectName: 'Serverless Backend',
    timestamp: '2026-07-16T15:20:00Z',
    user: { name: 'James Kim', avatar: null },
  },
  {
    id: 'act-007',
    type: 'modified',
    message: 'Added Spark executor auto-scaling and memory tuning',
    projectName: 'Data Pipeline v3',
    timestamp: '2026-07-16T13:05:00Z',
    user: { name: 'Marcus Johnson', avatar: null },
  },
  {
    id: 'act-008',
    type: 'deployed',
    message: 'Deployed GPU node pool with A100 instances',
    projectName: 'ML Training Cluster',
    timestamp: '2026-07-16T10:40:00Z',
    user: { name: 'Alex Rivera', avatar: null },
  },
  {
    id: 'act-009',
    type: 'validated',
    message: 'Security audit passed — 0 critical, 2 low findings',
    projectName: 'E-Commerce Platform',
    timestamp: '2026-07-15T16:30:00Z',
    user: { name: 'Priya Patel', avatar: null },
  },
  {
    id: 'act-010',
    type: 'created',
    message: 'Initialized edge gateway configuration for APAC region',
    projectName: 'IoT Edge Network',
    timestamp: '2026-07-15T14:15:00Z',
    user: { name: 'James Kim', avatar: null },
  },
  {
    id: 'act-011',
    type: 'exported',
    message: 'Exported architecture diagram as PNG',
    projectName: 'Multi-Cloud DR Setup',
    timestamp: '2026-07-15T11:00:00Z',
    user: { name: 'Sarah Chen', avatar: null },
  },
  {
    id: 'act-012',
    type: 'shared',
    message: 'Published read-only link for stakeholder review',
    projectName: 'Data Pipeline v3',
    timestamp: '2026-07-14T19:50:00Z',
    user: { name: 'Marcus Johnson', avatar: null },
  },
]

// ---------------------------------------------------------------------------
// 4. SERVICES_CATALOG
// ---------------------------------------------------------------------------
export const SERVICES_CATALOG: ServiceCatalogItem[] = [
  // AWS — Compute
  { id: 'aws-ec2', name: 'Amazon EC2', provider: 'aws', category: 'compute', icon: '/AWS-ICONS/Arch_Amazon-EC2/48/Arch_Amazon-EC2_48.svg', description: 'Resizable virtual servers in the cloud with broad instance type selection.', isPopular: true },
  { id: 'aws-lightsail', name: 'Amazon Lightsail', provider: 'aws', category: 'compute', icon: '/AWS-ICONS/Arch_Amazon-Lightsail/48/Arch_Amazon-Lightsail_48.svg', description: 'Simple virtual private servers for straightforward workloads.', isPopular: false },
  // AWS — Storage
  { id: 'aws-s3', name: 'Amazon S3', provider: 'aws', category: 'storage', icon: '/AWS-ICONS/Arch_Amazon-Simple-Storage-Service/48/Arch_Amazon-Simple-Storage-Service_48.svg', description: 'Scalable object storage with 99.999999999% durability.', isPopular: true },
  { id: 'aws-ebs', name: 'Amazon EBS', provider: 'aws', category: 'storage', icon: '/AWS-ICONS/Arch_Amazon-Elastic-Block-Store/48/Arch_Amazon-Elastic-Block-Store_48.svg', description: 'High-performance block storage for EC2 instances.', isPopular: false },
  // AWS — Database
  { id: 'aws-rds', name: 'Amazon RDS', provider: 'aws', category: 'database', icon: '/AWS-ICONS/Arch_Amazon-RDS/48/Arch_Amazon-RDS_48.svg', description: 'Managed relational databases supporting MySQL, PostgreSQL, Oracle, and SQL Server.', isPopular: true },
  { id: 'aws-dynamodb', name: 'Amazon DynamoDB', provider: 'aws', category: 'database', icon: '/AWS-ICONS/Arch_Amazon-DynamoDB/48/Arch_Amazon-DynamoDB_48.svg', description: 'Fully managed NoSQL database with single-digit millisecond latency.', isPopular: true },
  // AWS — Serverless
  { id: 'aws-lambda', name: 'AWS Lambda', provider: 'aws', category: 'serverless', icon: '/AWS-ICONS/Arch_AWS-Lambda/48/Arch_AWS-Lambda_48.svg', description: 'Run code without provisioning servers, pay only for compute time.', isPopular: true },
  { id: 'aws-apigateway', name: 'Amazon API Gateway', provider: 'aws', category: 'serverless', icon: '/AWS-ICONS/Arch_Amazon-API-Gateway/48/Arch_Amazon-API-Gateway_48.svg', description: 'Fully managed API creation, publishing, and maintenance at any scale.', isPopular: true },
  // AWS — Networking
  { id: 'aws-vpc', name: 'Amazon VPC', provider: 'aws', category: 'networking', icon: '/AWS-ICONS/Arch_Amazon-Virtual-Private-Cloud/48/Arch_Amazon-Virtual-Private-Cloud_48.svg', description: 'Isolated virtual network with complete control over IP addressing and routing.', isPopular: true },
  { id: 'aws-cloudfront', name: 'Amazon CloudFront', provider: 'aws', category: 'cdn', icon: '/AWS-ICONS/Arch_Amazon-CloudFront/48/Arch_Amazon-CloudFront_48.svg', description: 'Global CDN with low latency and high transfer speeds.', isPopular: true },
  // AWS — Container
  { id: 'aws-ecs', name: 'Amazon ECS', provider: 'aws', category: 'container', icon: '/AWS-ICONS/Arch_Amazon-Elastic-Container-Service/48/Arch_Amazon-Elastic-Container-Service_48.svg', description: 'Highly scalable container orchestration service.', isPopular: true },
  { id: 'aws-eks', name: 'Amazon EKS', provider: 'aws', category: 'container', icon: '/AWS-ICONS/Arch_Amazon-Elastic-Kubernetes-Service/48/Arch_Amazon-Elastic-Kubernetes-Service_48.svg', description: 'Managed Kubernetes service for running containerized applications.', isPopular: false },
  // AWS — AI
  { id: 'aws-sagemaker', name: 'Amazon SageMaker', provider: 'aws', category: 'ai', icon: '/AWS-ICONS/Arch_Amazon-SageMaker/48/Arch_Amazon-SageMaker_48.svg', description: 'Build, train, and deploy ML models at scale.', isPopular: true },
  // AWS — Security
  { id: 'aws-iam', name: 'AWS IAM', provider: 'aws', category: 'security', icon: '/AWS-ICONS/Arch_AWS-Identity-and-Access-Management/48/Arch_AWS-Identity-and-Access-Management_48.svg', description: 'Fine-grained access control across all AWS services.', isPopular: true },
  // AWS — Monitoring
  { id: 'aws-cloudwatch', name: 'Amazon CloudWatch', provider: 'aws', category: 'monitoring', icon: '/AWS-ICONS/Arch_Amazon-CloudWatch/48/Arch_Amazon-CloudWatch_48.svg', description: 'Observability service for monitoring resources and applications.', isPopular: false },

  // GCP — Compute
  { id: 'gcp-compute', name: 'Compute Engine', provider: 'gcp', category: 'compute', icon: '/GCP-ICON/compute_engine.svg', description: 'Scalable, high-performance VMs running on Google infrastructure.', isPopular: true },
  // GCP — Storage
  { id: 'gcp-gcs', name: 'Cloud Storage', provider: 'gcp', category: 'storage', icon: '/GCP-ICON/cloud_storage.svg', description: 'Unified object storage with global edge-caching.', isPopular: true },
  // GCP — Database
  { id: 'gcp-cloudsql', name: 'Cloud SQL', provider: 'gcp', category: 'database', icon: '/GCP-ICON/cloud_sql.svg', description: 'Fully managed MySQL, PostgreSQL, and SQL Server databases.', isPopular: true },
  { id: 'gcp-firestore', name: 'Firestore', provider: 'gcp', category: 'database', icon: '/GCP-ICON/firestore.svg', description: 'Serverless NoSQL document database with real-time sync.', isPopular: false },
  // GCP — Serverless
  { id: 'gcp-cloudfunctions', name: 'Cloud Functions', provider: 'gcp', category: 'serverless', icon: '/GCP-ICON/cloud_functions.svg', description: 'Event-driven serverless functions for cloud services and HTTP requests.', isPopular: true },
  { id: 'gcp-cloudrun', name: 'Cloud Run', provider: 'gcp', category: 'serverless', icon: '/GCP-ICON/cloud_run.svg', description: 'Fully managed compute for deploying containerized applications.', isPopular: true },
  // GCP — Container
  { id: 'gcp-gke', name: 'Google Kubernetes Engine', provider: 'gcp', category: 'container', icon: '/GCP-ICON/google_kubernetes_engine.svg', description: 'Managed Kubernetes with auto-scaling, auto-upgrade, and auto-repair.', isPopular: true },
  // GCP — AI
  { id: 'gcp-vertexai', name: 'Vertex AI', provider: 'gcp', category: 'ai', icon: '/GCP-ICON/vertex_ai.svg', description: 'Unified ML platform for building, deploying, and scaling AI models.', isPopular: true },
  // GCP — Networking
  { id: 'gcp-vpc', name: 'VPC Network', provider: 'gcp', category: 'networking', icon: '/GCP-ICON/virtual_private_cloud.svg', description: 'Global virtual network spanning all GCP regions.', isPopular: false },
  // GCP — CDN
  { id: 'gcp-cdn', name: 'Cloud CDN', provider: 'gcp', category: 'cdn', icon: '/GCP-ICON/cloud_cdn.svg', description: 'Low-latency content delivery powered by Google\'s global edge network.', isPopular: false },
  // GCP — Monitoring
  { id: 'gcp-monitoring', name: 'Cloud Monitoring', provider: 'gcp', category: 'monitoring', icon: '/GCP-ICON/cloud_monitoring.svg', description: 'Full-stack monitoring for applications and infrastructure.', isPopular: false },

  // Azure — Compute
  { id: 'azure-vm', name: 'Azure Virtual Machines', provider: 'azure', category: 'compute', icon: null, description: 'On-demand, scalable computing resources with flexible VM sizes.', isPopular: true },
  // Azure — Storage
  { id: 'azure-blob', name: 'Azure Blob Storage', provider: 'azure', category: 'storage', icon: null, description: 'Massively scalable object storage for unstructured data.', isPopular: true },
  // Azure — Database
  { id: 'azure-cosmosdb', name: 'Azure Cosmos DB', provider: 'azure', category: 'database', icon: null, description: 'Globally distributed, multi-model database with single-digit ms latency.', isPopular: true },
  { id: 'azure-sqldb', name: 'Azure SQL Database', provider: 'azure', category: 'database', icon: null, description: 'Intelligent, scalable managed SQL database service.', isPopular: false },
  // Azure — Serverless
  { id: 'azure-functions', name: 'Azure Functions', provider: 'azure', category: 'serverless', icon: null, description: 'Event-driven serverless compute with flexible triggers and bindings.', isPopular: true },
  // Azure — Container
  { id: 'azure-aks', name: 'Azure Kubernetes Service', provider: 'azure', category: 'container', icon: null, description: 'Managed Kubernetes with integrated CI/CD and enterprise-grade security.', isPopular: true },
  // Azure — AI
  { id: 'azure-openai', name: 'Azure OpenAI Service', provider: 'azure', category: 'ai', icon: null, description: 'Enterprise-grade access to GPT-4, DALL-E, and Whisper models.', isPopular: true },
  // Azure — Security
  { id: 'azure-ad', name: 'Microsoft Entra ID', provider: 'azure', category: 'security', icon: null, description: 'Cloud identity and access management for securing resources.', isPopular: false },
  // Azure — Networking
  { id: 'azure-vnet', name: 'Azure Virtual Network', provider: 'azure', category: 'networking', icon: null, description: 'Private network in the cloud with advanced security and isolation.', isPopular: false },
]

// ---------------------------------------------------------------------------
// 5. MIGRATION_MAP
// ---------------------------------------------------------------------------
export const MIGRATION_MAP: MigrationPair[] = [
  { from: { name: 'Amazon EC2', provider: 'aws' }, to: { name: 'Compute Engine', provider: 'gcp' }, complexity: 'medium', compatibility: 92 },
  { from: { name: 'AWS Lambda', provider: 'aws' }, to: { name: 'Cloud Functions', provider: 'gcp' }, complexity: 'low', compatibility: 88 },
  { from: { name: 'Amazon S3', provider: 'aws' }, to: { name: 'Cloud Storage', provider: 'gcp' }, complexity: 'low', compatibility: 95 },
  { from: { name: 'Amazon RDS', provider: 'aws' }, to: { name: 'Cloud SQL', provider: 'gcp' }, complexity: 'medium', compatibility: 85 },
  { from: { name: 'Amazon DynamoDB', provider: 'aws' }, to: { name: 'Firestore', provider: 'gcp' }, complexity: 'high', compatibility: 62 },
  { from: { name: 'Amazon EKS', provider: 'aws' }, to: { name: 'Google Kubernetes Engine', provider: 'gcp' }, complexity: 'medium', compatibility: 90 },
  { from: { name: 'Amazon EC2', provider: 'aws' }, to: { name: 'Azure Virtual Machines', provider: 'azure' }, complexity: 'low', compatibility: 94 },
  { from: { name: 'AWS Lambda', provider: 'aws' }, to: { name: 'Azure Functions', provider: 'azure' }, complexity: 'medium', compatibility: 80 },
  { from: { name: 'Amazon S3', provider: 'aws' }, to: { name: 'Azure Blob Storage', provider: 'azure' }, complexity: 'low', compatibility: 91 },
  { from: { name: 'Amazon ECS', provider: 'aws' }, to: { name: 'Azure Kubernetes Service', provider: 'azure' }, complexity: 'high', compatibility: 70 },
]

// ---------------------------------------------------------------------------
// 6. SNAPSHOTS
// ---------------------------------------------------------------------------
export const SNAPSHOTS: Snapshot[] = [
  { id: 'snap-001', version: 'v3.4.1', createdAt: '2026-07-17T14:00:00Z', nodeCount: 47, changes: 3, description: 'Added CloudFront distribution and WAF rules' },
  { id: 'snap-002', version: 'v3.4.0', createdAt: '2026-07-15T10:30:00Z', nodeCount: 44, changes: 8, description: 'Multi-region failover with Route 53 health checks' },
  { id: 'snap-003', version: 'v3.3.0', createdAt: '2026-07-12T16:45:00Z', nodeCount: 38, changes: 12, description: 'Introduced API Gateway throttling and usage plans' },
  { id: 'snap-004', version: 'v3.2.0', createdAt: '2026-07-08T09:20:00Z', nodeCount: 32, changes: 6, description: 'Database read replicas and connection pooling' },
  { id: 'snap-005', version: 'v3.1.0', createdAt: '2026-07-03T14:10:00Z', nodeCount: 28, changes: 15, description: 'VPC redesign with public/private subnet separation' },
  { id: 'snap-006', version: 'v3.0.0', createdAt: '2026-06-28T11:00:00Z', nodeCount: 22, changes: 22, description: 'Initial production architecture — major version bump' },
]

// ---------------------------------------------------------------------------
// 7. PRICING_PLANS
// ---------------------------------------------------------------------------
export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for exploring BlackCloud and personal projects.',
    features: [
      'Up to 3 projects',
      '50 nodes per project',
      'AWS, Azure, and GCP support',
      'Basic IaC export (Terraform)',
      'Community support',
    ],
    highlighted: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'For individual engineers building production infrastructure.',
    features: [
      'Unlimited projects',
      'Unlimited nodes',
      'AI-powered architecture suggestions',
      'Multi-cloud migration maps',
      'Time-machine versioning (30 days)',
      'Export to Terraform, Pulumi, CloudFormation',
      'Priority email support',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Team',
    price: 79,
    period: 'month per seat',
    description: 'Collaborate on infrastructure with your engineering team.',
    features: [
      'Everything in Pro',
      'Real-time collaborative editing',
      'Role-based access control',
      'Shared template library',
      'Time-machine versioning (1 year)',
      'CI/CD pipeline integration',
      'Slack and Teams notifications',
      'Dedicated support channel',
    ],
    highlighted: false,
    cta: 'Start Team Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'year',
    description: 'For organizations with advanced security, compliance, and scale needs.',
    features: [
      'Everything in Team',
      'SSO / SAML authentication',
      'SOC 2 and HIPAA compliance',
      'Unlimited version history',
      'Custom policy enforcement',
      'Dedicated infrastructure',
      'On-premises deployment option',
      '24/7 phone and Slack support',
      'Dedicated solutions architect',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
]

// ---------------------------------------------------------------------------
// 8. TEAM_MEMBERS
// ---------------------------------------------------------------------------
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Akash Singh',
    role: 'Founder & CEO',
    bio: 'Former AWS Solutions Architect with 10 years in cloud infrastructure. Built BlackCloud to make infrastructure design accessible to every engineer.',
    avatar: null,
  },
  {
    name: 'Elena Vasquez',
    role: 'CTO',
    bio: 'Ex-Google Cloud platform engineer. Led the team that built the AI-powered architecture recommendation engine and multi-cloud abstraction layer.',
    avatar: null,
  },
  {
    name: 'David Park',
    role: 'Head of Product',
    bio: 'Product leader who previously shipped developer tools at Vercel and Netlify. Obsessed with making cloud complexity disappear behind intuitive interfaces.',
    avatar: null,
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Lead Engineer',
    bio: 'Full-stack engineer specializing in real-time collaboration systems and graph databases. Built the visual infrastructure canvas from scratch.',
    avatar: null,
  },
  {
    name: 'Ryan Okonkwo',
    role: 'Head of Design',
    bio: 'Design systems expert from Figma. Created BlackCloud\'s design language to make complex infrastructure diagrams beautiful and instantly readable.',
    avatar: null,
  },
]

// ---------------------------------------------------------------------------
// 9. CHANGELOGS
// ---------------------------------------------------------------------------
export const CHANGELOGS: ChangelogEntry[] = [
  {
    version: '2.8.0',
    date: '2026-07-15',
    title: 'AI Architecture Advisor',
    description: 'Introducing intelligent architecture recommendations powered by analysis of 100K+ production deployments.',
    changes: [
      'AI-powered "Suggest Architecture" for any workload description',
      'Cost optimization recommendations with estimated monthly savings',
      'Security posture scoring with remediation steps',
      'One-click application of AI suggestions to canvas',
    ],
    type: 'feature',
  },
  {
    version: '2.7.2',
    date: '2026-07-10',
    title: 'Canvas Performance Boost',
    description: 'Major rendering performance improvements for large infrastructure graphs.',
    changes: [
      'Fixed canvas lag on projects with 200+ nodes',
      'Reduced initial load time by 60% for complex diagrams',
      'Fixed edge routing overlap on dense graphs',
    ],
    type: 'fix',
  },
  {
    version: '2.7.0',
    date: '2026-07-03',
    title: 'Multi-Cloud Migration Maps',
    description: 'Visualize service equivalents and migration paths across AWS, Azure, and GCP.',
    changes: [
      'Interactive migration map showing service compatibility scores',
      'Automated migration plan generation with step-by-step guidance',
      'Side-by-side cost comparison between cloud providers',
      'Migration complexity assessment for each service pair',
    ],
    type: 'feature',
  },
  {
    version: '2.6.1',
    date: '2026-06-25',
    title: 'Improved Terraform Export',
    description: 'Better Terraform HCL output with module support and state management.',
    changes: [
      'Export now generates proper Terraform modules instead of flat configs',
      'Added remote state backend configuration',
      'Variable extraction for environment-specific values',
    ],
    type: 'improvement',
  },
  {
    version: '2.6.0',
    date: '2026-06-18',
    title: 'Time Machine',
    description: 'Full version history with visual diffs for your infrastructure designs.',
    changes: [
      'Snapshot any version of your infrastructure design',
      'Visual diff showing added, removed, and modified resources',
      'One-click restore to any previous version',
      'Branch and merge for experimental changes',
    ],
    type: 'feature',
  },
  {
    version: '2.5.3',
    date: '2026-06-12',
    title: 'Collaboration Fixes',
    description: 'Resolved synchronization issues in real-time collaborative editing.',
    changes: [
      'Fixed cursor position desync in multi-user sessions',
      'Resolved conflict resolution edge case when two users edit the same node',
      'Improved presence indicators for offline/online transitions',
    ],
    type: 'fix',
  },
  {
    version: '2.5.0',
    date: '2026-06-05',
    title: 'Real-Time Collaboration',
    description: 'Work on infrastructure designs together in real-time with your team.',
    changes: [
      'Live cursors showing team member positions on canvas',
      'Real-time node and edge synchronization via CRDT',
      'In-canvas comments and annotations',
      'Presence indicators and activity feed',
    ],
    type: 'feature',
  },
  {
    version: '2.4.0',
    date: '2026-05-28',
    title: 'GCP Service Catalog Expansion',
    description: 'Added 40 new Google Cloud services and improved icon rendering.',
    changes: [
      'Added Cloud Run, Vertex AI, Firestore, and 37 more GCP services',
      'Improved service search with category filtering',
      'High-resolution SVG icons for all supported services',
    ],
    type: 'improvement',
  },
]

// ---------------------------------------------------------------------------
// 10. FAQ_ITEMS
// ---------------------------------------------------------------------------
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is BlackCloud?',
    answer: 'BlackCloud is a visual infrastructure design platform that lets you drag-and-drop cloud services onto a canvas, connect them, and export production-ready Infrastructure as Code. It supports AWS, Azure, and GCP with AI-powered architecture recommendations.',
  },
  {
    question: 'Which cloud providers are supported?',
    answer: 'BlackCloud supports Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). You can also create multi-cloud architectures that span two or more providers in a single project.',
  },
  {
    question: 'What IaC formats can I export to?',
    answer: 'You can export your infrastructure designs to Terraform (HCL), AWS CloudFormation (YAML/JSON), Pulumi (TypeScript), and Azure Bicep. Each export includes proper module structure, variables, and backend configuration.',
  },
  {
    question: 'How does the AI architecture advisor work?',
    answer: 'The AI advisor analyzes your workload description and current infrastructure, then recommends optimal architectures based on patterns from over 100,000 production deployments. It considers cost, performance, security, and reliability trade-offs.',
  },
  {
    question: 'Is my infrastructure data secure?',
    answer: 'Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II compliant, and Enterprise plans include HIPAA compliance. Your designs never contain actual credentials or secrets — only resource topology.',
  },
  {
    question: 'Can I collaborate with my team in real-time?',
    answer: 'Yes, Team and Enterprise plans include real-time collaborative editing. Multiple team members can work on the same infrastructure canvas simultaneously with live cursors, presence indicators, and conflict-free synchronization.',
  },
  {
    question: 'What is the Time Machine feature?',
    answer: 'Time Machine lets you snapshot any version of your infrastructure design and restore it later. You can visually diff two versions to see exactly what changed — which resources were added, removed, or modified — and roll back with one click.',
  },
  {
    question: 'Do you offer a free tier?',
    answer: 'Yes! The Free plan includes up to 3 projects with 50 nodes each, support for all three cloud providers, basic Terraform export, and access to the community forum. No credit card required.',
  },
]

// ---------------------------------------------------------------------------
// 11. TESTIMONIALS
// ---------------------------------------------------------------------------
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'BlackCloud cut our infrastructure design time from days to hours. The AI suggestions alone saved us from three costly architectural mistakes.',
    author: 'Jennifer Wu',
    role: 'VP of Engineering',
    company: 'Streamline Analytics',
    avatar: null,
  },
  {
    quote: 'We migrated 140 microservices from AWS to a multi-cloud setup. BlackCloud\'s migration maps made it possible to plan the entire thing visually before writing a single line of Terraform.',
    author: 'Carlos Mendez',
    role: 'Principal DevOps Engineer',
    company: 'FinLedger',
    avatar: null,
  },
  {
    quote: 'As a startup CTO, I don\'t have a dedicated platform team. BlackCloud is my platform team — it gives me production-grade architecture without the headcount.',
    author: 'Amara Osei',
    role: 'CTO & Co-Founder',
    company: 'NovaBuild',
    avatar: null,
  },
  {
    quote: 'The real-time collaboration feature is a game-changer. Our infrastructure reviews went from async Confluence docs to live collaborative sessions on the canvas.',
    author: 'Thomas Eriksson',
    role: 'Head of Platform Engineering',
    company: 'Meridian Health',
    avatar: null,
  },
  {
    quote: 'We use BlackCloud to onboard every new engineer. Seeing the entire infrastructure visually — with real connections and data flows — beats reading 200 pages of wiki docs.',
    author: 'Riya Sharma',
    role: 'Engineering Manager',
    company: 'DataWeave',
    avatar: null,
  },
  {
    quote: 'The Time Machine feature saved us during an incident. We could instantly see what changed in our infrastructure between two deploys and rolled back in seconds.',
    author: 'Michael Torres',
    role: 'SRE Lead',
    company: 'Cosmo Logistics',
    avatar: null,
  },
]
