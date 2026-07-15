import { AdminShell } from '@/components/AdminShell';
import { ApplicationsClient } from './ApplicationsClient';

export default function AdminApplicationsPage() {
  return <AdminShell title="Applications"><ApplicationsClient /></AdminShell>;
}
