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
            (item: any) => !item.status || item.status === "new",
          ).length,
          newsletterSignups: newsletterSignups.length,
          programs: programs.length,
          visiblePrograms: programs.filter((item: any) => item.visible === true)
            .length,
          testimonials: testimonials.length,
          visibleTestimonials: testimonials.filter(
            (item: any) => item.visible === true,
          ).length,
        });
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

  return (
    <div className="form">
      <div className="adminCard">
        <h3 style={{ marginTop: 0, color: "#16181d" }}>Control center</h3>
        <p style={{ marginBottom: 0 }}>
          Manage the public website, review applications, update content, and
          keep Attempt ready for athletes.
        </p>

        {error && (
          <p style={{ color: "#8a1f1f", fontWeight: 800, marginBottom: 0 }}>
            {error}
          </p>
        )}
      </div>

      <div className="adminGrid">
        <Link className="adminCard" href="/admin/applications">
          <span className="kicker">Applications</span>
          <h3>{loading ? "—" : stats.newApplications}</h3>
          <p>New coaching applications.</p>
        </Link>

        <Link className="adminCard" href="/admin/newsletter">
          <span className="kicker">Newsletter</span>
          <h3>{loading ? "—" : stats.newsletterSignups}</h3>
          <p>Total newsletter signups.</p>
        </Link>

        <Link className="adminCard" href="/admin/programs">
          <span className="kicker">Programs</span>
          <h3>
            {loading ? "—" : `${stats.visiblePrograms}/${stats.programs}`}
          </h3>
          <p>Visible programs.</p>
        </Link>

        <Link className="adminCard" href="/admin/testimonials">
          <span className="kicker">Testimonials</span>
          <h3>
            {loading
              ? "—"
              : `${stats.visibleTestimonials}/${stats.testimonials}`}
          </h3>
          <p>Visible testimonials.</p>
        </Link>
      </div>

      <div className="adminCard">
        <h3 style={{ marginTop: 0, color: "#16181d" }}>Quick edits</h3>
        <div className="adminGrid">
          {managementLinks.map((link) => (
            <Link className="adminCard" key={link.href} href={link.href}>
              <h3>{link.label}</h3>
              <p>{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
