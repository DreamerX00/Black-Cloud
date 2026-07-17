"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "@/lib/format";
import { MoreVertical, Trash2, ArrowUpRight } from "@/components/icons";
import { motion } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ClayCard,
  ClayCardHeader,
  ClayCardTitle,
  ClayCardDescription,
  ClayCardFooter,
  ClayBadge,
  ClayOrb,
} from "@/components/ui/clay";
import { ProviderMark } from "@/components/icons";
import { PROVIDER_META } from "@/lib/nodes/registry";
import type { ProjectSummary } from "@/types/project";
import { cn } from "@/lib/utils";

interface Props {
  project: ProjectSummary;
  onDelete: (id: string) => void;
}

/**
 * ProjectCard — a claymorphic project tile.
 *
 * The tile itself is a clay-bump card. Its provider badges glow with the
 * matching provider shadow (clay-aws / clay-azure / clay-gcp) so the eye
 * reads "which cloud" before "which project."
 *
 * Empty (no providers yet) projects render a soft AI-glow orb so the
 * blank canvas still feels alive.
 */
export function ProjectCard({ project, onDelete }: Props) {
  const dominantProvider = project.providers[0];
  const tone =
    dominantProvider === "aws"
      ? "aws"
      : dominantProvider === "azure"
        ? "azure"
        : dominantProvider === "gcp"
          ? "gcp"
          : "ai";

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="group relative"
    >
      <Link
        href={`/playground/${project.id}`}
        data-magnetic
        className="block"
      >
        <ClayCard
          interactive
          className="min-h-[220px] flex-col justify-between overflow-hidden"
        >
          {/* Ambient provider glow on hover */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl",
              "opacity-40 group-hover:opacity-90 transition-opacity duration-500",
              tone === "aws" && "bg-aws/40",
              tone === "azure" && "bg-azure/40",
              tone === "gcp" && "bg-gcp/40",
              tone === "ai" && "bg-ai/40",
            )}
          />

          <ClayCardHeader>
            <div className="flex items-center gap-3 min-w-0">
              <ClayOrb size="md" tone={tone}>
                {dominantProvider ? (
                  <ProviderMark provider={dominantProvider} className="size-6" />
                ) : (
                  <span className="font-display text-lg font-semibold text-ink">
                    {project.name.slice(0, 1).toUpperCase() || "·"}
                  </span>
                )}
              </ClayOrb>
              <div className="min-w-0">
                <ClayCardTitle className="truncate">{project.name}</ClayCardTitle>
                <ClayCardDescription className="line-clamp-1">
                  {project.description || "No description yet"}
                </ClayCardDescription>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-ink-dim shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ai-bright" />
          </ClayCardHeader>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {project.providers.length === 0 ? (
              <ClayBadge tone="ai" pulse>
                empty · draw your first node
              </ClayBadge>
            ) : (
              project.providers.map((p) => (
                <ClayBadge key={p} tone={p}>
                  <ProviderMark provider={p} className="size-3" />
                  {PROVIDER_META[p].label}
                </ClayBadge>
              ))
            )}
          </div>

          <ClayCardFooter className="text-xs font-mono uppercase tracking-widest text-ink-dim">
            <span>
              {project.nodeCount} node{project.nodeCount !== 1 && "s"} ·{" "}
              {project.edgeCount} edge{project.edgeCount !== 1 && "s"}
            </span>
            <span>{formatDistanceToNowStrict(project.updatedAt)} ago</span>
          </ClayCardFooter>
        </ClayCard>
      </Link>

      {/* Actions menu — visible on hover / focus, doesn't navigate */}
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              variant="clay-ghost"
              aria-label={`Actions for ${project.name}`}
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="clay shadow-clay-3"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDelete(project.id);
              }}
              className="text-danger focus:text-danger focus:bg-danger/10"
            >
              <Trash2 className="mr-2 size-4" /> Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
