import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { getVisibleFaqItems } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "FAQ | Attempt",
  description:
    "Frequently asked questions about Attempt Coaching, digital programs, applications, and the Attempt app.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqItems = await getVisibleFaqItems();

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container">
          <div className="kicker">FAQ</div>
          <h1>Common questions.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {faqItems.length > 0 ? (
            <div className="faqList">
              {faqItems.map((item, index) => (
                <details className="faqItem" key={item.id ?? item.question}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.question}
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <div className="panel">
              <h2>No FAQ items published yet.</h2>
              <p>Questions will appear here once they are visible.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
