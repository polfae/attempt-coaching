import { AdminShell } from "@/components/AdminShell";
import { HomepageClient } from "./HomepageClient";

export default function AdminHomepagePage() {
  return (
    <AdminShell title="Homepage">
      <HomepageClient />
    </AdminShell>
  );
}
