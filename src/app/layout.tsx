import './globals.css';
import type { Metadata } from 'next';
import { DM_Serif_Display, Sora } from 'next/font/google';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

const sans = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Personal Ledger',
  description: 'Track family expenses with a simple balance view.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
