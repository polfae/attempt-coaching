"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AppContent,
  defaultAppContent,
  getAppContent,
  updateAppContent,
} from "@/lib/firestore";

const fallbackAppContent: AppContent = defaultAppContent;

type FieldConfig = {
  key: keyof AppContent;
  label: string;
  type?: "input" | "textarea";
};

const sections: { title: string; fields: FieldConfig[] }[] = [
  {
    title: "Hero",
    fields: [
      { key: "heroKicker", label: "Kicker" },
      { key: "heroHeadline", label: "Headline", type: "textarea" },
      { key: "heroText", label: "Subtext", type: "textarea" },
      { key: "heroPrimaryCtaLabel", label: "Primary CTA label" },
      { key: "heroPrimaryCtaLink", label: "Primary CTA link" },
      { key: "heroSecondaryCtaLabel", label: "Secondary CTA label" },
      { key: "heroSecondaryCtaLink", label: "Secondary CTA link" },
      { key: "heroVisualTitle", label: "Hero visual title" },
      { key: "heroVisualText", label: "Hero visual text" },
    ],
  },
  {
    title: "Purpose",
    fields: [
      { key: "valueKicker", label: "Kicker" },
      { key: "valueTitle", label: "Title", type: "textarea" },
      { key: "valueText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Features",
    fields: [
      { key: "featuresKicker", label: "Kicker" },
      { key: "featuresTitle", label: "Title", type: "textarea" },
      { key: "featuresText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Coaching connection",
    fields: [
      { key: "coachingKicker", label: "Kicker" },
      { key: "coachingTitle", label: "Title", type: "textarea" },
      { key: "coachingText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Access",
    fields: [
      { key: "accessKicker", label: "Kicker" },
      { key: "accessTitle", label: "Title", type: "textarea" },
      { key: "accessText", label: "Text", type: "textarea" },
      { key: "accessCtaLabel", label: "CTA label" },
      { key: "accessCtaLink", label: "CTA link" },
    ],
  },
  {
    title: "Future access",
    fields: [
      { key: "futureKicker", label: "Kicker" },
      { key: "futureTitle", label: "Title", type: "textarea" },
      { key: "futureText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Final CTA",
    fields: [
      { key: "finalCtaTitle", label: "Title", type: "textarea" },
      { key: "finalCtaText", label: "Text", type: "textarea" },
      { key: "finalCtaButtonLabel", label: "Button label" },
      { key: "finalCtaButtonLink", label: "Button link" },
    ],
  },
];

export function AppClient() {
  const [form, setForm] = useState<AppContent>(fallbackAppContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const content = await getAppContent();

      setForm({
        ...fallbackAppContent,
        ...(content || {}),
      });
    } catch (error) {
      console.error("Failed to load app content:", error);
      setError(
        "Could not load app content from Firebase. Showing default content instead.",
      );
      setForm(fallbackAppContent);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateField(key: keyof AppContent, value: string) {
    setForm((current) => ({
      ...(current || fallbackAppContent),
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateAppContent({
        ...fallbackAppContent,
        ...form,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save app content:", error);
      setError(
        "Could not save app content. Check Firestore rules and admin permissions.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adminCard">Loading app page content...</div>;
  }

  const safeForm = {
    ...fallbackAppContent,
    ...(form || {}),
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="adminCard">
        <h3 style={{ margin: 0, color: "#16181d" }}>App page content</h3>
        <p style={{ marginBottom: 0 }}>Edit the public Attempt app page.</p>

        {error && (
          <p
            style={{
              marginTop: 14,
              color: "#8a1f1f",
              fontWeight: 800,
            }}
          >
            {error}
          </p>
        )}
      </div>

      {sections.map((section) => (
        <div className="adminCard form" key={section.title}>
          <h3 style={{ margin: 0, color: "#16181d" }}>{section.title}</h3>

          <div className="grid2">
            {section.fields.map((field) => (
              <div className="field" key={String(field.key)}>
                <label htmlFor={String(field.key)}>{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    id={String(field.key)}
                    value={String(safeForm[field.key] ?? "")}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                  />
                ) : (
                  <input
                    id={String(field.key)}
                    value={String(safeForm[field.key] ?? "")}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="adminCard">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn btnPrimary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save App Page"}
          </button>

          {saved && (
            <span style={{ color: "#006b8f", fontWeight: 800 }}>Saved</span>
          )}
        </div>
      </div>
    </form>
  );
}
