import type { ChangeEvent, ReactNode } from "react";

type AdminFormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea" | "email" | "file";
  placeholder?: string;
  required?: boolean;
  help?: string;
  error?: string;
  children?: ReactNode;
  maxLength?: number;
};

function defaultHelp(id: string, label: string) {
  const name = `${id} ${label}`.toLowerCase();

  if (name.includes("kicker")) {
    return "Small uppercase intro text shown above a section heading.";
  }

  if (name.includes("headline")) {
    return "The main page headline. Keep it clear, specific, and easy to scan.";
  }

  if (name.includes("title")) {
    return "Section heading shown publicly on the website.";
  }

  if (name.includes("cta label") || name.includes("button label")) {
    return "Text shown on the button. Use a direct action, like Apply for Coaching.";
  }

  if (name.includes("cta link") || name.includes("button link")) {
    return "Where the button sends visitors. Internal links can look like /apply.";
  }

  if (name.includes("slug")) {
    return "URL-friendly page path. Use lowercase words separated by hyphens.";
  }

  if (name.includes("alt text")) {
    return "Describe the image for screen readers and accessibility.";
  }

  if (name.includes("image url")) {
    return "Paste a public image URL, usually copied from the Media library.";
  }

  if (name.includes("seo title")) {
    return "Fallback browser/search title when a page does not set its own.";
  }

  if (name.includes("seo description")) {
    return "Short search/social description. Keep it around 140-160 characters.";
  }

  if (
    name.includes("subtext") ||
    name.endsWith(" text") ||
    name.includes("description")
  ) {
    return "Supporting copy. Aim for one or two tight paragraphs.";
  }

  if (name.includes("email")) {
    return "Used for contact links and admin follow-up.";
  }

  if (name.includes("instagram")) {
    return "Full profile URL, including https://.";
  }

  return "";
}

export function AdminFormField({
  id,
  label,
  value,
  onChange,
  type = "input",
  placeholder,
  required,
  help,
  error,
  children,
  maxLength,
}: AdminFormFieldProps) {
  const helperText = help ?? defaultHelp(id, label);
  const helperId = helperText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    onChange(event.target.value);
  }

  return (
    <div className={`field adminField${error ? " hasError" : ""}`}>
      <div className="adminFieldLabelRow">
        <label htmlFor={id}>{label}</label>
        {maxLength && (
          <span>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          maxLength={maxLength}
        />
      ) : children ? (
        children
      ) : (
        <input
          id={id}
          type={type === "email" ? "email" : "text"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          maxLength={maxLength}
        />
      )}

      {error && (
        <p className="adminErrorText" id={errorId}>
          {error}
        </p>
      )}

      {helperText && (
        <p className="adminHelpText" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export function AdminSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="adminSectionHeader">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
