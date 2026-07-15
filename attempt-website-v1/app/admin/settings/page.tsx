import { AdminShell } from "@/components/AdminShell";
import { SettingsClient } from "./SettingsClient";

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings">
      <SettingsClient />
    </AdminShell>
  );
}
