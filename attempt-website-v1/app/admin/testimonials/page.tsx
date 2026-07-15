import { AdminShell } from "@/components/AdminShell";
import { TestimonialsClient } from "./TestimonialsClient";

export default function AdminTestimonialsPage() {
  return (
    <AdminShell title="Testimonials">
      <TestimonialsClient />
    </AdminShell>
  );
}
