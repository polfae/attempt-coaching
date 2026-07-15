import { AdminShell } from "@/components/AdminShell";
import { CoachingClient } from "./CoachingClient";

export default function AdminCoachingPage() {
  return (
    <AdminShell title="Coaching">
      <CoachingClient />
    </AdminShell>
  );
}
