import { AdminShell } from "@/components/AdminShell";
import { FaqClient } from "./FaqClient";

export default function AdminFaqPage() {
  return (
    <AdminShell title="FAQ">
      <FaqClient />
    </AdminShell>
  );
}
