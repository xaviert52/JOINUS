'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/80 p-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Izquierda: Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-black tracking-[0.2em] text-white uppercase flex items-center">
            JOINUS
            <span className="text-red-500 font-mono text-3xl -mt-1 ml-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] group-hover:animate-pulse">!</span>
          </span>
        </Link>
        
        {/* Centro: Enlaces minimalistas */}
        <div className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/staking" className="hover:text-white transition-colors">
            Staking
          </Link>
          
          {/* Dropdown de Productos */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer uppercase">
              Products
              <svg className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-4 w-52 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
              <Link href="/casino" className="px-5 py-4 hover:bg-zinc-900 hover:text-red-400 transition-colors border-b border-zinc-800/50">
                The Arena (Casino)
              </Link>
              <Link href="/lending" className="px-5 py-4 hover:bg-zinc-900 hover:text-red-400 transition-colors">
                Lending Protocol
              </Link>
            </div>
          </div>

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
