import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/firestore";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = "Contact Attempt";
  const description =
    settings.defaultSeoDescription ||
    "Contact Attempt for app support, program questions, collaborations, business inquiries, or technical issues.";

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

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactEmail = settings?.contactEmail || "hello@attempt.coach";

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">Contact</div>

          <h1>Contact Attempt.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cardCluster cardCluster2">
            <div className="card">
              <div className="kicker">Coaching</div>

              <h3>Want to apply for coaching?</h3>

              <p>
                Coaching inquiries should go through the application form so
                your training background, goals, and current situation can be
                reviewed properly.
              </p>

              <div className="actions">
                <a className="btn btnPrimary" href="/apply">
                  Apply for Coaching
                </a>
              </div>
            </div>

            <div className="card">
              <div className="kicker">Support</div>

              <h3>Questions or technical issues?</h3>

              <p>
                For app support, digital program questions, collaboration ideas,
                or business inquiries, send an email directly.
              </p>

              <div className="actions">
                <a className="btn btnGhost" href={`mailto:${contactEmail}`}>
                  Email Attempt
                </a>
              </div>
            </div>
          </div>

          {settings?.instagramUrl && (
            <div className="panel" style={{ marginTop: 18 }}>
              <div className="sectionHeader" style={{ marginBottom: 0 }}>
                <div>
                  <div className="kicker">Social</div>
                  <h2>Follow Attempt.</h2>
                </div>

                <div>
                  <div className="actions">
                    <a
                      className="btn btnGhost"
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
