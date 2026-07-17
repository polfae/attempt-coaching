"use client";

import { FormEvent, useMemo, useState } from "react";
import { countries, getCountryName } from "@/lib/countries";

type StepId = "personal" | "lifting" | "fit";

const stepConfig: {
  id: StepId;
  eyebrow: string;
  title: string;
  description: string;
}[] = [
  {
    id: "personal",
    eyebrow: "Step 01",
    title: "Personal information",
    description: "The essentials needed to review and organize applications.",
  },
  {
    id: "lifting",
    eyebrow: "Step 02",
    title: "Weightlifting background",
    description: "Training history, experience, and current best lifts.",
  },
  {
    id: "fit",
    eyebrow: "Step 03",
    title: "Goals and coaching fit",
    description: "What you want help with and whether coaching is the right fit.",
  },
];

const genderOptions = [
  ["male", "Male"],
  ["female", "Female"],
] as const;

const weightClassOptions = {
  male: [
    {
      group: "Senior / Junior - from Aug 1, 2026",
      classes: ["60 kg", "65 kg", "70 kg", "75 kg", "85 kg", "95 kg", "110 kg", "+110 kg"],
    },
    {
      group: "Youth",
      classes: ["56 kg", "60 kg", "65 kg", "71 kg", "79 kg", "88 kg", "98 kg", "+98 kg"],
    },
  ],
  female: [
    {
      group: "Senior / Junior - from Aug 1, 2026",
      classes: ["49 kg", "53 kg", "57 kg", "61 kg", "69 kg", "77 kg", "86 kg", "+86 kg"],
    },
    {
      group: "Youth",
      classes: ["44 kg", "48 kg", "53 kg", "58 kg", "63 kg", "69 kg", "77 kg", "+77 kg"],
    },
  ],
} as const;

const competitionExperienceOptions = [
  ["never_competed", "Never competed"],
  ["local", "Local competitions"],
  ["national", "National competitions"],
  ["international", "International competitions"],
] as const;

const yesNoOptions = [
  ["yes", "Yes"],
  ["no", "No"],
] as const;

const goalOptions = [
  ["improve_technique", "Improve technique"],
  ["increase_total", "Increase total"],
  ["prepare_for_competition", "Prepare for competition"],
  ["qualify_national", "Qualify for a national competition"],
  ["qualify_international", "Qualify for an international competition"],
  ["become_stronger", "Become stronger"],
  ["return_after_injury", "Return after injury"],
  ["other", "Other"],
] as const;

const liftFields = [
  ["snatch", "Snatch"],
  ["cleanAndJerk", "Clean and jerk"],
  ["jerk", "Jerk"],
  ["clean", "Clean"],
  ["backSquat", "Back squat"],
  ["frontSquat", "Front squat"],
] as const;

const sessionOptions = Array.from({ length: 10 }, (_, index) => index + 1);

type SelectOption = {
  value: string;
  label: string;
  group?: string;
};

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

