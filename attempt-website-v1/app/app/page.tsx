import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { PublicLayout } from "@/components/PublicLayout";
import { getAppContent, getSiteSettings } from "@/lib/firestore";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([
    getAppContent(),
    getSiteSettings(),
  ]);

  const title = content.seoTitle || "Attempt App | Meet-Day Attempt Management";
  const description =
    content.seoDescription ||
    settings.defaultSeoDescription ||
    "Meet-day attempt management for Olympic weightlifting coaches and athletes.";

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

export default async function AppPage() {
  const content = await getAppContent();

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

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div>
              <div className="kicker">{content.featuresKicker}</div>
              <h2>{content.featuresTitle}</h2>
            </div>
          </div>

          <CardGrid
            items={[
              [
                "Planned attempts",
                "Keep the intended meet plan visible before the competition starts.",
              ],
              [
                "Declared attempts",
                "Follow what has been declared and what needs to happen next.",
              ],
              [
                "Attempt strategy",
                "Support decisions around jumps, totals, and platform timing.",
              ],
              [
                "Warm-up clarity",
                "Reduce confusion between coach and athlete during competition.",
              ],
              [
                "Coaching connection",
                "Connect meet-day execution with the preparation process.",
              ],
              [
                "Future standalone access",
                "Non-coached lifters and coaches may access the app separately later.",
              ],
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="sectionHeader" style={{ marginBottom: 0 }}>
              <div>
                <div className="kicker">{content.accessKicker}</div>
                <h2>{content.accessTitle}</h2>
              </div>

              <div>
                <div className="actions">
                  <a className="btn btnPrimary" href={content.accessCtaLink}>
                    {content.accessCtaLabel}
                  </a>
                </div>
              </div>
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
