import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";
import { Reveal } from "@/components/ui/reveal";

const QUOTES = [
  { quote: "The first architecture tool that opens twice in one week without an outage forcing me.", who: "Priyanka R.", role: "Staff Engineer · fintech, Series C" },
  { quote: "We put the AI Architect diagram on the wall for onboarding. New hires ship in week two now.", who: "Marcus O.", role: "VP Engineering · logistics" },
  { quote: "The Health Score sat in the exec dashboard next to revenue. Cost went down 22% that quarter.", who: "Lena F.", role: "CTO · healthtech" },
  { quote: "First tool where the migration plan didn't lie. Watched Lambda dissolve into Cloud Run in real time.", who: "Ade K.", role: "Principal Cloud Architect" },
  { quote: "The failure simulator paid for itself in the first game day. Two silent single-AZ dependencies, found before Christmas.", who: "Rin T.", role: "SRE Lead" },
  { quote: "\"I called this\" — the Why Engine finally makes it provable.", who: "Diego M.", role: "Head of Platform" },
];

export function QuotesSection() {
  return (
    <Section
      eyebrow="What real teams say"
      title={<>Retention is not built on features. It&rsquo;s built on which fears get retired.</>}
      intro="Six engineering leaders on the specific 2am moments BlackCloud replaces."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.who} delay={i * 0.06}>
            <ClayCard className="flex h-full flex-col p-6">
              <span aria-hidden className="font-display text-5xl leading-none text-ai">&ldquo;</span>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">{q.quote}</p>
              <div className="mt-6 text-mono-caps text-ink-mute">
                {q.who} <span className="opacity-50">·</span> {q.role}
              </div>
            </ClayCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
