import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Attempt | Premium Weightlifting Coaching',
  description: 'Premium weightlifting coaching with structured programming, technical feedback, competition preparation, and the Attempt app.',
  openGraph: {
    title: 'Attempt Coaching',
    description: 'Premium weightlifting coaching for athletes who want more than just a program.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
