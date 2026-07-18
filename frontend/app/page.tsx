// ponytail: server component just re-exports the client shell
// dynamic() with ssr:false must be called from a client component per Next 16 docs
import HomeShell from "./_home-shell";

export default function Home() {
  return <HomeShell />;
}
