"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, PlayCircle } from "@/components/icons";
import { MagneticButton } from "@/components/motion/magnetic";
import { bootstrapDemo } from "@/services/demo";
import { useAuth } from "@/store/auth";

/**
 * Landing CTA that provisions a demo session, seeds a canvas, and jumps
 * directly into the playground. Idempotent — repeat clicks re-use the
 * existing demo user and project.
 */
export function TryDemoButton({
  label = "Try the demo",
  variant = "outline",
}: {
  label?: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const { projectId, userId, token } = await bootstrapDemo();
      // Push into the auth store so AuthGuard passes on the next route.
      setSession({
        user: {
          id: userId,
          email: "demo@blackcloud.dev",
          name: "Demo Architect",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        },
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      router.push(`/playground/${projectId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demo failed to start");
      setLoading(false);
    }
  }

  return (
    <MagneticButton variant={variant} onClick={handleClick} ariaLabel={label}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PlayCircle className="h-4 w-4" />
      )}
      {loading ? "Starting…" : label}
    </MagneticButton>
  );
}
