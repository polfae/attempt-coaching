import Link from 'next/link';

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link className="logo" href={href} aria-label="Attempt home">
      <span className="logoMark">A</span>
      <span>Attempt</span>
    </Link>
  );
}
