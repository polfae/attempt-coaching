import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { getAboutContent, getSiteSettings } from "@/lib/firestore";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);

  const title = content.seoTitle || "About Attempt | Weightlifting Coaching";
  const description =
    content.seoDescription ||
    settings.defaultSeoDescription ||
    "Learn about Attempt, a weightlifting-only coaching brand built around serious training and better competition preparation.";

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

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">{content.heroKicker}</div>

          <h1>{content.heroHeadline}</h1>

          <p className="lead">{content.heroText}</p>

          <div className="actions">
            <a className="btn btnPrimary" href={content.heroPrimaryCtaLink}>
              {content.heroPrimaryCtaLabel}
            </a>

            <a className="btn btnGhost" href={content.heroSecondaryCtaLink}>
              {content.heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div>
              <div className="kicker">{content.founderKicker}</div>
              <h2>{content.founderTitle}</h2>
            </div>
            <p>{content.founderText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid2">
            <article className="card">
              <div className="kicker">{content.backgroundKicker}</div>
              <h3>{content.backgroundTitle}</h3>
              <p>{content.backgroundText}</p>
            </article>

            <article className="card">
              <div className="kicker">{content.weightliftingKicker}</div>
              <h3>{content.weightliftingTitle}</h3>
              <p>{content.weightliftingText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div>
              <div className="kicker">{content.philosophyKicker}</div>
              <h2>{content.philosophyTitle}</h2>
            </div>
            <p>{content.philosophyText}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="sectionHeader" style={{ marginBottom: 0 }}>
              <div>
                <div className="kicker">{content.whyKicker}</div>
                <h2>{content.whyTitle}</h2>
              </div>
              <p>{content.whyText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="sectionHeader" style={{ marginBottom: 0 }}>
              <div>
                <h2>{content.finalCtaTitle}</h2>
              </div>

              <div>
                <p>{content.finalCtaText}</p>

                <div className="actions">
                  <a
                    className="btn btnPrimary"
                    href={content.finalCtaButtonLink}
                  >
                    {content.finalCtaButtonLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
