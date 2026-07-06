import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';

export const metadata = {
  title: 'JOINUS! | The Financial Rebellion',
  description: 'Liquid Staking & DeFi Venture Hub con Gobernanza ZK en Arbitrum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono antialiased">
        <Providers>
          {/* El Navbar va montado fuera del main para ser fixed top */}
          <Navbar />
          {/* Contenedor principal ocupando el alto entero de pantalla y dando padding top por el navbar */}
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
