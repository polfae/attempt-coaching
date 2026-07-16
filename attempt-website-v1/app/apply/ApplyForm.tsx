"use client";

import { FormEvent, useMemo, useState } from "react";

type StepId = "details" | "lifting" | "fit";

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

const stepConfig: {
  id: StepId;
  eyebrow: string;
  title: string;
  description: string;
}[] = [
  {
    id: "details",
    eyebrow: "Step 01",
    title: "Your details",
    description: "Start with the basics so I know who is applying.",
  },
  {
    id: "lifting",
    eyebrow: "Step 02",
    title: "Your lifting",
    description:
      "Share your training background, current numbers, and coaching priority.",
  },
  {
    id: "fit",
    eyebrow: "Step 03",
    title: "Goals and fit",
    description:
      "This is where the coaching fit becomes clear. Specific answers help.",
  },
];

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const currentStep = stepConfig[activeStep];
  const progress = useMemo(
    () => ((activeStep + 1) / stepConfig.length) * 100,
    [activeStep],
  );

  function validateCurrentStep(form: HTMLFormElement) {
    const selector = `[data-step="${currentStep.id}"]`;
    const currentPanel = form.querySelector(selector);
    const requiredFields = Array.from(
      currentPanel?.querySelectorAll(
        "input[required], textarea[required], select[required]",
      ) ?? [],
    ) as Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

    const invalidField = requiredFields.find((field) => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      setStepError("Complete the required fields before moving on.");
      return false;
    }

    setStepError("");
    return true;
  }

  function goToNextStep(form: HTMLFormElement) {
    if (!validateCurrentStep(form)) {
      return;
    }

    setActiveStep((current) => Math.min(current + 1, stepConfig.length - 1));
  }

  function goToPreviousStep() {
    setStepError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!validateCurrentStep(form)) {
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    setStatus("saving");

    try {
      const response = await fetch("/api/coaching-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        throw new Error("Application submission failed.");
      }

      form.reset();
      setActiveStep(0);
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
          Thank you for your application. Your application has been received and
          will be reviewed shortly. You will be contacted by email once a
          decision has been made.
        </p>
      </div>
    );
  }

  return (
    <form className="panel form applyForm" onSubmit={onSubmit}>
      <div className="applyFormHeader">
        <div>
          <h2>Coaching application.</h2>
          <p>
            Clear answers help me understand whether coaching can genuinely help
            you right now.
          </p>
        </div>

        <div className="applyStepCount">
          {activeStep + 1}/{stepConfig.length}
        </div>
      </div>

      <div className="applyProgress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="applySteps" aria-label="Application progress">
        {stepConfig.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={index === activeStep ? "active" : ""}
            onClick={() => {
              if (index < activeStep) {
                setActiveStep(index);
                setStepError("");
              }
            }}
            disabled={index > activeStep}
          >
            <span>{step.eyebrow}</span>
            {step.title}
          </button>
        ))}
      </div>

      <div
        className={`applySection applyStepPanel ${
          activeStep === 0 ? "active" : ""
        }`}
        data-step="details"
        hidden={activeStep !== 0}
      >
        <div>
          <div className="kicker">{currentStep.eyebrow}</div>
          <h3>{stepConfig[0].title}</h3>
          <p>{stepConfig[0].description}</p>
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

      <div
        className={`applySection applyStepPanel ${
          activeStep === 1 ? "active" : ""
        }`}
        data-step="lifting"
        hidden={activeStep !== 1}
      >
        <div>
          <div className="kicker">{stepConfig[1].eyebrow}</div>
          <h3>{stepConfig[1].title}</h3>
          <p>{stepConfig[1].description}</p>
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

      <div
        className={`applySection applyStepPanel ${
          activeStep === 2 ? "active" : ""
        }`}
        data-step="fit"
        hidden={activeStep !== 2}
      >
        <div>
          <div className="kicker">{stepConfig[2].eyebrow}</div>
          <h3>{stepConfig[2].title}</h3>
          <p>{stepConfig[2].description}</p>
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
      </div>

      {stepError && <p className="applyStepError">{stepError}</p>}

      <div className="applyFormActions">
        <button
          className="btn btnGhost"
          type="button"
          onClick={goToPreviousStep}
          disabled={activeStep === 0 || status === "saving"}
        >
          Back
        </button>

        {activeStep < stepConfig.length - 1 ? (
          <button
            className="btn btnPrimary"
            type="button"
            onClick={(event) => goToNextStep(event.currentTarget.form!)}
          >
            Next Step
          </button>
        ) : (
          <button
            className="btn btnPrimary"
            type="submit"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Sending..." : "Submit Application"}
          </button>
        )}
      </div>

      {status === "error" && (
        <p>Something went wrong. Check Firebase configuration or try again.</p>
      )}
    </form>
  );
}
