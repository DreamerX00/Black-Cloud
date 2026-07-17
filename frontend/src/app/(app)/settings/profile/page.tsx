import type { Metadata } from "next";
import { ProfileForm } from "@/features/settings/profile-form";

export const metadata: Metadata = { title: "Profile · Settings" };

export default function ProfileSettingsPage() {
  return <ProfileForm />;
}