function updateUnitSuffix(event: FormEvent<HTMLInputElement>) {
  event.currentTarget.parentElement?.style.setProperty(
    "--value-length",
    `${event.currentTarget.value.length || 0}ch`,
  );
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function defaultDateOfBirth() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 20);
  return `${padDatePart(date.getDate())}/${padDatePart(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
}

function parseDisplayDate(value: string) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

function CustomSelect({
  disabled = false,
  id,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  disabled?: boolean;
  id: string;
  name: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const groupedOptions = options.reduce<
    Array<{ group?: string; options: SelectOption[] }>
  >((groups, option) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.group === option.group) {
      lastGroup.options.push(option);
    } else {
      groups.push({ group: option.group, options: [option] });
    }

    return groups;
  }, []);

  return (
    <div
      className="customSelect"
      onBlur={() => {
        window.setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        id={id}
        type="button"
        className={!selectedOption ? "placeholder" : ""}
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}Menu`}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
      </button>
      <input type="hidden" name={name} value={value} />
      {open && !disabled && (
        <div className="countryResults customSelectMenu" id={`${id}Menu`} role="listbox">
          {groupedOptions.map((group) => (
            <div className="customSelectGroup" key={group.group ?? "default"}>
              {group.group && <strong>{group.group}</strong>}
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={option.value === value ? "active" : ""}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );
  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [dateOfBirthText, setDateOfBirthText] = useState(defaultDateOfBirth);
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "">(
    "",
  );
  const [selectedWeightClass, setSelectedWeightClass] = useState("");
  const [competitionExperience, setCompetitionExperience] = useState("");
  const [selectedTrainingSessions, setSelectedTrainingSessions] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [hasInjuries, setHasInjuries] = useState("");
  const [hadOnlineCoach, setHadOnlineCoach] = useState("");
  const [preparingForCompetition, setPreparingForCompetition] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = stepConfig[activeStep];
  const progress = useMemo(
    () => ((activeStep + 1) / stepConfig.length) * 100,
    [activeStep],
  );

  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase();

    if (!search && selectedCountry) {
      return countries.filter((country) => country.code === selectedCountry);
    }

    if (!search) return countries.slice(0, 8);

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(search) ||
        country.code.toLowerCase().includes(search),
    );
  }, [countrySearch]);

  const weightClassSelectOptions = useMemo<SelectOption[]>(() => {
    if (!selectedGender) return [];

    return weightClassOptions[selectedGender].flatMap((section) =>
      section.classes.map((weightClass) => ({
        group: section.group,
        label: weightClass,
        value: `${section.group} ${
          selectedGender === "male" ? "Men" : "Women"
        } ${weightClass}`,
      })),
    );
  }, [selectedGender]);

  function validateCurrentStep(form: HTMLFormElement) {
    const currentPanel = form.querySelector(`[data-step="${currentStep.id}"]`);
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

    if (currentStep.id === "personal") {
      const dateOfBirthField = form.elements.namedItem(
        "dateOfBirthDisplay",
      ) as HTMLInputElement | null;

      if (!parseDisplayDate(dateOfBirthText)) {
        dateOfBirthField?.setCustomValidity(
          "Enter date of birth as DD/MM/YYYY.",
        );
        dateOfBirthField?.reportValidity();
        dateOfBirthField?.setCustomValidity("");
        setStepError("Enter date of birth as DD/MM/YYYY.");
        return false;
      }
    }

    if (currentStep.id === "personal" && !selectedCountry) {
      setStepError("Choose a country from the country results.");
      return false;
    }

    if (
      currentStep.id === "personal" &&
      (!selectedGender || !selectedWeightClass)
    ) {
      setStepError("Choose your gender and current weight class.");
      return false;
    }

    if (
      currentStep.id === "lifting" &&
      (!competitionExperience || !selectedTrainingSessions)
    ) {
      setStepError("Choose your competition experience and sessions per week.");
      return false;
    }

    if (currentStep.id === "fit" && selectedGoals.length === 0) {
      setStepError("Select at least one main goal before submitting.");
      return false;
    }

    if (
      currentStep.id === "fit" &&
      (!hasInjuries || !hadOnlineCoach || !preparingForCompetition)
    ) {
      setStepError("Complete the required yes/no questions before submitting.");
      return false;
    }

    setStepError("");
    return true;
  }

  function goToNextStep(form: HTMLFormElement) {
    if (!validateCurrentStep(form)) return;
    setCompletedSteps((current) =>
      Array.from(
        new Set([
          ...current,
          activeStep,
          Math.min(activeStep + 1, stepConfig.length - 1),
        ]),
      ),
    );
    setActiveStep((current) => Math.min(current + 1, stepConfig.length - 1));
  }

  function goToPreviousStep() {
    setStepError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function toggleGoal(value: string) {
    setSelectedGoals((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!validateCurrentStep(form)) return;

    const formData = new FormData(form);
    const countryCode = String(formData.get("countryCode") || "");
    const dateOfBirth = parseDisplayDate(dateOfBirthText);

    if (!dateOfBirth) {
      setStepError("Enter date of birth as DD/MM/YYYY.");
      return;
    }

    setStatus("saving");

    try {
      const response = await fetch("/api/coaching-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: String(formData.get("firstName") || ""),
          lastName: String(formData.get("lastName") || ""),
          email: String(formData.get("email") || ""),
          dateOfBirth,
          gender: String(formData.get("gender") || ""),
          countryCode,
          country: getCountryName(countryCode),
          bodyweightKg: numberValue(formData, "bodyweightKg"),
          weightClass: String(formData.get("weightClass") || ""),
          weightliftingTrainingYears: numberValue(
            formData,
            "weightliftingTrainingYears",
          ),
          competitionExperience: String(
            formData.get("competitionExperience") || "",
          ),
          lifts: {
            snatch: numberValue(formData, "snatch"),
            cleanAndJerk: numberValue(formData, "cleanAndJerk"),
            clean: numberValue(formData, "clean"),
            jerk: numberValue(formData, "jerk"),
            backSquat: numberValue(formData, "backSquat"),
            frontSquat: numberValue(formData, "frontSquat"),
          },
          trainingDaysPerWeek: numberValue(formData, "trainingDaysPerWeek"),
          mainGoals: selectedGoals,
          otherGoal: String(formData.get("otherGoal") || ""),
          goalsDescription: String(formData.get("goalsDescription") || ""),
          struggle: String(formData.get("struggle") || ""),
          hasInjuries: formData.get("hasInjuries") === "yes",
          injuryDescription: String(formData.get("injuryDescription") || ""),
          whyAttempt: String(formData.get("whyAttempt") || ""),
          coachExpectations: String(formData.get("coachExpectations") || ""),
          hadOnlineCoach: formData.get("hadOnlineCoach") === "yes",
          preparingForCompetition:
            formData.get("preparingForCompetition") === "yes",
          competitionName: String(formData.get("competitionName") || ""),
          competitionDate: String(formData.get("competitionDate") || ""),
          consent: formData.get("consent") === "on",
        }),
      });

      if (!response.ok) {
        throw new Error("Application submission failed.");
      }

      form.reset();
      setSelectedCountry("");
      setCountrySearch("");
      setCountryDropdownOpen(false);
      setDateOfBirthText(defaultDateOfBirth());
      setSelectedGender("");
      setSelectedWeightClass("");
      setCompetitionExperience("");
      setSelectedTrainingSessions("");
      setSelectedGoals([]);
      setHasInjuries("");
      setHadOnlineCoach("");
      setPreparingForCompetition("");
      setCompletedSteps([]);
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
            A short structured application so I can review your lifting,
            background, and coaching fit properly.
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
            className={[
              index === activeStep ? "active" : "",
              completedSteps.includes(index) ? "completed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              if (index <= activeStep || completedSteps.includes(index)) {
                setActiveStep(index);
                setStepError("");
              }
            }}
            disabled={index > activeStep && !completedSteps.includes(index)}
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
        data-step="personal"
        hidden={activeStep !== 0}
      >
        <div>
          <div className="kicker">{stepConfig[0].eyebrow}</div>
          <h3>{stepConfig[0].title}</h3>
          <p>{stepConfig[0].description}</p>
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" required />
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" required />
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="dateOfBirth">Date of birth</label>
            <div className="inputWithSuffix dateInputWrap">
              <input
                id="dateOfBirth"
                name="dateOfBirthDisplay"
                type="text"
                inputMode="numeric"
                pattern="\d{2}/\d{2}/\d{4}"
                placeholder="16/07/2006"
                value={dateOfBirthText}
                onChange={(event) => setDateOfBirthText(event.target.value)}
                required
              />
              <span>DD/MM/YYYY</span>
            </div>
            <input
              type="hidden"
              name="dateOfBirth"
              value={parseDisplayDate(dateOfBirthText) ?? ""}
            />
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="gender">Gender</label>
            <CustomSelect
              id="gender"
              name="gender"
              value={selectedGender}
              onChange={(nextGender) => {
                setSelectedGender(nextGender as "male" | "female");
                setSelectedWeightClass("");
              }}
              options={genderOptions.map(([value, label]) => ({
                label,
                value,
              }))}
              placeholder="Choose one"
            />
          </div>

          <div className="field countryField">
            <label htmlFor="countrySearch">Country</label>
            <input
              id="countrySearch"
              value={countrySearch}
              onChange={(event) => {
                setCountrySearch(event.target.value);
                setSelectedCountry("");
                setCountryDropdownOpen(true);
              }}
              onFocus={() => setCountryDropdownOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setCountryDropdownOpen(false), 120);
              }}
              placeholder="Search countries..."
              autoComplete="off"
              role="combobox"
              aria-expanded={countryDropdownOpen}
              aria-controls="countryResults"
            />
            <input
              type="hidden"
              name="countryCode"
              value={selectedCountry}
              required
            />
            {countryDropdownOpen && (
              <div className="countryResults" id="countryResults" role="listbox">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      role="option"
                      aria-selected={selectedCountry === country.code}
                      className={
                        selectedCountry === country.code ? "active" : ""
                      }
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setSelectedCountry(country.code);
                        setCountrySearch(country.name);
                        setCountryDropdownOpen(false);
                      }}
                    >
                      {country.name}
                    </button>
                  ))
                ) : (
                  <span>No countries found</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="bodyweightKg">Current bodyweight</label>
            <div className="inputWithSuffix">
              <input
                id="bodyweightKg"
                name="bodyweightKg"
                type="number"
                min="1"
                step="0.1"
                placeholder="kg"
                onInput={updateUnitSuffix}
                required
              />
              <span>kg</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="weightClass">Current weight class</label>
            <CustomSelect
              id="weightClass"
              name="weightClass"
              value={selectedWeightClass}
              onChange={setSelectedWeightClass}
              options={weightClassSelectOptions}
              placeholder={selectedGender ? "Choose one" : "Choose gender first"}
              disabled={!selectedGender}
            />
          </div>
        </div>
      </div>

      <div
        className={`applySection applyStepPanel liftingStepPanel ${
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

        <div className="grid2 liftingBasics">
          <div className="field">
            <label htmlFor="weightliftingTrainingYears">
              Years training Olympic weightlifting
            </label>
            <input
              id="weightliftingTrainingYears"
              name="weightliftingTrainingYears"
              type="number"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="competitionExperience">Competition experience</label>
            <CustomSelect
              id="competitionExperience"
              name="competitionExperience"
              value={competitionExperience}
              onChange={setCompetitionExperience}
              options={competitionExperienceOptions.map(([value, label]) => ({
                label,
                value,
              }))}
              placeholder="Choose one"
            />
          </div>

          <div className="field trainingFrequencyField">
            <label htmlFor="trainingDaysPerWeek">Sessions per week</label>
            <CustomSelect
              id="trainingDaysPerWeek"
              name="trainingDaysPerWeek"
              value={selectedTrainingSessions}
              onChange={setSelectedTrainingSessions}
              options={sessionOptions.map((sessions) => ({
                label: `${sessions} ${sessions === 1 ? "session" : "sessions"}`,
                value: String(sessions),
              }))}
              placeholder="Choose one"
            />
          </div>
        </div>

        <div className="grid3 liftingMetrics">
          {liftFields.map(([name, label]) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <div className="inputWithSuffix">
                <input
                  id={name}
                  name={name}
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="kg"
                  onInput={updateUnitSuffix}
                  required
                />
                <span>kg</span>
              </div>
            </div>
          ))}
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

        <div className="field">
          <div className="fieldLabelRow">
            <label>Main goal</label>
            <span>Select one or more</span>
          </div>
          <div className="goalOptions">
            {goalOptions.map(([value, label]) => (
              <label
                key={value}
                className={selectedGoals.includes(value) ? "selected" : ""}
              >
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(value)}
                  onChange={() => toggleGoal(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedGoals.includes("other") && (
          <div className="field">
            <label htmlFor="otherGoal">Other goal</label>
            <input id="otherGoal" name="otherGoal" required />
          </div>
        )}

        <div className="field">
          <label htmlFor="goalsDescription">Describe your goals</label>
          <textarea id="goalsDescription" name="goalsDescription" required />
        </div>

        <div className="field">
          <label htmlFor="struggle">
            What do you currently struggle with the most?
          </label>
          <textarea id="struggle" name="struggle" required />
        </div>

        <div className="grid2">
          <div className="field">
            <label htmlFor="hasInjuries">
              Do you currently have any injuries or physical limitations?
            </label>
            <CustomSelect
              id="hasInjuries"
              name="hasInjuries"
              value={hasInjuries}
              onChange={setHasInjuries}
              options={yesNoOptions.map(([value, label]) => ({ label, value }))}
              placeholder="Choose one"
            />
          </div>

          <div className="field">
            <label htmlFor="hadOnlineCoach">
              Have you previously had an online coach?
            </label>
            <CustomSelect
              id="hadOnlineCoach"
              name="hadOnlineCoach"
              value={hadOnlineCoach}
              onChange={setHadOnlineCoach}
              options={yesNoOptions.map(([value, label]) => ({ label, value }))}
              placeholder="Choose one"
            />
          </div>
        </div>

        {hasInjuries === "yes" && (
          <div className="field">
            <label htmlFor="injuryDescription">
              Describe the injury or limitation
            </label>
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              required
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="whyAttempt">
            Why are you applying for coaching with Attempt?
          </label>
          <textarea id="whyAttempt" name="whyAttempt" required />
        </div>

        <div className="field">
          <label htmlFor="coachExpectations">
            What do you expect from your coach?
          </label>
          <textarea id="coachExpectations" name="coachExpectations" required />
        </div>

        <div className="field">
          <label htmlFor="preparingForCompetition">
            Are you currently preparing for a competition?
          </label>
          <CustomSelect
            id="preparingForCompetition"
            name="preparingForCompetition"
            value={preparingForCompetition}
            onChange={setPreparingForCompetition}
            options={yesNoOptions.map(([value, label]) => ({ label, value }))}
            placeholder="Choose one"
          />
        </div>

        {preparingForCompetition === "yes" && (
          <div className="grid2">
            <div className="field">
              <label htmlFor="competitionName">Competition name</label>
              <input id="competitionName" name="competitionName" />
            </div>

            <div className="field">
              <label htmlFor="competitionDate">Competition date</label>
              <input
                id="competitionDate"
                name="competitionDate"
                type="date"
                required
              />
            </div>
          </div>
        )}

        <label className="checkboxRow">
          <input name="consent" type="checkbox" required />
          <span>
            I agree that Attempt may store and process my submitted information
            for the purpose of reviewing my coaching application.
          </span>
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
