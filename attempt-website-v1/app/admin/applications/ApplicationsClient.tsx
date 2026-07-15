"use client";

import { useEffect, useMemo, useState } from "react";
import { getApplications, updateApplicationStatus } from "@/lib/firestore";

type Application = {
  id: string;
  name?: string;
  email?: string;
  country?: string;
  age?: string;
  bodyweight?: string;
  trainingAge?: string;
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

const statuses = ["new", "reviewed", "contacted", "accepted", "rejected"];

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
    <div style={{ display: "grid", gap: 4 }}>
      <strong style={{ color: "#16181d", fontSize: 13 }}>{label}</strong>
      <span style={{ color: "#545b68", lineHeight: 1.55 }}>
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
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemStatus = item.status ?? "new";
      const matchesStatus =
        statusFilter === "all" || itemStatus === statusFilter;

      const searchable = [
        item.name,
        item.email,
        item.country,
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: 14,
            alignItems: "end",
          }}
        >
          <div className="field">
            <label htmlFor="applicationSearch">Search applications</label>
            <input
              id="applicationSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, country, goals..."
            />
          </div>

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
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 0.85fr) minmax(420px, 1.15fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
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
                    </td>
                    <td>
                      <span className="status">{item.status ?? "new"}</span>
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
              <div>
                <h2 style={{ margin: 0, color: "#16181d" }}>
                  {selected.name || "No name"}
                </h2>
                <p style={{ margin: "8px 0 0" }}>
                  {selected.email || "No email"} ·{" "}
                  {selected.country || "No country"}
                </p>
              </div>

              <span className="status">{selected.status ?? "new"}</span>
            </div>

            <div className="grid3" style={{ marginBottom: 24 }}>
              <Field label="Age" value={selected.age} />
              <Field label="Bodyweight" value={selected.bodyweight} />
              <Field label="Training age" value={selected.trainingAge} />
              <Field label="Best snatch" value={selected.bestSnatch} />
              <Field label="Best clean & jerk" value={selected.bestCleanJerk} />
              <Field label="Best total" value={selected.bestTotal} />
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
                value={selected.status ?? "new"}
                onChange={(event) => saveApplication(event.target.value)}
                disabled={saving}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="internalNotes">Internal admin notes</label>
              <textarea
                id="internalNotes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Private notes. Example: Good candidate. Ask about training availability and competition plans."
              />
            </div>

            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => saveApplication(selected.status ?? "new", notes)}
              disabled={saving}
              style={{ marginTop: 16 }}
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
