import { AdminShell } from '@/components/AdminShell';

export default function AdminPage() {
  return (
    <AdminShell title="Media">
      <div className="adminCard">
        <h3>Content management scaffold</h3>
        <p>This page is ready for Firebase-backed editing. Add forms here for the fields defined in the master build instruction.</p>
        <div className="form">
          <div className="field"><label>Section title</label><input placeholder="Editable content field" /></div>
          <div className="field"><label>Text</label><textarea placeholder="Editable content text" /></div>
          <button className="btn btnPrimary">Save draft</button>
        </div>
      </div>
    </AdminShell>
  );
}
