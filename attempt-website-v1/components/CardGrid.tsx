export function CardGrid({ items, columns = 3 }: { items: [string, string][]; columns?: 2 | 3 }) {
  return (
    <div className={`cardCluster ${columns === 2 ? 'cardCluster2' : 'cardCluster3'}`}>
      {items.map(([title, text]) => (
        <article className="card" key={title}>
          <h3>{formatCardTitle(title)}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function formatCardTitle(title: string) {
  const numberedTitle = title.match(/^(\d+)[.)]\s+(.+)$/);

  if (!numberedTitle) {
    return title;
  }

  return (
    <>
      <span className="cardTitleNumber">{numberedTitle[1].padStart(2, "0")}</span>
      {numberedTitle[2]}
    </>
  );
}
