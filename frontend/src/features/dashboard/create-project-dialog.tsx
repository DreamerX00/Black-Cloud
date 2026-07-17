"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, ArrowRight, Sparkles } from "@/components/icons";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ClayBadge } from "@/components/ui/clay";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validations/project";
import { createProject } from "@/services/projects";
import { useAuth } from "@/store/auth";

/**
 * CreateProjectDialog — the warping portal into a new project.
 *
 * Trigger is a claymorphic AI-glow CTA. Dialog body is a claymorphic
 * panel with an ambient nebula tint, so the "create" moment reads like
 * the same universe the user just left, not a system modal.
 */
export function CreateProjectDialog({
  size = "default",
}: {
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const qc = useQueryClient();
  const userId = useAuth((s) => s.user?.id);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", description: "" },
  });

  const mut = useMutation({
    mutationFn: (values: CreateProjectInput) => {
      if (!userId) throw new Error("Not signed in");
      return createProject(userId, values);
    },
    onSuccess: (project) => {
      qc.invalidateQueries({ queryKey: ["projects", userId] });
      toast.success(`Created "${project.name}"`);
      setOpen(false);
      form.reset();
      router.push(`/playground/${project.id}`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="clay-primary" size={size} data-magnetic>
          <Plus className="size-4" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent
        className="clay shadow-clay-4 border-white/10 overflow-hidden isolate p-0"
        showCloseButton
      >
        {/* Ambient AI-glow inside dialog */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-ai/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-azure/10 blur-3xl"
        />

        <div className="relative z-10 space-y-6 p-6">
          <DialogHeader className="space-y-3 text-left">
            <ClayBadge tone="ai" pulse>
              <Sparkles className="size-3" /> New universe
            </ClayBadge>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
              Name your architecture
            </DialogTitle>
            <DialogDescription className="text-ink-muted">
              You&apos;ll drop into an empty canvas — start dragging services
              from the palette. You can rename it any time.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => mut.mutate(values))}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SaaS platform · prod"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Multi-region web app with RDS + CloudFront"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="clay-ghost"
                  onClick={() => setOpen(false)}
                  disabled={mut.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="clay-primary"
                  disabled={mut.isPending}
                >
                  {mut.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      Create & enter <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
