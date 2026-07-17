import { AdminShell } from "@/components/AdminShell";
import { ArticlesClient } from "./ArticlesClient";

export default function AdminArticlesPage() {
  return (
    <AdminShell title="Articles">
      <ArticlesClient />
    </AdminShell>
  );
}
