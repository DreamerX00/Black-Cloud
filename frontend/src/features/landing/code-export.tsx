"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Code export — Act VII.
 *
 * A tabbed code block: Terraform / CloudFormation / JSON. Lines fade in
 * sequentially the first time the section enters view, giving the sense
 * of code being *generated* from your canvas rather than just displayed.
 *
 * Snippets are hand-authored — they mirror the three-tier web-app in the
 * PlaygroundPreview so the whole page tells one continuous story.
 */

type Tab = "tf" | "cfn" | "json";

const SNIPPETS: Record<Tab, { label: string; lang: string; lines: Line[] }> = {
  tf: {
    label: "Terraform",
    lang: "hcl",
    lines: [
      { t: `# BlackCloud → HCL · three-tier-web`, c: "muted" },
      { t: `resource "aws_lb" "web" {`, c: "keyword" },
      { t: `  name               = "three-tier-web"` },
      { t: `  load_balancer_type = "application"` },
      { t: `  subnets            = aws_subnet.public[*].id` },
      { t: `}` },
      { t: `` },
      { t: `resource "aws_instance" "app" {`, c: "keyword" },
      { t: `  ami           = data.aws_ami.al2023.id` },
      { t: `  instance_type = "t3.medium"` },
      { t: `  subnet_id     = aws_subnet.private_a.id` },
      { t: `}` },
      { t: `` },
      { t: `resource "aws_db_instance" "primary" {`, c: "keyword" },
      { t: `  engine         = "postgres"` },
      { t: `  instance_class = "db.t3.small"` },
      { t: `  storage_type   = "gp3"` },
      { t: `}` },
    ],
  },
  cfn: {
    label: "CloudFormation",
    lang: "yaml",
    lines: [
      { t: `# BlackCloud → CFN · three-tier-web`, c: "muted" },
      { t: `Resources:`, c: "keyword" },
      { t: `  WebALB:`, c: "keyword" },
      { t: `    Type: AWS::ElasticLoadBalancingV2::LoadBalancer` },
      { t: `    Properties:` },
      { t: `      Name: three-tier-web` },
      { t: `      Scheme: internet-facing` },
      { t: `  AppInstance:`, c: "keyword" },
      { t: `    Type: AWS::EC2::Instance` },
      { t: `    Properties:` },
      { t: `      InstanceType: t3.medium` },
      { t: `      SubnetId: !Ref PrivateSubnetA` },
      { t: `  PrimaryDB:`, c: "keyword" },
      { t: `    Type: AWS::RDS::DBInstance` },
      { t: `    Properties:` },
      { t: `      Engine: postgres` },
      { t: `      DBInstanceClass: db.t3.small` },
    ],
  },
  json: {
    label: "JSON",
    lang: "json",
    lines: [
      { t: `{`, c: "keyword" },
      { t: `  "id": "three-tier-web",` },
      { t: `  "nodes": [`, c: "keyword" },
      { t: `    { "id": "alb-1", "type": "aws.alb" },` },
      { t: `    { "id": "ec2-1", "type": "aws.ec2" },` },
      { t: `    { "id": "rds-1", "type": "aws.rds" },` },
      { t: `    { "id": "s3-1",  "type": "aws.s3"  }` },
      { t: `  ],`, c: "keyword" },
      { t: `  "edges": [` },
      { t: `    { "from": "alb-1", "to": "ec2-1" },` },
      { t: `    { "from": "ec2-1", "to": "rds-1" }` },
      { t: `  ]` },
      { t: `}`, c: "keyword" },
    ],
  },
};

interface Line {
  t: string;
  c?: "keyword" | "muted";
}

export function CodeExport() {
  const [tab, setTab] = useState<Tab>("tf");
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const snippet = SNIPPETS[tab];

  // "Copy" button state — pure UI feedback, no clipboard writes (there's
  // nothing meaningful to paste from a mocked snippet).
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act VII · Export
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl">
              The diagram <span className="italic">is</span> the source.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <p className="hidden max-w-sm text-right text-sm text-muted-foreground tablet:block">
            Every canvas emits Terraform, CloudFormation, and portable JSON.
            No drift. No re-typing.
          </p>
        </Reveal>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-space/70 shadow-[0_40px_120px_-30px_rgba(66,133,244,0.35)] backdrop-blur-xl">
        {/* Tab bar + copy */}
        <div className="flex items-center border-b border-border/40 bg-void/40 px-4">
          {(Object.keys(SNIPPETS) as Tab[]).map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative -mb-px px-4 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
                  active ? "text-ink" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {SNIPPETS[t].label}
                {active && (
                  <motion.span
                    layoutId="code-tab-underline"
                    className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-ai via-gcp to-aws"
                  />
                )}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              .{snippet.lang}
            </span>
            <button
              type="button"
              onClick={() => setCopied(true)}
              className="rounded-md border border-border/50 bg-graphite/50 px-4 py-3 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-[auto_1fr] gap-0 overflow-x-auto font-mono text-[12.5px] leading-6">
          {/* Line gutter */}
          <div className="select-none border-r border-border/30 bg-void/30 py-4 pl-4 pr-3 text-right text-muted-foreground/60">
            {snippet.lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code */}
          <pre className="py-4 pl-5 pr-6 text-ink/90">
            {snippet.lines.map((line, i) => (
              <motion.div
                key={`${tab}-${i}`}
                initial={reduce ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : 0.1 + i * 0.08 }}
                className={
                  line.c === "muted"
                    ? "text-muted-foreground/60"
                    : line.c === "keyword"
                      ? "text-ai"
                      : undefined
                }
              >
                {line.t || " "}
              </motion.div>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}
