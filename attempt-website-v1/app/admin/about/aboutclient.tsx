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
    title: "Attempt: page introduction",
    fields: [
      { key: "heroKicker", label: "Introductory label" },
      { key: "heroHeadline", label: "Main heading", type: "textarea" },
      { key: "heroText", label: "Main introduction", type: "textarea" },
    ],
  },
  {
    title: "Attempt: what it stands for",
    fields: [
      { key: "whyKicker", label: "Kicker" },
      { key: "whyTitle", label: "Heading", type: "textarea" },
      { key: "whyText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Attempt: meaning behind the name",
    fields: [
      { key: "weightliftingKicker", label: "Kicker" },
      { key: "weightliftingTitle", label: "Heading", type: "textarea" },
      { key: "weightliftingText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Attempt: coaching approach",
    fields: [
      { key: "philosophyKicker", label: "Kicker" },
      { key: "philosophyTitle", label: "Heading", type: "textarea" },
      { key: "philosophyText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Transition into The Coach",
    fields: [
      { key: "transitionText", label: "Transition text", type: "textarea" },
    ],
  },
  {
    title: "The Coach: introduction",
    fields: [
      { key: "founderKicker", label: "Section label" },
      { key: "founderTitle", label: "Coach heading", type: "textarea" },
      { key: "founderText", label: "Coach introduction", type: "textarea" },
    ],
  },
  {
    title: "The Coach: coach and athlete",
    fields: [
      { key: "backgroundKicker", label: "Kicker" },
      { key: "backgroundTitle", label: "Heading", type: "textarea" },
      { key: "backgroundText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "The Coach: credentials and experience",
    fields: [
      { key: "credentialsKicker", label: "Kicker" },
      { key: "credentialsTitle", label: "Heading", type: "textarea" },
      {
        key: "credentialsText",
        label: "Experience entries",
        type: "textarea",
      },
    ],
  },
  {
    title: "The Coach: closing statement",
    fields: [
      { key: "closingKicker", label: "Kicker" },
      { key: "closingTitle", label: "Heading", type: "textarea" },
      { key: "closingText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Call to action",
    fields: [
      { key: "finalCtaTitle", label: "CTA heading", type: "textarea" },
      { key: "finalCtaText", label: "CTA text", type: "textarea" },
      { key: "finalCtaButtonLabel", label: "Button label" },
      { key: "finalCtaButtonLink", label: "Button destination" },
      { key: "finalCtaSecondaryLabel", label: "Secondary button label" },
      { key: "finalCtaSecondaryLink", label: "Secondary button destination" },
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
