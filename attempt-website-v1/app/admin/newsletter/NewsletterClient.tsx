"use client";

import { useEffect, useMemo, useState } from "react";
import { getNewsletterSignups } from "@/lib/firestore";

type NewsletterSignup = {
  id: string;
  email?: string;
  createdAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
};

function formatDate(createdAt: NewsletterSignup["createdAt"]) {
  if (!createdAt?.seconds) return "—";

  return new Date(createdAt.seconds * 1000).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NewsletterClient() {
  const [signups, setSignups] = useState<NewsletterSignup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function loadSignups() {
    setLoading(true);
    const data = await getNewsletterSignups();
    setSignups(data as NewsletterSignup[]);
    setLoading(false);
  }

  useEffect(() => {
    loadSignups();
  }, []);

  const filteredSignups = useMemo(() => {
    return signups.filter((signup) =>
      (signup.email || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [signups, search]);

  async function copyEmails() {
    const emails = filteredSignups
      .map((signup) => signup.email)
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(emails);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="adminCard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            alignItems: "end",
          }}
        >
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="newsletterSearch">Search newsletter signups</label>
            <input
              id="newsletterSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email..."
            />
          </div>

          <button
            className="btn btnPrimary"
            type="button"
            onClick={copyEmails}
            disabled={!filteredSignups.length}
          >
            {copied ? "Copied" : "Copy Emails"}
          </button>
        </div>
      </div>

      <div className="adminCard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            marginBottom: 18,
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#16181d" }}>Newsletter signups</h3>
            <p style={{ margin: "8px 0 0" }}>
              {filteredSignups.length} of {signups.length} signup
              {signups.length === 1 ? "" : "s"} shown.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading signups...</p>
        ) : filteredSignups.length ? (
          <table className="adminTable">
            <thead>
              <tr>
                <th>Email</th>
                <th>Signup date</th>
              </tr>
            </thead>

            <tbody>
              {filteredSignups.map((signup) => (
                <tr key={signup.id}>
                  <td>
                    <strong>{signup.email || "No email"}</strong>
                  </td>
                  <td>{formatDate(signup.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No newsletter signups found.</p>
        )}
      </div>
    </div>
  );
}
