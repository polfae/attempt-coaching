"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CoachingContent,
  getCoachingContent,
  updateCoachingContent,
} from "@/lib/firestore";
import { AdminFormField, AdminSectionHeader } from "@/components/AdminFormField";

const fallbackCoachingContent: CoachingContent = {
  heroKicker: "Attempt Coaching",
  heroHeadline: "Weightlifting coaching built for training and competition.",
  heroText:
    "A premium coaching process for lifters who want individual programming, technical feedback, and a clearer plan from training hall to platform.",
  heroPrimaryCtaLabel: "Apply for Coaching",
  heroPrimaryCtaLink: "/apply",
  heroVisualTitle: "Programming. Feedback. Platform plan.",
  heroVisualText: "One connected coaching system.",

  philosophyKicker: "Philosophy",
  philosophyTitle: "The athlete comes before the spreadsheet.",
  philosophyText:
    "Programming matters, but it only works when it responds to the athlete in front of it. Technique, recovery, competitions, and communication all shape the plan.",

  includedKicker: "Included",
  includedTitle: "What is included.",

  processKicker: "Process",
  processTitle: "How coaching works.",
  processText: "Simple structure, serious execution.",

  competitionKicker: "Competition prep",
  competitionTitle: "Meet day should not feel like guesswork.",
  competitionText:
    "Peaking, warm-ups, attempt strategy, and platform decisions are part of the coaching process — not something added at the end.",

  appKicker: "Attempt app included",
  appTitle: "The app supports the coaching system.",
  appText:
    "Active coached athletes get access to the Attempt app to help organize planned attempts, declared attempts, and warm-up room decisions.",

  fitKicker: "Fit",
  fitTitle: "Who coaching is for.",

  notForKicker: "Not for",
  notForTitle: "Who coaching is not for.",
  notForText:
    "Attempt Coaching is not for lifters who want a random PDF, instant template, or low-communication program without feedback.",

  availabilityKicker: "Availability",
  availabilityTitle: "Premium coaching is application-based.",
  availabilityText:
    "Pricing and availability can be added here when ready. The CTA should remain Apply for Coaching, not Buy Coaching.",
  availabilityCtaLabel: "Apply for Coaching",
  availabilityCtaLink: "/apply",

  faqKicker: "FAQ",
  faqTitle: "Common questions.",
};

type FieldConfig = {
  key: keyof CoachingContent;
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
      { key: "heroVisualTitle", label: "Hero visual title" },
      { key: "heroVisualText", label: "Hero visual text" },
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
    title: "Included",
    fields: [
      { key: "includedKicker", label: "Kicker" },
      { key: "includedTitle", label: "Title", type: "textarea" },
    ],
  },
  {
    title: "Process",
    fields: [
      { key: "processKicker", label: "Kicker" },
      { key: "processTitle", label: "Title", type: "textarea" },
      { key: "processText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Competition preparation",
    fields: [
      { key: "competitionKicker", label: "Kicker" },
      { key: "competitionTitle", label: "Title", type: "textarea" },
      { key: "competitionText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Attempt app included",
    fields: [
      { key: "appKicker", label: "Kicker" },
      { key: "appTitle", label: "Title", type: "textarea" },
      { key: "appText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Fit",
    fields: [
      { key: "fitKicker", label: "Kicker" },
      { key: "fitTitle", label: "Title", type: "textarea" },
    ],
  },
  {
    title: "Not for",
    fields: [
      { key: "notForKicker", label: "Kicker" },
      { key: "notForTitle", label: "Title", type: "textarea" },
      { key: "notForText", label: "Text", type: "textarea" },
    ],
  },
  {
    title: "Availability",
    fields: [
      { key: "availabilityKicker", label: "Kicker" },
      { key: "availabilityTitle", label: "Title", type: "textarea" },
      { key: "availabilityText", label: "Text", type: "textarea" },
      { key: "availabilityCtaLabel", label: "CTA label" },
      { key: "availabilityCtaLink", label: "CTA link" },
    ],
  },
  {
    title: "FAQ",
    fields: [
      { key: "faqKicker", label: "Kicker" },
      { key: "faqTitle", label: "Title", type: "textarea" },
    ],
  },
];

export function CoachingClient() {
  const [form, setForm] = useState<CoachingContent>(fallbackCoachingContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const content = await getCoachingContent();

      setForm({
        ...fallbackCoachingContent,
        ...(content || {}),
      });
    } catch (error) {
      console.error("Failed to load coaching content:", error);
      setError(
        "Could not load coaching content from Firebase. Showing default content instead.",
      );
      setForm(fallbackCoachingContent);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateField(key: keyof CoachingContent, value: string) {
    setForm((current) => ({
      ...(current || fallbackCoachingContent),
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await updateCoachingContent({
        ...fallbackCoachingContent,
        ...form,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save coaching content:", error);
      setError(
        "Could not save coaching content. Check Firestore rules and admin permissions.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adminCard">Loading coaching content...</div>;
  }

  const safeForm = {
    ...fallbackCoachingContent,
    ...(form || {}),
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="adminCard adminCardHeader">
        <h3>Coaching page content</h3>
        <p>
          Edit the main copy for the public coaching page.
        </p>

        {error && <p className="adminErrorText">{error}</p>}
      </div>

      {sections.map((section) => (
        <div className="adminCard form" key={section.title}>
          <AdminSectionHeader
            title={section.title}
            description="These fields control one section on the public coaching page."
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
        <span>Save when the public coaching page copy is ready.</span>
        <button className="btn btnPrimary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Coaching Page"}
        </button>

        {saved && <span className="adminSaveStatus">Saved</span>}
      </div>
    </form>
  );
}
