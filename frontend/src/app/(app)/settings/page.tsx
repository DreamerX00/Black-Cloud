import { redirect } from "next/navigation";

/** /settings → /settings/profile (index redirect). */
export default function SettingsIndex() {
  redirect("/settings/profile");
}
