import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { Section } from "@/components/Section";
import { CardGrid } from "@/components/CardGrid";
import { coachingFeatures, coachingFor } from "@/lib/content";
import { getCoachingContent, getSiteSettings } from "@/lib/firestore";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([
    getCoachingContent(),
    getSiteSettings(),
  ]);

  const title = content.seoTitle || "Online Weightlifting Coaching | Attempt";
  const description =
    content.seoDescription ||
    settings.defaultSeoDescription ||
    "Premium online weightlifting coaching with programming, technical feedback, and competition preparation.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CoachingPage() {
  const content = await getCoachingContent();

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="kicker">{content.heroKicker}</div>

            <h1>{content.heroHeadline}</h1>
          </div>

          <div className="visualCard">
            <div className="visualText">
              <strong>{content.heroVisualTitle}</strong>
              <span>{content.heroVisualText}</span>
            </div>
          </div>
        </div>
      </section>

      <Section kicker={content.includedKicker} title={content.includedTitle}>
        <CardGrid items={coachingFeatures} />
      </Section>

      <Section
        kicker={content.processKicker}
        title={content.processTitle}
        text={content.processText}
      >
        <CardGrid
          columns={2}
          items={[
            [
              "1. Apply",
              "Submit your application with training background, goals, and current situation.",
            ],
            [
              "2. Review",
              "If the fit is right, we clarify your goals, schedule, and needs.",
            ],
            [
              "3. Build",
              "Your training is planned around your level, competition calendar, and technical priorities.",
            ],
            [
              "4. Adjust",
              "Feedback and training response guide updates across each block.",
            ],
          ]}
        />
      </Section>

      <Section kicker={content.fitKicker} title={content.fitTitle}>
        <ul className="list grid2">
          {coachingFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section kicker={content.faqKicker} title={content.faqTitle}>
        <CardGrid
          columns={2}
          items={[
            [
              "Do I need to compete?",
              "No, but the coaching system is built with competition standards and long-term development in mind.",
            ],
            [
              "Is this beginner friendly?",
              "Yes, if you are serious about learning the lifts properly and following a structured process.",
            ],
            [
              "Do coached athletes get the app?",
              "Yes. Active coached athletes receive access to the Attempt app.",
            ],
            [
              "Can I just buy a program?",
              "Yes. Digital programs are available separately for lifters not ready for full coaching.",
            ],
          ]}
        />
      </Section>
    </PublicLayout>
  );
}
