import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://attempt.coach'
  ),
  title: 'Attempt | Premium Weightlifting Coaching',
  description: 'Premium weightlifting coaching with structured programming, technical feedback, competition preparation, and the Attempt app.',
  applicationName: 'Attempt Coaching',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    title: 'Attempt Coaching',
    description: 'Premium weightlifting coaching for athletes who want more than just a program.',
    type: 'website',
    images: [
      {
        url: '/attempt-hero-weightlifting.png',
        width: 1024,
        height: 1536,
        alt: 'Attempt Coaching weightlifting hero image'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attempt Coaching',
    description: 'Premium weightlifting coaching for athletes who want more than just a program.',
    images: ['/attempt-hero-weightlifting.png']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
