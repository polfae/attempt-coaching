import { AdminShell } from "@/components/AdminShell";
import { AboutClient } from "./aboutclient";

export default function AdminAboutPage() {
  return (
    <AdminShell title="About">
      <AboutClient />
    </AdminShell>
  );
}
