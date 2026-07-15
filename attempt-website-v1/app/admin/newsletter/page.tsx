import { AdminShell } from "@/components/AdminShell";
import { NewsletterClient } from "./NewsletterClient";

export default function AdminNewsletterPage() {
  return (
    <AdminShell title="Newsletter">
      <NewsletterClient />
    </AdminShell>
  );
}
