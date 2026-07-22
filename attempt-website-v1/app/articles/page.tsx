import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { getPublishedArticles } from "@/lib/firestore";
import type { Article } from "@/lib/firestore";
import { ArticlesBrowser } from "./ArticlesBrowser";

export const metadata: Metadata = {
  title: "Articles | Attempt",
  description:
    "Olympic weightlifting articles on technique, programming, strength, mobility, competition, and training decisions.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = (await getPublishedArticles()) as Article[];
  const publicArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    category: article.category,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
  }));

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
          <ArticlesBrowser articles={publicArticles} />
        </div>
      </section>
    </PublicLayout>
  );
}
