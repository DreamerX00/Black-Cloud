"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterValues } from "@/lib/auth/schema";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  // Frontend-only for now; backend auth wiring is a separate loop.
  const onSubmit = async (values: RegisterValues) => {
    void values; // TODO(backend-loop): POST to /auth/register
    toast.success("Account created");
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start designing cloud architecture in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Name" error={errors.name?.message}>
          <input type="text" autoComplete="name" {...register("name")} className="auth-input" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" autoComplete="email" {...register("email")} className="auth-input" />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="auth-input"
          />
        </Field>
        <Field label="Confirm password" error={errors.confirm?.message}>
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirm")}
            className="auth-input"
          />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Create account
        </button>
      </form>
    </AuthShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-fg-muted">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger">{error}</span>}
    </label>
  );
}
