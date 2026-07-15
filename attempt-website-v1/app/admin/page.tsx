import { AdminShell } from "@/components/AdminShell";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <AdminDashboardClient />
    </AdminShell>
  );
}
