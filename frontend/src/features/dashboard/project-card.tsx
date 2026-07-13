"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "@/lib/format";
import { MoreVertical, Trash2 } from "lucide-react";
import { motion } from "@/components/motion/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROVIDER_META } from "@/lib/nodes/registry";
import type { ProjectSummary } from "@/types/project";

interface Props {
  project: ProjectSummary;
  onDelete: (id: string) => void;
}

/**
 * Individual project tile. Card is a link; the menu button stops propagation
 * so clicking it doesn't navigate.
 */
export function ProjectCard({ project, onDelete }: Props) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/playground/${project.id}`} className="block">
        <Card className="h-full border-border/60 bg-graphite/40 p-5 transition-colors hover:border-ai/60 hover:bg-graphite/70">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-medium">{project.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                {project.description || "No description yet"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            {project.providers.length === 0 ? (
              <span className="italic">Empty canvas</span>
            ) : (
              project.providers.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-2 py-0.5"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: PROVIDER_META[p].accent }}
                  />
                  {PROVIDER_META[p].label}
                </span>
              ))
            )}
            <span className="ml-auto shrink-0">
              {project.nodeCount} node{project.nodeCount !== 1 && "s"}
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/70">
            Updated {formatDistanceToNowStrict(project.updatedAt)} ago
          </p>
        </Card>
      </Link>

      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label={`Actions for ${project.name}`}
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onDelete(project.id);
              }}
              className="text-danger focus:text-danger"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
