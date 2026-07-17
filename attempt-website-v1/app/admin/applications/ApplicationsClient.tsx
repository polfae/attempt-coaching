"use client";

import { useEffect, useMemo, useState } from "react";
import { getApplications, updateApplicationStatus } from "@/lib/firestore";
import { AdminFormField } from "@/components/AdminFormField";

type Application = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  countryCode?: string;
  bodyweightKg?: number;
  weightClass?: string;
  weightliftingTrainingYears?: number;
  lifts?: {
    snatch?: number;
    cleanAndJerk?: number;
    total?: number;
    clean?: number;
    jerk?: number;
    backSquat?: number;
    frontSquat?: number;
  };
  trainingDaysPerWeek?: number;
  mainGoals?: string[];
  otherGoal?: string;
  goalsDescription?: string;
  hasInjuries?: boolean;
  injuryDescription?: string;
  coachExpectations?: string;
  hadOnlineCoach?: boolean;
  preparingForCompetition?: boolean;
  competitionName?: string;
  competitionDate?: string;
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

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | string[];
}) {
  return (
    <div className="adminReadOnlyField">
      <strong>{label}</strong>
      <span>{displayValue(value)}</span>
    </div>
  );
}

function applicantName(item: Application) {
  return (
    [item.firstName, item.lastName].filter(Boolean).join(" ") ||
    item.name ||
    "No name"
  );
}

function displayValue(value?: string | number | boolean | string[]) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === true) return "Yes";
  if (value === false) return "No";
  return value || "—";
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
        item.firstName,
        item.lastName,
        item.email,
        item.country,
        item.countryCode,
        item.weightClass,
        item.mainGoals?.join(" "),
        item.coachingPriority,
        item.readiness,
        item.goalsDescription,
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
                      <strong>{applicantName(item)}</strong>
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
                  {applicantName(selected)}
                </h2>
                <p>
                  {selected.email || "No email"} ·{" "}
                  {selected.country || "No country"}
                </p>
              </div>

              <span className="status">{normalizeStatus(selected.status)}</span>
            </div>

            <div className="grid3" style={{ marginBottom: 24 }}>
              <Field label="Date of birth" value={selected.dateOfBirth || selected.age} />
              <Field label="Gender" value={selected.gender} />
              <Field label="Country" value={selected.country} />
              <Field
                label="Bodyweight"
                value={
                  selected.bodyweightKg
                    ? `${selected.bodyweightKg} kg`
                    : selected.bodyweight
                }
              />
              <Field label="Weight class" value={selected.weightClass} />
              <Field
                label="Training years"
                value={
                  selected.weightliftingTrainingYears ??
                  selected.trainingAge
                }
              />
              <Field
                label="Training sessions/week"
                value={selected.trainingDaysPerWeek}
              />
              <Field
                label="Competition experience"
                value={selected.competitionExperience}
              />
            </div>

            <div
              className="adminTriageBox"
            >
              <h3>Triage summary</h3>
              <p>
                {[
                  selected.coachingPriority &&
                    `Priority: ${selected.coachingPriority}`,
                  selected.mainGoals?.length &&
                    `Goals: ${selected.mainGoals.join(", ")}`,
                  selected.preparingForCompetition &&
                    `Competition: ${selected.competitionDate || "planned"}`,
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
              <div className="grid3">
                <Field
                  label="Snatch"
                  value={selected.lifts?.snatch ?? selected.bestSnatch}
                />
                <Field
                  label="Clean and jerk"
                  value={selected.lifts?.cleanAndJerk ?? selected.bestCleanJerk}
                />
                <Field
                  label="Total"
                  value={selected.lifts?.total ?? selected.bestTotal}
                />
                <Field label="Clean" value={selected.lifts?.clean} />
                <Field label="Jerk" value={selected.lifts?.jerk} />
                <Field label="Back squat" value={selected.lifts?.backSquat} />
                <Field label="Front squat" value={selected.lifts?.frontSquat} />
              </div>
              <Field
                label="Main goals"
                value={displayValue(selected.mainGoals)}
              />
              <Field label="Other goal" value={selected.otherGoal} />
              <Field
                label="Describe goals"
                value={selected.goalsDescription || selected.goals}
              />
              <Field label="Biggest struggle" value={selected.struggle} />
              <Field
                label="Has injuries or limitations"
                value={selected.hasInjuries ?? selected.injuries}
              />
              <Field
                label="Injury description"
                value={selected.injuryDescription || selected.injuries}
              />
              <Field label="Why Attempt?" value={selected.whyAttempt} />
              <Field
                label="Coach expectations"
                value={selected.coachExpectations}
              />
              <Field
                label="Previously had online coach"
                value={
                  selected.hadOnlineCoach ?? selected.onlineCoachingBefore
                }
              />
              <Field
                label="Preparing for competition"
                value={
                  selected.preparingForCompetition ?? selected.nextCompetition
                }
              />
              <Field label="Competition name" value={selected.competitionName} />
              <Field
                label="Competition date"
                value={selected.competitionDate || selected.nextCompetition}
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
