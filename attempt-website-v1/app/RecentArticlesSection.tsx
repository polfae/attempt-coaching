"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type {
  ArticlesPageCursor,
  PublicArticleSummary,
  RecentArticlesPage,
} from "@/lib/firestore";

type RecentArticlesSectionProps = {
  initialArticles: PublicArticleSummary[];
  initialCursor: ArticlesPageCursor | null;
  initialHasMore: boolean;
};

function formatDate(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function RecentArticlesSection({
  initialArticles,
  initialCursor,
  initialHasMore,
}: RecentArticlesSectionProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMoreArticles() {
    if (!cursor || loading) return;

    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      limit: "3",
      cursorId: cursor.id,
      cursorPublishedAt: cursor.publishedAt,
      cursorPublishAtMillis: String(cursor.publishAtMillis),
    });

    try {
      const response = await fetch(`/api/articles/recent?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Could not load more articles.");
      }

      const page = (await response.json()) as RecentArticlesPage;

      setArticles((currentArticles) => [
        ...currentArticles,
        ...page.articles.filter(
          (article) =>
            !currentArticles.some(
              (currentArticle) =>
                (currentArticle.id ?? currentArticle.slug) ===
                (article.id ?? article.slug),
            ),
        ),
      ]);
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error("Failed to load recent articles:", error);
      setError("Could not load more articles. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="section recentArticlesSection">
      <div className="container">
        <div className="recentArticlesHeader">
          <div>
            <div className="kicker">Articles</div>
            <h2>Recent from Attempt</h2>
            <p>
              Thoughts on weightlifting, coaching, training, and the process
              behind long-term progress.
            </p>
          </div>

          <Link className="btn btnGhost" href="/articles">
            View all articles
          </Link>
        </div>

        <div className="recentArticleGrid">
          {articles.map((article) => (
            <RecentArticleCard
              article={article}
              key={article.id ?? article.slug}
            />
          ))}
        </div>

        <div className="recentArticlesActions" aria-live="polite">
          {error && <p className="recentArticlesError">{error}</p>}

          {hasMore && cursor && (
            <button
              className="btn btnGhost"
              disabled={loading}
              onClick={loadMoreArticles}
              type="button"
            >
              {loading ? "Loading articles..." : "Load more articles"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function RecentArticleCard({ article }: { article: PublicArticleSummary }) {
  const articleHref = `/articles/${article.slug}`;
  const dateLabel = formatDate(article.publishedAt);

  return (
    <article className="recentArticleCard">
      <Link
        aria-label={`Read article: ${article.title}`}
        className="recentArticleImageLink"
        href={articleHref}
      >
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={`Featured image for ${article.title}`}
            width={720}
            height={480}
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : (
          <div className="recentArticleFallback" aria-hidden="true">
            <span>{article.category || "Article"}</span>
          </div>
        )}
      </Link>

      <div className="recentArticleBody">
        <div className="articleMetaLine">
          <span>{article.category || "Article"}</span>
          {dateLabel && (
            <time dateTime={article.publishedAt}>{dateLabel}</time>
          )}
          <span>{article.readingTime || "3 min read"}</span>
        </div>

        <h3>
          <Link href={articleHref}>{article.title}</Link>
        </h3>

        <p>{article.excerpt}</p>

        <Link className="recentArticleReadLink" href={articleHref}>
          Read article
        </Link>
      </div>
    </article>
  );
}
