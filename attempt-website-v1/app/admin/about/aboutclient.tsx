"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AboutContent,
  defaultAboutContent,
  getAboutContent,
  updateAboutContent,
} from "@/lib/firestore";
import { AdminFormField, AdminSectionHeader } from "@/components/AdminFormField";

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
      <div className="adminCard adminCardHeader">
        <h3>About page content</h3>
        <p>Edit the public About page.</p>

        {error && <p className="adminErrorText">{error}</p>}
      </div>

      {sections.map((section) => (
        <div className="adminCard form" key={section.title}>
          <AdminSectionHeader
            title={section.title}
            description="These fields control one content block on the public About page."
          />

          <div className="grid2">
            {section.fields.map((field) => (
              <AdminFormField
                key={String(field.key)}
                id={String(field.key)}
                label={field.label}
                type={field.type === "textarea" ? "textarea" : "input"}
                value={String(safeForm[field.key] ?? "")}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="adminCard adminSaveBar">
        <span>Save when the About page is ready to publish.</span>
        <button className="btn btnPrimary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save About Page"}
        </button>

        {saved && <span className="adminSaveStatus">Saved</span>}
      </div>
    </form>
  );
}
