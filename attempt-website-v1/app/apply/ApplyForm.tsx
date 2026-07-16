"use client";

import { FormEvent, useState } from "react";
import { submitApplication } from "@/lib/firestore";

const fields = [
  ["name", "Name", "text", true],
  ["email", "Email", "email", true],
  ["country", "Country", "text", true],
  ["age", "Age", "number", false],
  ["bodyweight", "Bodyweight", "text", false],
] as const;

const trainingFields = [
  ["trainingAge", "Training age", "text", false],
  ["bestSnatch", "Best snatch", "text", false],
  ["bestCleanJerk", "Best clean & jerk", "text", false],
  ["bestTotal", "Best total", "text", false],
  ["nextCompetition", "Next competition", "text", false],
] as const;

const textareas = [
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
        coachingPriority: data.coachingPriority,
        readiness: data.readiness,
        nextCompetition: data.nextCompetition,
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
          I’ll review your training background, goals, and coaching fit. If
          Attempt Coaching looks like the right next step, I’ll contact you with
          the next move.
        </p>
      </div>
    );
  }

  return (
    <form className="panel form applyForm" onSubmit={onSubmit}>
      <div>
        <h2>Coaching application.</h2>
        <p>
          Clear answers help me understand whether coaching can genuinely help
          you right now.
        </p>
      </div>

      <div className="applySection">
        <div>
          <div className="kicker">Step 01</div>
          <h3>Your details</h3>
        </div>

        <div className="grid3">
          {fields.map(([name, label, type, required]) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input id={name} name={name} type={type} required={required} />
            </div>
          ))}
        </div>
      </div>

      <div className="applySection">
        <div>
          <div className="kicker">Step 02</div>
          <h3>Your lifting</h3>
        </div>

        <div className="grid3">
          {trainingFields.map(([name, label, type, required]) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input id={name} name={name} type={type} required={required} />
            </div>
          ))}
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="coachingPriority">Main coaching priority</label>
            <select id="coachingPriority" name="coachingPriority">
              <option value="">Choose one</option>
              <option>Technical feedback</option>
              <option>Individual programming</option>
              <option>Competition preparation</option>
              <option>Long-term development</option>
              <option>All of the above</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="readiness">Readiness</label>
            <select id="readiness" name="readiness">
              <option value="">Choose one</option>
              <option>Ready to start now</option>
              <option>Preparing for a future start</option>
              <option>Still deciding</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="competitionExperience">Competition experience</label>
          <textarea id="competitionExperience" name="competitionExperience" />
        </div>
      </div>

      <div className="applySection">
        <div>
          <div className="kicker">Step 03</div>
          <h3>Goals and fit</h3>
        </div>

        {textareas.map(([name, label]) => (
          <div className="field" key={name}>
            <label htmlFor={name}>{label}</label>
            <textarea id={name} name={name} />
          </div>
        ))}
      </div>

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
