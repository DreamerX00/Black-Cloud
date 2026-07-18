"use client";

import {
  SiGooglecloud,
  SiKubernetes,
  SiTerraform,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiVercel,
  SiCloudflare,
  SiPulumi,
  SiPython,
  SiTypescript,
  SiReact,
  SiNextdotjs,
} from "react-icons/si";
import {
  Cloud,
  Globe,
} from "lucide-react";
import type { ComponentType } from "react";

type IconEntry = { Icon: ComponentType<any>; color: string };
type ProviderEntry = IconEntry & { label: string };

export const PROVIDER_ICON: Record<string, ProviderEntry> = {
  aws: { Icon: Cloud, color: "#FF9900", label: "AWS" },
  azure: { Icon: Cloud, color: "#0078D4", label: "Azure" },
  gcp: { Icon: SiGooglecloud, color: "#4285F4", label: "Google Cloud" },
  multi: { Icon: Globe, color: "#8B5CF6", label: "Multi-Cloud" },
};

export const PROVIDER_COLOR: Record<string, string> = {
  aws: "#FF9900",
  azure: "#0078D4",
  gcp: "#4285F4",
  multi: "#8B5CF6",
};

export const TECH_ICON: Record<string, IconEntry> = {
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  terraform: { Icon: SiTerraform, color: "#7B42BC" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  redis: { Icon: SiRedis, color: "#DC382D" },
  vercel: { Icon: SiVercel, color: "#000000" },
  cloudflare: { Icon: SiCloudflare, color: "#F38020" },
  pulumi: { Icon: SiPulumi, color: "#8A3391" },
  python: { Icon: SiPython, color: "#3776AB" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  react: { Icon: SiReact, color: "#61DAFB" },
  nextjs: { Icon: SiNextdotjs, color: "#000000" },
};

export function ServiceIcon({
  provider,
  size = 20,
}: {
  provider: string;
  size?: number;
}) {
  const entry = PROVIDER_ICON[provider];
  if (!entry) return null;
  const { Icon, color } = entry;
  return <Icon size={size} color={color} />;
}
