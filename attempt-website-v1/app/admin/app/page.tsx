import { AdminShell } from "@/components/AdminShell";
import { AppClient } from "./AppClient";

export default function AdminAppPage() {
  return (
    <AdminShell title="App page">
      <AppClient />
    </AdminShell>
  );
}
