'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Izquierda: Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-widest text-white uppercase">
            JOINUS<span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">!</span>
          </span>
        </Link>
        
        {/* Centro: Enlaces minimalistas */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/staking" className="hover:text-white transition-colors">
            Dual Staking
          </Link>
          <Link href="/arena" className="hover:text-white transition-colors">
            The Arena
          </Link>
          <Link href="/governance" className="hover:text-white transition-colors">
            Governance ZK
          </Link>
        </div>

        {/* Derecha: Web3 Wallet Connector */}
        <div className="flex items-center space-x-4">
          <ConnectButton 
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </nav>
  );
}
