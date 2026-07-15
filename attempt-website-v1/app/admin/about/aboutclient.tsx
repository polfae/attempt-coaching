"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AboutContent,
  defaultAboutContent,
  getAboutContent,
  updateAboutContent,
} from "@/lib/firestore";

const fallbackAboutContent: AboutContent = defaultAboutContent;

type FieldConfig = {
  key: keyof AboutContent;
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
    ],
  },
  {
    title: "Founder",
    fields: [
      { key: "founderKicker", label: "Kicker" },
      { key: "founderTitle", label: "Title", type: "textarea" },
      { key: "founderText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Background",
    fields: [
      { key: "backgroundKicker", label: "Kicker" },
      { key: "backgroundTitle", label: "Title", type: "textarea" },
      { key: "backgroundText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Philosophy",
    fields: [
      { key: "philosophyKicker", label: "Kicker" },
      { key: "philosophyTitle", label: "Title", type: "textarea" },
      { key: "philosophyText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Weightlifting focus",
    fields: [
      { key: "weightliftingKicker", label: "Kicker" },
      { key: "weightliftingTitle", label: "Title", type: "textarea" },
      { key: "weightliftingText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Why Attempt exists",
    fields: [
      { key: "whyKicker", label: "Kicker" },
      { key: "whyTitle", label: "Title", type: "textarea" },
      { key: "whyText", label: "Text", type: "textarea" },
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

export function AboutClient() {
  const [form, setForm] = useState<AboutContent>(fallbackAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const content = await getAboutContent();

      setForm({
        ...fallbackAboutContent,
        ...(content || {}),
      });
    } catch (error) {
      console.error("Failed to load about content:", error);
      setError(
        "Could not load about content from Firebase. Showing default content instead.",
      );
      setForm(fallbackAboutContent);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateField(key: keyof AboutContent, value: string) {
    setForm((current) => ({
      ...(current || fallbackAboutContent),
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateAboutContent({
        ...fallbackAboutContent,
        ...form,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save about content:", error);
      setError(
        "Could not save about content. Check Firestore rules and admin permissions.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adminCard">Loading about page content...</div>;
  }

  const safeForm = {
    ...fallbackAboutContent,
    ...(form || {}),
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="adminCard">
        <h3 style={{ margin: 0, color: "#16181d" }}>About page content</h3>
        <p style={{ marginBottom: 0 }}>Edit the public About page.</p>

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
            {saving ? "Saving..." : "Save About Page"}
          </button>

          {saved && (
            <span style={{ color: "#006b8f", fontWeight: 800 }}>Saved</span>
          )}
        </div>
      </div>
    </form>
  );
}
