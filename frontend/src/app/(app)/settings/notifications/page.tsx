import type { Metadata } from "next";
import { NotificationsPanel } from "@/features/settings/notifications-panel";

export const metadata: Metadata = { title: "Notifications · Settings" };

export default function NotificationsSettingsPage() {
  return <NotificationsPanel />;
}
