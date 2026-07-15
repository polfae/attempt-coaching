"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, hasFirebaseConfig } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggingIn, setLoggingIn] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoggingIn(true);

    try {
      if (!hasFirebaseConfig || !auth) {
        throw new Error("Firebase is not configured.");
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Could not log in. Check your email and password.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function onForgotPassword() {
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your admin email first, then click forgot password.");
      return;
    }

    setSendingReset(true);

    try {
      if (!hasFirebaseConfig || !auth) {
        throw new Error("Firebase is not configured.");
      }

      await sendPasswordResetEmail(auth, trimmedEmail);

      setMessage(
        "Password reset email sent. Check your inbox and spam folder.",
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      setError(
        "Could not send password reset email. Make sure the email is correct and exists in Firebase Authentication.",
      );
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <main className="adminLogin">
      <form className="loginCard" onSubmit={onSubmit}>
        <div>
          <div className="kicker">Attempt Admin</div>
          <h1>Log in</h1>
          <p>
            Sign in to manage coaching applications, content, programs,
            testimonials, newsletter signups, and site settings.
          </p>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <p
            style={{
              margin: 0,
              color: "#8a1f1f",
              fontWeight: 800,
            }}
          >
            {error}
          </p>
        )}

        {message && (
          <p
            style={{
              margin: 0,
              color: "#006b8f",
              fontWeight: 800,
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button className="btn btnPrimary" type="submit" disabled={loggingIn}>
            {loggingIn ? "Logging in..." : "Log in"}
          </button>

          <button
            className="btn btnGhost"
            type="button"
            onClick={onForgotPassword}
            disabled={sendingReset}
          >
            {sendingReset ? "Sending..." : "Forgot password?"}
          </button>
        </div>
      </form>
    </main>
  );
}
