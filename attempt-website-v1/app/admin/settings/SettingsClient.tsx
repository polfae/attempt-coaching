"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  defaultSiteSettings,
  getSiteSettings,
  SiteSettings,
  updateSiteSettings,
} from "@/lib/firestore";
import { AdminFormField } from "@/components/AdminFormField";

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
      <div className="adminCardHeader">
        <h3>General site settings</h3>
        <p>
          Manage the basic information used across the Attempt website.
        </p>
      </div>

      <div className="grid2">
        <AdminFormField
          id="siteName"
          label="Site name"
          value={form.siteName}
          onChange={(value) => updateField("siteName", value)}
          placeholder="Attempt"
          required
          help="Brand name used in footer copyright and fallback metadata."
        />

        <AdminFormField
          id="contactEmail"
          label="Contact email"
          type="email"
          value={form.contactEmail}
          onChange={(value) => updateField("contactEmail", value)}
          placeholder="hello@attemptcoaching.com"
        />
      </div>

      <AdminFormField
        id="instagramUrl"
        label="Instagram URL"
        value={form.instagramUrl}
        onChange={(value) => updateField("instagramUrl", value)}
        placeholder="https://instagram.com/attempt..."
      />

      <AdminFormField
        id="footerText"
        label="Footer text"
        type="textarea"
        value={form.footerText}
        onChange={(value) => updateField("footerText", value)}
        placeholder="Short footer description..."
        help="Short brand description shown near the bottom of the site."
      />

      <div className="grid2">
        <AdminFormField
          id="defaultSeoTitle"
          label="Default SEO title"
          value={form.defaultSeoTitle}
          onChange={(value) => updateField("defaultSeoTitle", value)}
          placeholder="Attempt Coaching"
          maxLength={70}
        />

        <AdminFormField
          id="defaultSeoDescription"
          label="Default SEO description"
          type="textarea"
          value={form.defaultSeoDescription}
          onChange={(value) => updateField("defaultSeoDescription", value)}
          placeholder="Premium weightlifting coaching..."
          maxLength={160}
        />
      </div>

      <div className="adminSaveBar">
        <span>These settings affect multiple public pages.</span>
        <button className="btn btnPrimary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {saved && <span className="adminSaveStatus">Saved</span>}
      </div>
    </form>
  );
}
