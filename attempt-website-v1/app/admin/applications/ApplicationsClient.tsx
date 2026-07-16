"use client";

import { useEffect, useMemo, useState } from "react";
import { getApplications, updateApplicationStatus } from "@/lib/firestore";
import { AdminFormField } from "@/components/AdminFormField";

type Application = {
  id: string;
  name?: string;
  email?: string;
  country?: string;
  age?: string;
  bodyweight?: string;
  trainingAge?: string;
  coachingPriority?: string;
  readiness?: string;
  nextCompetition?: string;
  bestSnatch?: string;
  bestCleanJerk?: string;
  bestTotal?: string;
  competitionExperience?: string;
  currentTraining?: string;
  goals?: string;
  injuries?: string;
  availability?: string;
  links?: string;
  struggle?: string;
  whyAttempt?: string;
  onlineCoachingBefore?: string;
  consent?: boolean;
  status?: string;
  internalNotes?: string;
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
};

const statuses = ["New", "Reviewing", "Accepted", "Declined", "Archived"];

function normalizeStatus(status?: string) {
  const normalized = (status || "New").toLowerCase();

  if (
    normalized === "reviewing" ||
    normalized === "reviewed" ||
    normalized === "contacted"
  ) {
    return "Reviewing";
  }

  if (normalized === "accepted") {
    return "Accepted";
  }

  if (normalized === "declined" || normalized === "rejected") {
    return "Declined";
  }

  if (normalized === "archived" || normalized === "waitlist") {
    return "Archived";
  }

  return "New";
}

function formatDate(createdAt: Application["createdAt"]) {
  if (!createdAt?.seconds) return "—";

  return new Date(createdAt.seconds * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value?: string | boolean }) {
  return (
    <div className="adminReadOnlyField">
      <strong>{label}</strong>
      <span>
        {value === true ? "Yes" : value === false ? "No" : value || "—"}
      </span>
    </div>
  );
}

