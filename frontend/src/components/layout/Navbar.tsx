'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/80 p-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Izquierda: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="JOINUS Logo" width={145} height={60} className="object-contain group-hover:scale-105 transition-transform" />
        </Link>
        
        {/* Centro: Enlaces minimalistas */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold uppercase tracking-[0.15em] text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/staking" className="hover:text-white transition-colors">
            Staking
          </Link>
          
          {/* Dropdown de Productos */}
          <div className="relative group">
            <Link href="/products" className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer uppercase">
              Products
              <svg className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </Link>
            <div className="absolute top-full left-0 mt-4 w-52 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
              <Link href="/casino" className="px-5 py-4 hover:bg-zinc-900 hover:text-red-400 transition-colors border-b border-zinc-800/50">
                The Arena
              </Link>
              <Link href="/lending" className="px-5 py-4 hover:bg-zinc-900 hover:text-red-400 transition-colors">
                Lending Protocol
              </Link>
            </div>
          </div>

          <Link href="/governance" className="hover:text-white transition-colors">
            Governance
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/tokenomics" className="hover:text-white transition-colors">
            Tokenomics
          </Link>
        </div>

        {/* Derecha: Web3 Wallet Connector & Socials */}
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-zinc-500">
            <a href="https://discord.gg/joinus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="https://x.com/JOINUSonX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              X
            </a>
          </div>
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
