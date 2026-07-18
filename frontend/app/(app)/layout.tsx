import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";

/**
 * Route-group layout for authenticated surfaces. The global GlobalNav
 * still sits at the very top of the DOM from the root layout — this
 * layer adds a persistent sidebar + a workspace-aware topbar.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-24 lg:pl-72">
      <AppSidebar />
      <AppTopbar />
      <div className="min-h-[100dvh] px-4 pb-32 pt-6 md:px-8">{children}</div>
    </div>
  );
}