export function ApplicationsClient() {
  const [items, setItems] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [pendingStatus, setPendingStatus] = useState("New");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const applications = await getApplications();
    setItems(applications as Application[]);
    setLoading(false);

    if (!selectedId && applications.length) {
      setSelectedId((applications[0] as Application).id);
      setNotes(
        ((applications[0] as Application).internalNotes as string) || "",
      );
      setPendingStatus(normalizeStatus((applications[0] as Application).status));
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemStatus = normalizeStatus(item.status);
      const matchesStatus =
        statusFilter === "all" || itemStatus === statusFilter;

      const searchable = [
        item.name,
        item.email,
        item.country,
        item.coachingPriority,
        item.readiness,
        item.goals,
        item.whyAttempt,
        item.currentTraining,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, search]);

  const selected =
    items.find((item) => item.id === selectedId) ?? filteredItems[0];

  useEffect(() => {
    if (selected) {
      setSelectedId(selected.id);
      setNotes(selected.internalNotes || "");
      setPendingStatus(normalizeStatus(selected.status));
    }
  }, [selected?.id]);

  async function saveApplication(status: string, internalNotes = notes) {
    if (!selected) return;

    setSaving(true);
    await updateApplicationStatus(selected.id, status, internalNotes);
    await load();
    setSaving(false);
  }

  function selectApplication(item: Application) {
    setSelectedId(item.id);
    setNotes(item.internalNotes || "");
    setPendingStatus(normalizeStatus(item.status));
  }

  if (loading) {
    return <div className="adminCard">Loading applications...</div>;
  }

  if (!items.length) {
    return <div className="adminCard">No applications yet.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="adminCard">
        <div className="adminFilterGrid">
          <AdminFormField
            id="applicationSearch"
            label="Search applications"
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, country, goals..."
            help="Filters the application list without changing any applicant data."
          />

          <div className="field">
            <label htmlFor="statusFilter">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <p className="adminHelpText">
              Use this to focus on New, Reviewing, Accepted, Declined, or Archived applications.
            </p>
          </div>
        </div>
      </div>

      <div className="adminCmsLayout">
        <div className="adminCard" style={{ padding: 0, overflow: "hidden" }}>
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const isSelected = selected?.id === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => selectApplication(item)}
                    style={{
                      cursor: "pointer",
                      background: isSelected ? "#f0fbff" : "transparent",
                    }}
                  >
                    <td>
                      <strong>{item.name || "No name"}</strong>
                      <br />
                      <span style={{ color: "#656b78" }}>
                        {item.email || "—"}
                      </span>
                      <br />
                      <span style={{ color: "#656b78" }}>
                        {item.country || "—"}
                      </span>
                      {(item.coachingPriority || item.readiness) && (
                        <>
                          <br />
                          <span style={{ color: "#656b78" }}>
                            {[item.coachingPriority, item.readiness]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <span className="status">{normalizeStatus(item.status)}</span>
                    </td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filteredItems.length && (
            <div style={{ padding: 22, color: "#656b78" }}>
              No applications match your filters.
            </div>
          )}
        </div>

        {selected && (
          <div className="adminCard">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div className="adminCardHeader">
                <h2>
                  {selected.name || "No name"}
                </h2>
                <p>
                  {selected.email || "No email"} ·{" "}
                  {selected.country || "No country"}
                </p>
              </div>

              <span className="status">{normalizeStatus(selected.status)}</span>
            </div>

            <div className="grid3" style={{ marginBottom: 24 }}>
              <Field label="Age" value={selected.age} />
              <Field label="Bodyweight" value={selected.bodyweight} />
              <Field label="Training age" value={selected.trainingAge} />
              <Field
                label="Coaching priority"
                value={selected.coachingPriority}
              />
              <Field label="Readiness" value={selected.readiness} />
              <Field label="Next competition" value={selected.nextCompetition} />
              <Field label="Best snatch" value={selected.bestSnatch} />
              <Field label="Best clean & jerk" value={selected.bestCleanJerk} />
              <Field label="Best total" value={selected.bestTotal} />
            </div>

            <div
              className="adminTriageBox"
            >
              <h3>Triage summary</h3>
              <p>
                {[
                  selected.coachingPriority &&
                    `Priority: ${selected.coachingPriority}`,
                  selected.readiness && `Readiness: ${selected.readiness}`,
                  selected.nextCompetition &&
                    `Next competition: ${selected.nextCompetition}`,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No triage fields provided yet."}
              </p>

              {selected.email && (
                <div className="actions" style={{ marginTop: 16 }}>
                  <a
                    className="btn btnPrimary"
                    href={`mailto:${selected.email}?subject=Attempt Coaching application`}
                  >
                    Email Applicant
                  </a>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <Field
                label="Competition experience"
                value={selected.competitionExperience}
              />
              <Field
                label="Current coach or training setup"
                value={selected.currentTraining}
              />
              <Field label="Main goals" value={selected.goals} />
              <Field
                label="Injuries or limitations"
                value={selected.injuries}
              />
              <Field
                label="Training availability"
                value={selected.availability}
              />
              <Field label="Video/social links" value={selected.links} />
              <Field label="Biggest struggle" value={selected.struggle} />
              <Field
                label="Why Attempt Coaching?"
                value={selected.whyAttempt}
              />
              <Field
                label="Used online coaching before?"
                value={selected.onlineCoachingBefore}
              />
              <Field label="Consent to be contacted" value={selected.consent} />
            </div>

            <div
              style={{ height: 1, background: "#eceef3", margin: "28px 0" }}
            />

            <div className="field">
              <label htmlFor="applicationStatus">Application status</label>
              <select
                id="applicationStatus"
                value={pendingStatus}
                onChange={(event) => setPendingStatus(event.target.value)}
                disabled={saving}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="adminHelpText">
                Choose a status, then save it inside the admin panel. No
                applicant email is sent yet.
              </p>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="internalNotes">Internal admin notes</label>
              <textarea
                id="internalNotes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Private notes. Example: Good candidate. Ask about training availability and competition plans."
              />
              <p className="adminHelpText">
                Private notes are only visible in the CMS.
              </p>
            </div>

            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => saveApplication(pendingStatus, notes)}
              disabled={saving}
              style={{ marginTop: 16 }}
            >
              {saving ? "Saving..." : "Save Status and Notes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
