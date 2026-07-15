import type { ReactNode } from "react";

export function Section({
  kicker,
  title,
  text,
  children,
}: {
  kicker?: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeader">
          <div>
            {kicker && <div className="kicker">{kicker}</div>}
            <h2>{title}</h2>
          </div>

          {text && <p>{text}</p>}
        </div>

        {children}
      </div>
    </section>
  );
}
