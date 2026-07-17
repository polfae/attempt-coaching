import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { getPublishedArticles } from "@/lib/firestore";
import type { Article } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Articles | Attempt",
  description:
    "Olympic weightlifting articles on technique, programming, strength, mobility, competition, and training decisions.",
};

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "Not dated";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ArticlesPage() {
  const articles = (await getPublishedArticles()) as Article[];

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">Articles</div>
          <h1>Useful weightlifting thinking, written clearly.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {articles.length > 0 ? (
            <div className="articleGrid">
              {articles.map((article) => (
                <ArticleCard key={article.id ?? article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="panel">
              <h2>No articles published yet.</h2>
              <p>Drafts will appear here once they are published.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="articleCard">
      <Link className="articleImageLink" href={`/articles/${article.slug}`}>
        <img
          src={article.featuredImage || "/attempt-hero-weightlifting.png"}
          alt=""
        />
      </Link>

      <div className="articleCardBody">
        <div className="articleMetaLine">
          <span>{article.category || "Article"}</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readingTime || "3 min read"}</span>
        </div>

        <h2>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>

        <p>{article.excerpt}</p>

        <Link className="btn btnGhost" href={`/articles/${article.slug}`}>
          Read Article
        </Link>
      </div>
    </article>
  );
}
