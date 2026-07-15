import { AdminShell } from "@/components/AdminShell";
import { ProgramsClient } from "./ProgramsClient";

export default function AdminProgramsPage() {
  return (
    <AdminShell title="Programs">
      <ProgramsClient />
    </AdminShell>
  );
}
