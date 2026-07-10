'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/80 p-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Izquierda: Menú Hamburguesa y Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-zinc-300 title-brutalist text-3xl group-hover:text-white transition-colors">JOINUS!</span>
          </Link>
        </div>
        
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
            Documentation
          </Link>
        </div>

        {/* Derecha: Web3 Wallet Connector & Socials */}
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-zinc-500">
            <a href="https://discord.gg/qKhFb4rT3Y" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="https://x.com/JOINUSonX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              X
            </a>
          </div>
          <div className="[&_button]:!text-[10px] [&_button]:!font-black [&_button]:!uppercase [&_button]:!tracking-widest">
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
      </div>

      {/* Menú Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-full left-0 w-full h-[calc(100vh-73px)] bg-[#050505] border-t border-zinc-800/80 p-6 flex flex-col gap-6 font-bold uppercase tracking-[0.15em] text-sm overflow-y-auto z-40">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white text-zinc-400">Dashboard</Link>
          <Link href="/staking" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white text-zinc-400">Staking</Link>
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white text-zinc-400">Products</Link>
          <Link href="/governance" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white text-zinc-400">Governance</Link>
          <Link href="/docs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white text-zinc-400">Documentation</Link>
          <div className="mt-8 pt-8 border-t border-zinc-800 flex gap-6 text-xs">
            <a href="https://discord.gg/qKhFb4rT3Y" target="_blank" rel="noopener noreferrer" className="hover:text-white text-zinc-500">Discord</a>
            <a href="https://x.com/JOINUSonX" target="_blank" rel="noopener noreferrer" className="hover:text-white text-zinc-500">X</a>
          </div>
        </div>
      )}
    </nav>
  );
}
