"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  defaultHomepageContent,
  getHomepageContent,
  HomepageContent,
  updateHomepageContent,
} from "@/lib/firestore";

type FieldConfig = {
  key: keyof HomepageContent;
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
    title: "Brand positioning",
    fields: [
      { key: "brandKicker", label: "Kicker" },
      { key: "brandTitle", label: "Title", type: "textarea" },
      { key: "brandText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Problem section",
    fields: [
      { key: "problemKicker", label: "Kicker" },
      { key: "problemTitle", label: "Title", type: "textarea" },
      { key: "problemText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Coaching section",
    fields: [
      { key: "coachingKicker", label: "Kicker" },
      { key: "coachingTitle", label: "Title", type: "textarea" },
      { key: "coachingText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "App section",
    fields: [
      { key: "appKicker", label: "Kicker" },
      { key: "appTitle", label: "Title", type: "textarea" },
      { key: "appText", label: "Text", type: "textarea" },
      { key: "appPanelTitle", label: "Panel title", type: "textarea" },
      { key: "appPanelText", label: "Panel text", type: "textarea" },
    ],
  },
  {
    title: "Fit section",
    fields: [
      { key: "fitKicker", label: "Kicker" },
      { key: "fitTitle", label: "Title", type: "textarea" },
      { key: "fitText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Proof section",
    fields: [
      { key: "proofKicker", label: "Kicker" },
      { key: "proofTitle", label: "Title", type: "textarea" },
      { key: "proofText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Programs section",
    fields: [
      { key: "programsKicker", label: "Kicker" },
      { key: "programsTitle", label: "Title", type: "textarea" },
      { key: "programsText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Newsletter section",
    fields: [
      { key: "newsletterKicker", label: "Kicker" },
      { key: "newsletterTitle", label: "Title", type: "textarea" },
      { key: "newsletterText", label: "Text", type: "textarea" },
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

export function HomepageClient() {
  const [form, setForm] = useState<HomepageContent>(defaultHomepageContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadContent() {
    setLoading(true);
    const content = await getHomepageContent();
    setForm(content);
    setLoading(false);
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateField(key: keyof HomepageContent, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    await updateHomepageContent(form);

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  if (loading) {
    return <div className="adminCard">Loading homepage content...</div>;
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="adminCard">
        <h3 style={{ margin: 0, color: "#16181d" }}>Homepage content</h3>
        <p style={{ marginBottom: 0 }}>
          Edit the main homepage copy. These fields update the public homepage.
        </p>
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
                    value={String(form[field.key] ?? "")}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                  />
                ) : (
                  <input
                    id={String(field.key)}
                    value={String(form[field.key] ?? "")}
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
            {saving ? "Saving..." : "Save Homepage"}
          </button>

          {saved && (
            <span style={{ color: "#006b8f", fontWeight: 800 }}>Saved</span>
          )}
        </div>
      </div>
    </form>
  );
}
