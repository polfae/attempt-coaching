"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  defaultSiteSettings,
  getSiteSettings,
  SiteSettings,
  updateSiteSettings,
} from "@/lib/firestore";

export function SettingsClient() {
  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadSettings() {
    setLoading(true);
    const settings = await getSiteSettings();
    setForm(settings);
    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function updateField<K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    await updateSiteSettings(form);

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  if (loading) {
    return <div className="adminCard">Loading settings...</div>;
  }

  return (
    <form className="adminCard form" onSubmit={onSubmit}>
      <div>
        <h3 style={{ margin: 0, color: "#16181d" }}>General site settings</h3>
        <p style={{ marginBottom: 0 }}>
          Manage the basic information used across the Attempt website.
        </p>
      </div>

      <div className="grid2">
        <div className="field">
          <label htmlFor="siteName">Site name</label>
          <input
            id="siteName"
            value={form.siteName}
            onChange={(event) => updateField("siteName", event.target.value)}
            placeholder="Attempt"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="contactEmail">Contact email</label>
          <input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(event) =>
              updateField("contactEmail", event.target.value)
            }
            placeholder="hello@attemptcoaching.com"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="instagramUrl">Instagram URL</label>
        <input
          id="instagramUrl"
          value={form.instagramUrl}
          onChange={(event) => updateField("instagramUrl", event.target.value)}
          placeholder="https://instagram.com/attempt..."
        />
      </div>

      <div className="field">
        <label htmlFor="footerText">Footer text</label>
        <textarea
          id="footerText"
          value={form.footerText}
          onChange={(event) => updateField("footerText", event.target.value)}
          placeholder="Short footer description..."
        />
      </div>

      <div className="grid2">
        <div className="field">
          <label htmlFor="defaultSeoTitle">Default SEO title</label>
          <input
            id="defaultSeoTitle"
            value={form.defaultSeoTitle}
            onChange={(event) =>
              updateField("defaultSeoTitle", event.target.value)
            }
            placeholder="Attempt Coaching"
          />
        </div>

        <div className="field">
          <label htmlFor="defaultSeoDescription">Default SEO description</label>
          <textarea
            id="defaultSeoDescription"
            value={form.defaultSeoDescription}
            onChange={(event) =>
              updateField("defaultSeoDescription", event.target.value)
            }
            placeholder="Premium weightlifting coaching..."
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button className="btn btnPrimary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {saved && (
          <span style={{ color: "#006b8f", fontWeight: 800 }}>Saved</span>
        )}
      </div>
    </form>
  );
}
