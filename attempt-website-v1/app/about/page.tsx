import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { PublicLayout } from "@/components/PublicLayout";
import { aboutPrinciples, aboutStandards } from "@/lib/content";
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
      images: [
        {
          url: "/attempt-hero-weightlifting.png",
          width: 1024,
          height: 1536,
          alt: "Attempt Coaching weightlifting hero image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/attempt-hero-weightlifting.png"],
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="aboutFounder">
            <div>
              <div className="kicker">{content.founderKicker}</div>
              <h2>{content.founderTitle}</h2>
            </div>

            <div>
              <p>{content.founderText}</p>

              <ul className="list aboutStandards">
                {aboutStandards.map((standard) => (
                  <li key={standard}>{standard}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cardCluster cardCluster2">
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
          </div>

          <CardGrid items={aboutPrinciples} />
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
