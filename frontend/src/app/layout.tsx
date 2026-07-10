import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { PageTitle } from '@/components/layout/PageTitle';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'JOINUS! | Staking Terminal',
  description: 'Liquid Staking & DeFi Venture Hub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="bg-[#050505] text-zinc-300 font-sans antialiased selection:bg-red-500/30 selection:text-red-200">
        <Providers>
          <PageTitle />
          <Navbar />
          <main className="min-h-screen pt-20 relative overflow-hidden">
            {/* Dark texture overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-50"></div>
            {/* Top red subtle line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
