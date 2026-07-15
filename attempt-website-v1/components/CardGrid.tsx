export function CardGrid({ items, columns = 3 }: { items: [string, string][]; columns?: 2 | 3 }) {
  return (
    <div className={columns === 2 ? 'grid2' : 'grid3'}>
      {items.map(([title, text]) => (
        <article className="card" key={title}>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}
