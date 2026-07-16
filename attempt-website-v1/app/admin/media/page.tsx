import { AdminShell } from "@/components/AdminShell";
import { MediaClient } from "./MediaClient";

export default function AdminMediaPage() {
  return (
    <AdminShell title="Media">
      <MediaClient />
    </AdminShell>
  );
}
