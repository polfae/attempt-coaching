"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminLinks } from "@/lib/content";
import {
  getApplications,
  getNewsletterSignups,
  getPrograms,
  getTestimonials,
} from "@/lib/firestore";

type DashboardApplication = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  coachingPriority?: string;
  readiness?: string;
  createdAt?: {
    seconds?: number;
  };
};

type DashboardStats = {
  applications: number;
  newApplications: number;
  newsletterSignups: number;
  programs: number;
  visiblePrograms: number;
  testimonials: number;
  visibleTestimonials: number;
};

const initialStats: DashboardStats = {
  applications: 0,
  newApplications: 0,
  newsletterSignups: 0,
  programs: 0,
  visiblePrograms: 0,
  testimonials: 0,
  visibleTestimonials: 0,
};

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [recentApplications, setRecentApplications] = useState<
    DashboardApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const [applications, newsletterSignups, programs, testimonials] =
          await Promise.all([
            getApplications(),
            getNewsletterSignups(),
            getPrograms(),
            getTestimonials(),
          ]);

        if (!active) return;

        setStats({
          applications: applications.length,
          newApplications: applications.filter(
            (item: any) => !item.status || item.status === "new" || item.status === "New",
          ).length,
          newsletterSignups: newsletterSignups.length,
          programs: programs.length,
          visiblePrograms: programs.filter((item: any) => item.visible !== false)
            .length,
          testimonials: testimonials.length,
          visibleTestimonials: testimonials.filter(
            (item: any) => item.visible === true,
          ).length,
        });
        setRecentApplications(applications.slice(0, 4) as DashboardApplication[]);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        if (active) {
          setError(
            "Could not load dashboard stats. The links below still work.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const managementLinks = useMemo(
    () => adminLinks.filter((link) => link.href !== "/admin"),
    [],
  );

  const contentLinks = managementLinks.filter((link) =>
    ["/admin/homepage", "/admin/coaching", "/admin/app", "/admin/about"].includes(
      link.href,
    ),
  );

  const operationsLinks = managementLinks.filter((link) =>
    [
      "/admin/programs",
      "/admin/testimonials",
      "/admin/applications",
      "/admin/newsletter",
      "/admin/analytics",
      "/admin/settings",
    ].includes(link.href),
  );

  const needsAttention = [
    {
      label: "New applications",
      value: stats.newApplications,
      href: "/admin/applications",
      detail:
        stats.newApplications > 0
          ? "Review and move each applicant to the next status."
          : "No new applicants waiting.",
    },
    {
      label: "Hidden programs",
      value: Math.max(stats.programs - stats.visiblePrograms, 0),
      href: "/admin/programs",
      detail:
        stats.programs - stats.visiblePrograms > 0
          ? "Check drafts before publishing."
          : "All programs are currently visible.",
    },
    {
      label: "Hidden testimonials",
      value: Math.max(stats.testimonials - stats.visibleTestimonials, 0),
      href: "/admin/testimonials",
      detail:
        stats.testimonials - stats.visibleTestimonials > 0
          ? "Publish proof when it is ready."
          : "All testimonials are currently visible.",
    },
  ];

  function formatDate(createdAt: DashboardApplication["createdAt"]) {
    if (!createdAt?.seconds) return "No date";

    return new Date(createdAt.seconds * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  }

  return (
    <div className="adminDashboard">
      <div className="adminDashboardHero">
        <div>
          <span className="kicker">Control center</span>
          <h2>Website status at a glance.</h2>
          <p>
            Review new coaching leads, keep content current, and jump straight
            into the admin areas that matter most.
          </p>
        </div>

        {error && (
          <p className="adminErrorText">{error}</p>
        )}
      </div>

      <div className="adminMetricGrid">
        <Link className="adminMetricCard urgent" href="/admin/applications">
          <span>New applications</span>
          <strong>{loading ? "-" : stats.newApplications}</strong>
          <small>{loading ? "Loading" : `${stats.applications} total`}</small>
        </Link>

        <Link className="adminMetricCard" href="/admin/programs">
          <span>Programs visible</span>
          <strong>
            {loading ? "-" : `${stats.visiblePrograms}/${stats.programs}`}
          </strong>
          <small>Public program cards</small>
        </Link>

        <Link className="adminMetricCard" href="/admin/testimonials">
          <span>Proof published</span>
          <strong>
            {loading
              ? "-"
              : `${stats.visibleTestimonials}/${stats.testimonials}`}
          </strong>
          <small>Visible testimonials</small>
        </Link>

        <Link className="adminMetricCard" href="/admin/newsletter">
          <span>Newsletter</span>
          <strong>{loading ? "-" : stats.newsletterSignups}</strong>
          <small>Total signups</small>
        </Link>
      </div>

      <div className="adminDashboardGrid">
        <div className="adminCard adminCardHeader">
          <h3>Needs attention</h3>
          <p>Highest-signal checks before you edit anything else.</p>

          <div className="adminAttentionList">
            {needsAttention.map((item) => (
              <Link key={item.label} href={item.href}>
                <strong>{loading ? "-" : item.value}</strong>
                <span>
                  {item.label}
                  <small>{item.detail}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Recent applications</h3>
          <p>Latest athletes coming into the coaching pipeline.</p>

          <div className="adminRecentList">
            {loading ? (
              <span>Loading applications...</span>
            ) : recentApplications.length ? (
              recentApplications.map((application) => (
                <Link key={application.id} href="/admin/applications">
                  <span>
                    <strong>{application.name || "No name"}</strong>
                    <small>
                      {[application.coachingPriority, application.readiness]
                        .filter(Boolean)
                        .join(" · ") || application.email || "No triage yet"}
                    </small>
                  </span>
                  <em>{formatDate(application.createdAt)}</em>
                </Link>
              ))
            ) : (
              <span>No applications yet.</span>
            )}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Quick edits</h3>
          <p>Jump into the pages you are most likely to update.</p>

          <div className="adminQuickGrid">
            {contentLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Operations</h3>
          <p>Manage leads, proof, programs, audience, and site settings.</p>

          <div className="adminQuickGrid">
            {operationsLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
