import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { Section } from "@/components/Section";
import { CardGrid } from "@/components/CardGrid";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  coachingFeatures,
  coachingFor,
  problems,
  samplePrograms,
} from "@/lib/content";
import {
  getHomepageContent,
  getVisiblePrograms,
  getVisibleTestimonials,
} from "@/lib/firestore";

export default async function HomePage() {
  const content = await getHomepageContent();
  const testimonials = (await getVisibleTestimonials()) as any[];
  const programs = (await getVisiblePrograms()) as any[];

  const featuredTestimonials = testimonials
    .filter((testimonial) => testimonial.featured === true)
    .slice(0, 2);

  const testimonialsToShow =
    featuredTestimonials.length > 0
      ? featuredTestimonials
      : testimonials.slice(0, 2);

  const featuredPrograms = programs
    .filter((program) => program.featured === true)
    .slice(0, 3);

  const programsToShow =
    featuredPrograms.length > 0
      ? featuredPrograms
      : programs.length > 0
        ? programs.slice(0, 3)
        : samplePrograms.slice(0, 3);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="kicker">{content.heroKicker}</div>

            <h1>{content.heroHeadline}</h1>

            <p className="lead">{content.heroText}</p>

            <div className="actions">
              <Link
                className="btn btnPrimary"
                href={content.heroPrimaryCtaLink}
              >
                {content.heroPrimaryCtaLabel}
              </Link>

              <Link
                className="btn btnGhost"
                href={content.heroSecondaryCtaLink}
              >
                {content.heroSecondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div
            className="visualCard"
            aria-label="Weightlifting visual placeholder"
          >
            <div className="visualText">
              <strong>{content.heroVisualTitle}</strong>
              <span>{content.heroVisualText}</span>
            </div>
          </div>
        </div>
      </section>

      <Section
        kicker={content.brandKicker}
        title={content.brandTitle}
        text={content.brandText}
      >
        <CardGrid
          items={[
            [
              "Coaching",
              "The main product: individual programming, technical feedback, and competition preparation.",
            ],
            [
              "Attempt App",
              "A meet-day tool that supports the coaching system and helps manage attempts.",
            ],
            [
              "Programs",
              "Lower-cost digital training plans for lifters not ready for full coaching yet.",
            ],
          ]}
        />
      </Section>

      <Section
        kicker={content.problemKicker}
        title={content.problemTitle}
        text={content.problemText}
      >
        <ul className="list grid2">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </Section>

      <Section
        kicker={content.coachingKicker}
        title={content.coachingTitle}
        text={content.coachingText}
      >
        <CardGrid items={coachingFeatures} />

        <div className="actions">
          <Link className="btn btnPrimary" href="/apply">
            Apply for Coaching
          </Link>
        </div>
      </Section>

      <Section
        kicker={content.appKicker}
        title={content.appTitle}
        text={content.appText}
      >
        <div className="split">
          <div className="panel">
            <h3>{content.appPanelTitle}</h3>

            <p>{content.appPanelText}</p>

            <Link className="btn btnGhost" href="/app">
              Explore the App
            </Link>
          </div>

          <ul className="list">
            {[
              "Track planned attempts",
              "Follow declared attempts",
              "Manage attempt strategy",
              "Reduce warm-up room confusion",
              "Support coach-athlete meet-day decisions",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        kicker={content.fitKicker}
        title={content.fitTitle}
        text={content.fitText}
      >
        <ul className="list grid2">
          {coachingFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section
        kicker={content.proofKicker}
        title={content.proofTitle}
        text={content.proofText}
      >
        {testimonialsToShow.length > 0 ? (
          <div className="grid2">
            {testimonialsToShow.map((item) => (
              <article className="card" key={item.id ?? item.name}>
                {item.featured && (
                  <div className="kicker">Featured testimonial</div>
                )}

                <p>“{item.quote}”</p>

                <h3>{item.name}</h3>

                <p>{item.athleteContext ?? item.context}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel">
            <h3>No testimonials added yet.</h3>

            <p>
              Add testimonials in the admin dashboard and mark them as visible
              to show them here.
            </p>
          </div>
        )}
      </Section>

      <Section
        kicker={content.programsKicker}
        title={content.programsTitle}
        text={content.programsText}
      >
        <div className="grid3">
          {programsToShow.map((program) => (
            <article className="card" key={program.id ?? program.slug}>
              <div className="kicker">
                {program.featured ? "Featured program" : program.level}
              </div>

              <h3>{program.title}</h3>

              <p>{program.description}</p>

              <p>
                {program.duration} · {program.daysPerWeek ?? program.days}
              </p>
            </article>
          ))}
        </div>

        <div className="actions">
          <Link className="btn btnGhost" href="/programs">
            View Programs
          </Link>
        </div>
      </Section>

      <Section
        kicker={content.newsletterKicker}
        title={content.newsletterTitle}
        text={content.newsletterText}
      >
        <NewsletterForm />
      </Section>

      <Section title={content.finalCtaTitle} text={content.finalCtaText}>
        <Link className="btn btnPrimary" href={content.finalCtaButtonLink}>
          {content.finalCtaButtonLabel}
        </Link>
      </Section>
    </PublicLayout>
  );
}
