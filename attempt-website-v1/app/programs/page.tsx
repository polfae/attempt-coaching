import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { getVisiblePrograms } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Weightlifting Programs | Attempt",
  description:
    "Structured Olympic weightlifting programs for lifters who want focused training before applying for full Attempt Coaching.",
  openGraph: {
    title: "Weightlifting Programs | Attempt",
    description:
      "Structured Olympic weightlifting programs for lifters who want focused training before applying for full Attempt Coaching.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weightlifting Programs | Attempt",
    description:
      "Structured Olympic weightlifting programs for lifters who want focused training before applying for full Attempt Coaching.",
  },
};

export default async function ProgramsPage() {
  const programs = (await getVisiblePrograms()) as any[];

  const featuredPrograms = programs.filter(
    (program) => program.featured === true,
  );
  const normalPrograms = programs.filter(
    (program) => program.featured !== true,
  );

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">Digital programs</div>
          <h1>Weightlifting programs for structured training.</h1>
        </div>
      </section>

      {featuredPrograms.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sectionHeader">
            <div>
              <div className="kicker">Featured</div>
              <h2>Start here.</h2>
            </div>
          </div>

            <div className="programGrid">
              {featuredPrograms.map((program) => (
                <ProgramCard
                  key={program.id ?? program.slug}
                  program={program}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div>
              <div className="kicker">Catalogue</div>
              <h2>Available programs.</h2>
            </div>
          </div>

          {normalPrograms.length > 0 ? (
            <div className="programGrid">
              {normalPrograms.map((program) => (
                <ProgramCard
                  key={program.id ?? program.slug}
                  program={program}
                />
              ))}
            </div>
          ) : (
            <div className="panel">
              <h3>No additional programs available yet.</h3>
              <p>
                More digital programs will be added later. For now, the main
                offer is Attempt Coaching.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="sectionHeader" style={{ marginBottom: 0 }}>
              <div>
                <div className="kicker">Coaching first</div>
                <h2>Need individual feedback?</h2>
              </div>
              <div>
                <div className="actions">
                  <Link className="btn btnPrimary" href="/apply">
                    Apply for Coaching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ProgramCard({ program }: { program: any }) {
  const daysPerWeek =
    program.daysPerWeek ?? program.days ?? program.trainingDaysPerWeek;
  const detailHref = `/programs/${program.slug}`;
  const purchaseHref = program.productLink || detailHref;
  const purchaseIsExternal = Boolean(program.productLink);

  return (
    <article className="programCard">
      <div className="programCardTop">
        <div>
          <div className="kicker">
            {program.featured ? "Featured program" : program.level || "Program"}
          </div>
          <h3>{program.title}</h3>
        </div>
        <div className="programPrice">{program.price || "Price TBA"}</div>
      </div>

      <p>{program.description}</p>

      <dl className="programMeta">
        <div>
          <dt>Level</dt>
          <dd>{program.level || "—"}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{program.duration || "—"}</dd>
        </div>
        <div>
          <dt>Training</dt>
          <dd>{daysPerWeek || "—"}</dd>
        </div>
        <div>
          <dt>Goal</dt>
          <dd>{program.goal || "—"}</dd>
        </div>
      </dl>

      <div className="programActions">
        {purchaseIsExternal ? (
          <a
            className="btn btnPrimary"
            href={purchaseHref}
            target="_blank"
            rel="noreferrer"
          >
            Purchase Program
          </a>
        ) : (
          <Link className="btn btnPrimary" href={purchaseHref}>
            Purchase Program
          </Link>
        )}

        <Link className="btn btnGhost" href={detailHref}>
          View Details
        </Link>
      </div>
    </article>
  );
}
