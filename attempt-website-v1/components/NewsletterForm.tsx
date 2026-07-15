"use client";

import { FormEvent, useState } from "react";
import { submitNewsletter } from "@/lib/firestore";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setStatus("saving");

    try {
      await submitNewsletter(email.trim());

      setEmail("");
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form className="panel form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="newsletterEmail">Email</label>
        <input
          id="newsletterEmail"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <button
        className="btn btnPrimary"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Joining..." : "Join the List"}
      </button>

      {status === "sent" && <p style={{ margin: 0 }}>You’re on the list.</p>}

      {status === "error" && (
        <p style={{ margin: 0 }}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
