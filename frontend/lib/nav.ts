// ponytail: icon fields are string literals, not imports — resolved at render site

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  children?: NavItem[];
}

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const MARKETING_NAV: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    children: [
      { label: "Playground", href: "/product/playground", description: "Interactive cloud infrastructure sandbox" },
      { label: "AI Architect", href: "/product/ai-architect", description: "AI-powered infrastructure design" },
      { label: "Migration Ground", href: "/product/migration", description: "Seamless cloud migration toolkit" },
      { label: "Failure Simulator", href: "/product/simulator", description: "Chaos engineering and resilience testing" },
      { label: "Time Machine", href: "/product/time-machine", description: "Infrastructure state snapshots and rollback" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
  { label: "Changelog", href: "/changelog" },
];

export const CONSOLE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Playground", href: "/playground", icon: "Workflow" },
  { label: "AI Architect", href: "/ai-architect", icon: "Brain" },
  { label: "Migration", href: "/migration", icon: "ArrowRightLeft" },
  { label: "Simulator", href: "/simulator", icon: "Zap" },
  { label: "Time Machine", href: "/time-machine", icon: "History" },
];

export const FOOTER_NAV: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Playground", href: "/product/playground" },
      { label: "AI Architect", href: "/product/ai-architect" },
      { label: "Migration", href: "/product/migration" },
      { label: "Simulator", href: "/product/simulator" },
      { label: "Time Machine", href: "/product/time-machine" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
