/**
 * Static blog posts. Reads inline — no CMS, no headless service. When the
 * real backend lands, swap the getter for a query without changing pages.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: number;
  emoji: string;
  tag?: "aws" | "azure" | "gcp";
  body: string[];
};

const POSTS: Post[] = [
  {
    slug: "one-graph-seven-lenses",
    title: "One graph, seven lenses: why BlackCloud is built on a shared data model",
    excerpt: "The moat isn't any single pillar. It's that all seven read and write the same infrastructure graph.",
    date: "2026-07-15",
    author: "Alex R. · Founder",
    readingTime: 8,
    emoji: "◈",
    body: [
      "Every cloud tool eventually admits it's really a graph. Nodes are resources. Edges are relationships. Once you accept that, the interesting question isn't the diagram — it's who owns the graph.",
      "For most of the industry, nobody does. Your diagramming tool has its own model. Your cost dashboard has another. Your Terraform is a third. Your security scan is a fourth. The moment you change real infrastructure, every one of those models drifts away from truth — and away from each other.",
      "BlackCloud's bet is simple: build one graph, and let every product be a lens over it. The Playground edits it. The Cost Simulator scores it. The Failure Simulator traverses it. The Time Machine versions it. The AI Architect generates it. Live Twin mirrors it against reality. Migration Ground transforms it across providers.",
      "This is not a marketing frame. It's a technical constraint we enforce internally: if any product ever calls out to a separate model, we've reintroduced exactly the sync problem we exist to kill. The unifying graph isn't a feature — it's the thesis.",
      "The corollary: no competitor stitching together six SaaS tools can replicate this without rebuilding from the data layer up. That's the moat.",
    ],
  },
  {
    slug: "the-why-engine",
    title: "The Why Engine: eight months from now, someone else needs to know",
    excerpt: "Every senior engineer has watched their reasoning evaporate. The Why Engine is a permanent, timestamped receipt.",
    date: "2026-06-28",
    author: "Priyanka R. · Product",
    readingTime: 6,
    emoji: "⬢",
    body: [
      "Ask any staff engineer why the primary database is r6g.xlarge and not serverless. Nine times out of ten, the answer is a shrug. The reasoning existed once, in a Slack thread that's been paged out of memory.",
      "The Why Engine solves this by prompting for one sentence at the moment of decision. It's small enough to feel painless. It compounds into an archive nobody else has.",
      "Two years in, that archive becomes an asset your competition literally cannot buy. You can migrate off Terraform. You can switch clouds. You can't retroactively recover a decision your team never wrote down anywhere.",
    ],
    tag: "aws",
  },
  {
    slug: "live-twin-trust-bar",
    title: "Live Twin is the highest trust bar in the whole product",
    excerpt: "Asking a customer for read access is a security decision a CISO signs off on. We designed for that from day one.",
    date: "2026-06-11",
    author: "Marcus O. · Security",
    readingTime: 9,
    emoji: "◉",
    body: [
      "The moment BlackCloud stops being a nice-to-have and becomes a real cloud dependency is when Live Twin connects. That's a specific, deliberate design decision — and it has security implications we take seriously.",
      "Live Twin ships read-only first. SOC2 Type II is not a roadmap item; it exists before the feature does. Every connector uses least-privilege scoped roles. Every action produces an audit log entry a CISO can search and export.",
      "We won't ask for write access for months, maybe a year, past the first read-only connection. The trust bar earns itself.",
    ],
    tag: "gcp",
  },
  {
    slug: "chaos-game-day",
    title: "Chaos Game Day: turning your worst hour into practice",
    excerpt: "The Failure Simulator scheduled, scored, and made competitive. Two silent single-AZ dependencies found in the first drill.",
    date: "2026-05-22",
    author: "Rin T. · SRE",
    readingTime: 7,
    emoji: "✷",
    body: [
      "Every year, one team runs a chaos drill and finds three problems that would have taken production down within the quarter. Every year, that team is celebrated. Every year, they run one drill.",
      "Chaos Game Day is the Failure Simulator with a schedule, a leaderboard, and a formal scoring rubric. Detection latency, blast radius contained, cascade prevented. Teams compete quarterly.",
      "The point isn't the leaderboard. It's the schedule. Weekly practice makes a war room feel like a Tuesday.",
    ],
    tag: "azure",
  },
  {
    slug: "why-mascots",
    title: "Why the mascots aren't decoration",
    excerpt: "The Council isn't onboarding UI. It's how we make AI recommendations legible instead of black-box.",
    date: "2026-05-03",
    author: "Kaz F. · Design",
    readingTime: 5,
    emoji: "▲",
    body: [
      "There are two kinds of AI in enterprise software. One says 'we recommend x' and hides its reasoning behind a confidence percentage. The other shows the disagreement.",
      "The Council is deliberately five, not one. Different models. Different personalities. Different priorities. They critique each other's drafts before you see the recommendation, and their disagreement log is public per generation.",
      "A user doesn't need to know which model produced which line. They need to know that Aria the Raven flagged an IAM policy, and Elm the Owl pushed back on cost, and both eventually agreed a smaller role and a bigger cache was the answer.",
      "That's the difference between AI as a black-box verdict and AI as a colleague you get to argue with.",
    ],
  },
  {
    slug: "60-fps-on-300-nodes",
    title: "60 FPS on 300 nodes: what actually renders in the Playground",
    excerpt: "React Flow for the graph. PixiJS for traffic. R3F for the universe. Here's how they compose.",
    date: "2026-04-18",
    author: "Terra · Engineering",
    readingTime: 10,
    emoji: "⚡",
    body: [
      "The Playground looks like one canvas. It's actually three, layered.",
      "React Flow handles nodes, edges, drag, zoom, and selection — a well-solved problem with excellent performance up to a few thousand nodes.",
      "PixiJS handles animated traffic particles. Every packet in the diagram is a WebGL-drawn sprite riding a bezier curve. This lets us render thousands of packets a second without touching React state.",
      "React Three Fiber handles the ambient universe — the starfield, nebulae, and the landing hero. It renders once per frame with a heavily budgeted dpr cap.",
      "The three layers compose in one DOM tree. Reduced-motion mode kills Pixi and Three entirely and reverts the Playground to React Flow only.",
    ],
  },
];

export function getAllPosts(): Post[] {
  return POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find(p => p.slug === slug);
}

export function getPostSlugs(): string[] {
  return POSTS.map(p => p.slug);
}
