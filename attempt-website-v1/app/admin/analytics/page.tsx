import { AdminShell } from "@/components/AdminShell";
import { AnalyticsClient } from "./AnalyticsClient";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell title="Analytics">
      <AnalyticsClient />
    </AdminShell>
  );
}
