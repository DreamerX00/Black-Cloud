"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check } from "@/components/icons";

import { forgotSchema, type ForgotInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrutAlert } from "@/components/ui/clay";

export function ForgotForm() {
  const [sent, setSent] = useState<string | null>(null);

  const form = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });
  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: ForgotInput) {
    // Backend endpoint TODO — for now, optimistic client-only flow.
    await new Promise((r) => setTimeout(r, 700));
    setSent(values.email);
    toast.success("Reset link sent — check your inbox");
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <BrutAlert tone="info">
          <Check className="size-4 shrink-0" />
          <div>
            <div className="font-semibold">Check your email</div>
            <div className="mt-1 text-ink-muted normal-case tracking-normal font-sans text-xs">
              A reset link is on its way to <strong>{sent}</strong>. The link
              expires in 30 minutes.
            </div>
          </div>
        </BrutAlert>
        <Button
          type="button"
          variant="clay-ghost"
          size="lg"
          className="w-full"
          onClick={() => {
            setSent(null);
            form.reset();
          }}
        >
          Send to a different address
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="clay-primary"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
