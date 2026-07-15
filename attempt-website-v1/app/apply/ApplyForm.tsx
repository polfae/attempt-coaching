"use client";

import { FormEvent, useState } from "react";
import { submitApplication } from "@/lib/firestore";

const fields = [
  ["name", "Name", "text", true],
  ["email", "Email", "email", true],
  ["country", "Country", "text", true],
  ["age", "Age", "number", false],
  ["bodyweight", "Bodyweight", "text", false],
  ["trainingAge", "Training age", "text", false],
  ["bestSnatch", "Best snatch", "text", false],
  ["bestCleanJerk", "Best clean & jerk", "text", false],
  ["bestTotal", "Best total", "text", false],
] as const;

const textareas = [
  ["competitionExperience", "Competition experience"],
  ["currentTraining", "Current coach or training setup"],
  ["goals", "Main goals"],
  ["injuries", "Injuries or limitations"],
  ["availability", "Training availability"],
  ["links", "Video links or social media links"],
  ["struggle", "What do you struggle with most?"],
  ["whyAttempt", "Why do you want Attempt Coaching?"],
  ["onlineCoachingBefore", "Have you used online coaching before?"],
] as const;

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    setStatus("saving");

    try {
      await submitApplication({
        name: data.name,
        email: data.email,
        country: data.country,
        age: data.age,
        bodyweight: data.bodyweight,
        trainingAge: data.trainingAge,
        bestSnatch: data.bestSnatch,
        bestCleanJerk: data.bestCleanJerk,
        bestTotal: data.bestTotal,
        competitionExperience: data.competitionExperience,
        currentTraining: data.currentTraining,
        goals: data.goals,
        injuries: data.injuries,
        availability: data.availability,
        links: data.links,
        struggle: data.struggle,
        whyAttempt: data.whyAttempt,
        onlineCoachingBefore: data.onlineCoachingBefore,
        consent: data.consent === "on",
      });

      form.reset();
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="panel">
        <h2>Application received.</h2>
        <p>
          I’ll review your answers and contact you if Attempt Coaching seems
          like a good fit.
        </p>
      </div>
    );
  }

  return (
    <form className="panel form applyForm" onSubmit={onSubmit}>
      <div className="grid3">
        {fields.map(([name, label, type, required]) => (
          <div className="field" key={name}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} required={required} />
          </div>
        ))}
      </div>

      {textareas.map(([name, label]) => (
        <div className="field" key={name}>
          <label htmlFor={name}>{label}</label>
          <textarea id={name} name={name} />
        </div>
      ))}

      <label className="checkboxRow">
        <input name="consent" type="checkbox" required />
        <span>I consent to being contacted about my coaching application.</span>
      </label>

      <button
        className="btn btnPrimary"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Sending..." : "Submit Application"}
      </button>

      {status === "error" && (
        <p>Something went wrong. Check Firebase configuration or try again.</p>
      )}
    </form>
  );
}
