import type { Metadata } from "next";
import Image from "next/image";
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
  const credentials = content.credentialsText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const meaningParagraphs = content.weightliftingText
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const meaningLead = meaningParagraphs[0] || content.weightliftingTitle;
  const meaningBody = meaningParagraphs.slice(1);

  return (
    <PublicLayout>
      <section className="hero aboutHero">
        <div className="container">
          <div className="kicker">{content.heroKicker}</div>

          <h1>{content.heroHeadline}</h1>
        </div>
      </section>

      <section className="section aboutSectionIntro">
        <div className="container">
          <div className="aboutBrandIntro">
            <div className="aboutTextStack">
              <p className="lead">{content.heroText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section aboutSectionAthlete">
        <div className="container">
          <div className="aboutPhilosophy">
            <div className="aboutTextStack">
              <div className="kicker">{content.whyKicker}</div>
              <h2>{content.whyTitle}</h2>
              <p>{content.whyText}</p>
            </div>

            <figure className="aboutImageFrame aboutTallFrame">
              <Image
                src="/about-coach-lift-setup.png"
                width={941}
                height={1672}
                alt="A weightlifter setting up for a snatch with the barbell on the platform."
                sizes="(max-width: 900px) 100vw, 36vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section aboutSectionMeaning">
        <div className="container">
          <div className="aboutMeaning">
            <div className="aboutTextStack">
              <div className="kicker">{content.weightliftingKicker}</div>
              <h2>{content.weightliftingTitle}</h2>
              <p className="aboutStatement">{meaningLead}</p>
              {meaningBody.length > 0 && (
                <p>{meaningBody.join("\n\n")}</p>
              )}
            </div>

            <figure className="aboutImageFrame aboutWideFrame">
              <Image
                src="/about-coach-athlete-overhead.png"
                width={1536}
                height={1024}
                alt="A successful overhead lift on the competition platform."
                sizes="(max-width: 900px) 100vw, 88vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section aboutSectionApproach">
        <div className="container">
          <div className="aboutApproach">
            <div className="aboutTextStack">
              <div className="kicker">{content.philosophyKicker}</div>
              <h2>{content.philosophyTitle}</h2>
              <p>{content.philosophyText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section aboutBridgeSection">
        <div className="container">
          <div className="aboutBridge">
            <p>{content.transitionText}</p>
          </div>
        </div>
      </section>

      <section className="section aboutSectionCoachIntro">
        <div className="container">
          <div className="aboutIntro">
            <div className="aboutTextStack">
              <div className="kicker">{content.founderKicker}</div>
              <h2>{content.founderTitle}</h2>
              <p>{content.founderText}</p>
            </div>

            <figure className="aboutImageFrame aboutPortraitFrame">
              <Image
                src="/about-coach-headshot.png"
                width={1027}
                height={1531}
                alt="Pól Hendrikur Andreasen, founder and weightlifting coach at Attempt."
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section aboutSectionCoachStory">
        <div className="container">
          <div className="aboutStory">
            <div className="aboutTextStack aboutStoryCopy">
              <div className="kicker">{content.backgroundKicker}</div>
              <h2>{content.backgroundTitle}</h2>
              <p>{content.backgroundText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section aboutSectionExperience">
        <div className="container">
          <div className="aboutCredentials">
            <div className="aboutTextStack">
              <div className="kicker">{content.credentialsKicker}</div>
              <h2>{content.credentialsTitle}</h2>
            </div>

            <ul className="aboutCredentialRows">
              {credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section aboutSectionClosing">
        <div className="container">
          <div className="aboutClosing">
            <div className="aboutTextStack">
              <div className="kicker">{content.closingKicker}</div>
              <h2>{content.closingTitle}</h2>
              <p>{content.closingText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section aboutSectionCta">
        <div className="container">
          <div className="aboutCtaPanel">
            <div>
              <h2>{content.finalCtaTitle}</h2>
              <p>{content.finalCtaText}</p>
            </div>

            <div className="actions aboutCtaActions">
              <a className="btn btnPrimary" href={content.finalCtaButtonLink}>
                {content.finalCtaButtonLabel}
              </a>

              <a className="btn btnGhost" href={content.finalCtaSecondaryLink}>
                {content.finalCtaSecondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
