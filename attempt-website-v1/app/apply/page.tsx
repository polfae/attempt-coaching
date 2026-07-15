import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Apply for Coaching | Attempt",
  description:
    "Apply for Attempt Coaching, a premium online weightlifting coaching process built around your training, technique, and competition goals.",
  openGraph: {
    title: "Apply for Coaching | Attempt",
    description:
      "Apply for Attempt Coaching, a premium online weightlifting coaching process built around your training, technique, and competition goals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Coaching | Attempt",
    description:
      "Apply for Attempt Coaching, a premium online weightlifting coaching process built around your training, technique, and competition goals.",
  },
};

export default function ApplyPage() {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">Coaching application</div>
          <h1>Apply for Attempt Coaching.</h1>
          <p className="lead">
            This is not an instant checkout. The application helps decide
            whether Attempt Coaching is the right fit for your goals, training
            situation, and competition plans.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ApplyForm />
        </div>
      </section>
    </PublicLayout>
  );
}
