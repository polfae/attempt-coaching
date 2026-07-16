"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalyticsEvent, getAnalyticsEvents } from "@/lib/firestore";

type RangeOption = "7" | "30" | "90";

function getEventTime(event: AnalyticsEvent) {
  const value = event.createdAt as
    | { seconds?: number; toDate?: () => Date }
    | Date
    | undefined;

  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value.seconds) return value.seconds * 1000;
  return 0;
}

function percent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
}

function groupCount<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((current, item) => {
    current[item || "Unknown"] = (current[item || "Unknown"] || 0) + 1;
    return current;
  }, {});
}

function topEntries(values: Record<string, number>, total: number) {
  return Object.entries(values)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({
      label,
      value,
      share: total ? (value / total) * 100 : 0,
    }));
}

export function AnalyticsClient() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [range, setRange] = useState<RangeOption>("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setError("");

      try {
        const data = await getAnalyticsEvents(1500);
        if (active) setEvents(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        if (active) {
          setError("Could not load analytics. Check Firebase permissions.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const rangeStart = Date.now() - Number(range) * 24 * 60 * 60 * 1000;
    const filtered = events.filter((event) => getEventTime(event) >= rangeStart);
    const visitors = new Set(filtered.map((event) => event.visitorId));
    const sessions = new Map<
      string,
      { views: number; engaged: boolean; lastSeen: number }
    >();

    filtered.forEach((event) => {
      const existing = sessions.get(event.sessionId) ?? {
        views: 0,
        engaged: false,
        lastSeen: 0,
      };

      existing.views += 1;
      existing.engaged = existing.engaged || event.engaged === true;
      existing.lastSeen = Math.max(existing.lastSeen, getEventTime(event));
      sessions.set(event.sessionId, existing);
    });

    const bouncedSessions = Array.from(sessions.values()).filter(
      (session) => session.views === 1 && !session.engaged,
    ).length;

    const pageCounts = groupCount(filtered.map((event) => event.path || "/"));
    const sourceCounts = groupCount(
      filtered.map((event) => event.source || "direct"),
    );
    const deviceCounts = groupCount(
      filtered.map((event) => event.device || "desktop"),
    );
    const countryCounts = groupCount(
      filtered.map((event) => event.country || "Unknown"),
    );
    const timezoneCounts = groupCount(
      filtered.map((event) => event.timezone || "Unknown"),
    );

    const recent = [...filtered]
      .sort((a, b) => getEventTime(b) - getEventTime(a))
      .slice(0, 8);

    return {
      filtered,
      visitors: visitors.size,
      pageViews: filtered.length,
      sessions: sessions.size,
      bounceRate: sessions.size ? (bouncedSessions / sessions.size) * 100 : 0,
      viewsPerSession: sessions.size ? filtered.length / sessions.size : 0,
      topPages: topEntries(pageCounts, filtered.length),
      sources: topEntries(sourceCounts, filtered.length),
      devices: topEntries(deviceCounts, filtered.length),
      countries: topEntries(countryCounts, filtered.length),
      timezones: topEntries(timezoneCounts, filtered.length),
      recent,
    };
  }, [events, range]);

  return (
    <div className="adminAnalytics">
      <div className="adminDashboardHero">
        <div>
          <span className="kicker">Visitor analytics</span>
          <h2>Understand what people are doing on the site.</h2>
          <p>
            First-party analytics for page views, visitors, sessions, bounce
            rate, sources, visitor locations, and device type.
          </p>
        </div>

        <div className="field analyticsRange">
          <label htmlFor="analyticsRange">Date range</label>
          <select
            id="analyticsRange"
            value={range}
            onChange={(event) => setRange(event.target.value as RangeOption)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {error && <p className="adminErrorText">{error}</p>}

      <div className="adminMetricGrid">
        <div className="adminMetricCard">
          <span>Visitors</span>
          <strong>{loading ? "-" : analytics.visitors}</strong>
          <small>Unique anonymous visitors</small>
        </div>
        <div className="adminMetricCard">
          <span>Page views</span>
          <strong>{loading ? "-" : analytics.pageViews}</strong>
          <small>Total public page views</small>
        </div>
        <div className="adminMetricCard">
          <span>Bounce rate</span>
          <strong>{loading ? "-" : percent(analytics.bounceRate)}</strong>
          <small>Single-page non-engaged sessions</small>
        </div>
        <div className="adminMetricCard">
          <span>Views/session</span>
          <strong>
            {loading ? "-" : analytics.viewsPerSession.toFixed(1)}
          </strong>
          <small>{loading ? "Loading" : `${analytics.sessions} sessions`}</small>
        </div>
      </div>

      <div className="adminAnalyticsGrid">
        <div className="adminCard adminCardHeader">
          <h3>Top pages</h3>
          <p>Most viewed public pages in the selected range.</p>
          <div className="analyticsBarList">
            {analytics.topPages.length ? (
              analytics.topPages.map((item) => (
                <div key={item.label}>
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.value}</em>
                  </span>
                  <div>
                    <i style={{ width: `${Math.max(item.share, 4)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p>No page views yet.</p>
            )}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Traffic sources</h3>
          <p>Where visits appear to come from.</p>
          <div className="analyticsBarList">
            {analytics.sources.length ? (
              analytics.sources.map((item) => (
                <div key={item.label}>
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.value}</em>
                  </span>
                  <div>
                    <i style={{ width: `${Math.max(item.share, 4)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p>No source data yet.</p>
            )}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Visitor locations</h3>
          <p>Approximate location based on browser locale, not IP address.</p>
          <div className="analyticsLocationList">
            {analytics.countries.length ? (
              analytics.countries.map((item) => (
                <div key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value} views</span>
                  <small>{percent(item.share)}</small>
                </div>
              ))
            ) : (
              <p>No location data yet.</p>
            )}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Timezones</h3>
          <p>Useful for spotting when and where visitors are active.</p>
          <div className="analyticsBarList">
            {analytics.timezones.length ? (
              analytics.timezones.map((item) => (
                <div key={item.label}>
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.value}</em>
                  </span>
                  <div>
                    <i style={{ width: `${Math.max(item.share, 4)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p>No timezone data yet.</p>
            )}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Devices</h3>
          <p>Device mix by page view.</p>
          <div className="analyticsDeviceGrid">
            {analytics.devices.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <small>{percent(item.share)}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="adminCard adminCardHeader">
          <h3>Recent page views</h3>
          <p>Latest tracked public visits.</p>
          <div className="adminRecentList">
            {analytics.recent.length ? (
              analytics.recent.map((event) => (
                <span key={event.id ?? `${event.sessionId}-${event.path}`}>
                  <strong>{event.path}</strong>
                  <small>
                    {[
                      event.country || "Unknown",
                      event.source || "direct",
                      event.device || "desktop",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </small>
                </span>
              ))
            ) : (
              <span>No page views tracked yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
