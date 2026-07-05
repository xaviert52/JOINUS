import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';

export const metadata = {
  title: 'JNS Ecosistema | La Rebelión Financiera',
  description: 'Liquid Staking & DeFi Venture Hub con Gobernanza ZK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white font-mono antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
