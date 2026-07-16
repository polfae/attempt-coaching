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
          <p className="lead">
            Programs are a secondary option for lifters who want structure, but
            are not ready for full Attempt Coaching yet.
          </p>
          <div className="actions">
            <Link className="btn btnPrimary" href="/apply">
              Apply for Coaching
            </Link>
            <Link className="btn btnGhost" href="/coaching">
              See Coaching First
            </Link>
          </div>
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
              <p>
                Featured programs are the best starting points for lifters who
                want a clear training direction without applying for full
                coaching.
              </p>
            </div>

            <div className="grid3">
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
            <p>
              Choose a program based on your current level, training
              availability, and main goal.
            </p>
          </div>

          {normalPrograms.length > 0 ? (
            <div className="grid3">
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
                <p>
                  A program gives you structure. Coaching gives you programming,
                  feedback, competition preparation, and support around your
                  actual training.
                </p>
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

  return (
    <article className="card">
      {program.featured && <div className="kicker">Featured program</div>}

      <h3>{program.title}</h3>

      <p>{program.description}</p>

      <ul className="list" style={{ marginTop: 18 }}>
        <li>
          <strong>Level:</strong> {program.level || "—"}
        </li>
        <li>
          <strong>Duration:</strong> {program.duration || "—"}
        </li>
        <li>
          <strong>Training days:</strong> {daysPerWeek || "—"}
        </li>
        <li>
          <strong>Goal:</strong> {program.goal || "—"}
        </li>
        <li>
          <strong>Price:</strong> {program.price || "—"}
        </li>
      </ul>

      {program.productLink ? (
        <div className="actions">
          <Link className="btn btnPrimary" href={`/programs/${program.slug}`}>
            View Details
          </Link>
        </div>
      ) : (
        <div className="actions">
          <Link className="btn btnGhost" href={`/programs/${program.slug}`}>
            View Details
          </Link>
        </div>
      )}
    </article>
  );
}
