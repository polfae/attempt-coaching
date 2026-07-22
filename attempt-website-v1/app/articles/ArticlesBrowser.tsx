"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PublicArticle = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  publishedAt?: string;
  readingTime?: string;
};

type ArticlesBrowserProps = {
  articles: PublicArticle[];
};

type SortOrder = "newest" | "oldest";

function formatDate(value?: string) {
  if (!value) return "Not dated";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function publicationTime(article: PublicArticle) {
  const time = new Date(article.publishedAt ?? "").getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function ArticlesBrowser({ articles }: ArticlesBrowserProps) {
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const categories = useMemo(() => {
    return Array.from(new Set(articles.map((article) => article.category).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const visibleArticles = useMemo(() => {
    return articles
      .filter((article) => category === "all" || article.category === category)
      .sort((a, b) => {
        const direction = sortOrder === "newest" ? -1 : 1;
        return direction * (publicationTime(a) - publicationTime(b));
      });
  }, [articles, category, sortOrder]);

  if (articles.length === 0) {
    return (
      <div className="panel">
        <h2>No articles published yet.</h2>
        <p>Drafts will appear here once they are published.</p>
      </div>
    );
  }

  return (
    <div className="articleBrowser">
      <div className="articleControls" aria-label="Article filters and sorting">
        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort by</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {visibleArticles.length > 0 ? (
        <div className="articleGrid">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id ?? article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="panel">
          <h2>No articles were found in this category.</h2>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: PublicArticle }) {
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
