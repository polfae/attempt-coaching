import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import { getProgramBySlug } from "@/lib/firestore";

type ProgramDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const program = await getProgramBySlug(params.slug);

  if (!program) {
    return {
      title: "Program Not Found | Attempt",
    };
  }

  const title = `${program.title} | Attempt Programs`;
  const description =
    program.description ||
    "Structured Olympic weightlifting program from Attempt Coaching.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: program.imageUrl
        ? [{ url: program.imageUrl, alt: program.title }]
        : [
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
      images: [program.imageUrl || "/attempt-hero-weightlifting.png"],
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const program = await getProgramBySlug(params.slug);

  if (!program) {
    notFound();
  }

  const daysPerWeek = program.daysPerWeek ?? program.days;
  const hasProductLink = Boolean(program.productLink);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">{program.level || "Program"}</div>
          <h1>{program.title}</h1>
          <p className="lead">{program.description}</p>

          <div className="actions">
            {hasProductLink ? (
              <a className="btn btnPrimary" href={program.productLink}>
                Buy Program
              </a>
            ) : (
              <Link className="btn btnPrimary" href="/contact">
                Ask About Program
              </Link>
            )}

            <Link className="btn btnGhost" href="/programs">
              Back to Programs
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="programDetailGrid">
            <div className="panel">
              <div className="kicker">Program overview</div>
              <h2>What you get.</h2>
              <ul className="list" style={{ marginTop: 24 }}>
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
            </div>

            <div className="panel">
              <div className="kicker">Best fit</div>
              <h2>Who this is for.</h2>
              <p>
                This program is for lifters who want more structure before
                applying for full coaching. Choose it when the goal, level, and
                training frequency match your current situation.
              </p>
              <p>
                If you need individual feedback, technical review, or
                competition planning around your actual training, coaching is
                the better path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="sectionHeader" style={{ marginBottom: 0 }}>
              <div>
                <div className="kicker">Coaching first</div>
                <h2>Need feedback, not just sessions?</h2>
              </div>

              <div>
                <p>
                  Programs give you structure. Coaching adds the feedback loop:
                  programming, video review, adjustments, and competition
                  preparation around your actual lifting.
                </p>

                <div className="actions">
                  <Link className="btn btnPrimary" href="/apply">
                    Apply for Coaching
                  </Link>
                  <Link className="btn btnGhost" href="/coaching">
                    See Coaching
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
