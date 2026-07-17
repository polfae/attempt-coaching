import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import {
  getPublishedArticleBySlug,
  getPublishedArticles,
} from "@/lib/firestore";
import type { Article } from "@/lib/firestore";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "Not dated";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function withSafeExternalLinks(html: string) {
  return html.replace(/<a\s+([^>]*href=["']https?:\/\/[^"']+["'][^>]*)>/gi, (match, attrs) => {
    let nextAttrs = attrs;

    if (!/\starget=/i.test(nextAttrs)) {
      nextAttrs += ' target="_blank"';
    }

    if (!/\srel=/i.test(nextAttrs)) {
      nextAttrs += ' rel="noopener noreferrer"';
    }

    return `<a ${nextAttrs}>`;
  });
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await getPublishedArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | Attempt",
    };
  }

  return {
    title: article.seoTitle || `${article.title} | Attempt Articles`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: "article",
      images: article.featuredImage
        ? [{ url: article.featuredImage, alt: article.title }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getPublishedArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = ((await getPublishedArticles()) as Article[])
    .filter(
      (item) =>
        item.slug !== article.slug &&
        (item.category === article.category ||
          item.tags?.some((tag) => article.tags?.includes(tag))),
    )
    .slice(0, 3);

  return (
    <PublicLayout>
      <article>
        <section className="articleHero">
          <div className="container">
            <Link className="articleBackLink" href="/articles">
              Back to Articles
            </Link>
            <div className="articleMetaLine">
              <span>{article.category || "Article"}</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>{article.readingTime || "3 min read"}</span>
            </div>
            <h1>{article.title}</h1>
            <p className="articleAuthor">By {article.author}</p>
          </div>
        </section>

        <div className="container">
          <img
            className="articleHeroImage"
            src={article.featuredImage || "/attempt-hero-weightlifting.png"}
            alt=""
          />
        </div>

        <section className="section articleReadingSection">
          <div className="container">
            <div
              className="articleBody"
              dangerouslySetInnerHTML={{ __html: withSafeExternalLinks(article.body) }}
            />
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sectionHeader">
              <div>
                <div className="kicker">Keep reading</div>
                <h2>Related articles.</h2>
              </div>
            </div>
            <div className="articleGrid relatedArticleGrid">
              {related.map((item) => (
                <Link
                  className="relatedArticleCard"
                  href={`/articles/${item.slug}`}
                  key={item.id ?? item.slug}
                >
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <small>{item.readingTime || "3 min read"}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
