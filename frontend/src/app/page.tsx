'use client';

import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { JNS_STAKING_ADDRESS, JNS_STAKING_ABI, JNS_TOKEN_ADDRESS, JNS_TOKEN_ABI } from '@/config/contracts';

export default function Home() {
  const { data: tvlData } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: JNS_STAKING_ABI,
    functionName: 'totalJNSLocked',
  });

  const { data: burnedData } = useReadContract({
    address: JNS_TOKEN_ADDRESS,
    abi: JNS_TOKEN_ABI,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'],
  });

  const formattedTVL = tvlData ? Number(formatEther(tvlData as bigint)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00';
  const formattedBurned = burnedData ? Number(formatEther(burnedData as bigint)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10 relative z-10">
      
      {/* SECCIÓN HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-8 mt-20 mb-32 relative"
      >
        {/* Glow de ambientación profunda */}
        <div className="absolute top-1/2 left-1/2 w-[80vw] md:w-[600px] h-[400px] bg-red-600/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none animate-pulse" />

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-2xl">
          THE FINANCIAL <br/>
          <span className="bg-clip-text bg-gradient-to-r from-red-500 to-red-900 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">REBELLION</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium tracking-wide leading-relaxed">
          Liquid Staking & DeFi Venture Hub. <span className="text-red-400">Institutional grade Zero-Knowledge Governance</span> on Arbitrum.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 mt-12 pt-4 w-full sm:w-auto">
          <Link href="/staking" className="w-full sm:w-auto">
            <button className="w-full px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] transform hover:-translate-y-1">
              Enter the dApp
            </button>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto">
            <button className="w-full px-12 py-5 bg-zinc-900/50 backdrop-blur-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold rounded-xl uppercase tracking-[0.2em] text-sm transition-all hover:bg-zinc-800 transform hover:-translate-y-1">
              Documentation
            </button>
          </Link>
        </div>
      </motion.section>

      {/* GRID DE ESTADÍSTICAS */}
      <motion.section 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 relative"
      >
        {/* Línea conectora sutil de fondo */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10 hidden md:block"></div>
        
        {/* Stat 1: TVL */}
        <motion.div 
          whileHover={{ y: -8, scale: 1.02 }}
          className="group bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl hover:border-red-500/40 transition-colors duration-500"
        >
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Value Locked</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold text-white mb-3 group-hover:text-red-50 transition-colors drop-shadow-md">{formattedTVL} JNS</p>
          <p className="text-[10px] text-red-500/90 font-bold tracking-[0.2em] uppercase">Secured by 3-Day Timelock</p>
        </motion.div>

        {/* Stat 2: Average APY */}
        <div className="group bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl hover:border-green-500/40 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Current Average APY</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold text-green-400 mb-3 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            15.00%
          </p>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-2">Funded by Genesis Pool</p>
          <Link href="/docs/apy" className="relative z-20 pointer-events-auto text-[9px] text-zinc-500 hover:text-red-400 transition-colors underline">
            How our APY works &rarr;
          </Link>
        </div>

        {/* Stat 3: Burned */}
        <div className="group bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl hover:border-red-500/40 transition-all duration-500 hover:-translate-y-2">
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">$JNS Burned</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold text-white mb-3 group-hover:text-red-50 transition-colors drop-shadow-md">{formattedBurned} JNS</p>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Perpetual Deflation Engine</p>
        </div>
      </motion.section>

      {/* ECOSISTEMA (CARDS) */}
      <section className="mb-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] text-white flex flex-col items-center">
            Core <span className="text-red-500 mt-1">Pillars</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-6 opacity-70"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 hover:border-red-500/50 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-red-500/20" />
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-widest">Liquid Staking</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              Participate in liquid staking with $JNSX. Choose lock-up periods of up to 365 days to multiply your Base Yield and interact with the Dual Vault.
            </p>
            <Link href="/staking" className="text-red-500 font-black text-[10px] tracking-[0.2em] uppercase hover:text-red-400 flex items-center gap-2 group-hover:gap-4 transition-all">
              Launch App <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 hover:border-red-500/50 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-red-500/20" />
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-widest">ZK Governance</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              Exercise your voting power anonymously through Zero-Knowledge Proofs (Semaphore). Prevent Sybil attacks and guarantee true decentralization.
            </p>
            <Link href="/governance" className="text-red-500 font-black text-[10px] tracking-[0.2em] uppercase hover:text-red-400 flex items-center gap-2 group-hover:gap-4 transition-all">
              Launch App <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 hover:border-red-500/50 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-red-500/20" />
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-widest">Products</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              The decentralized financial engine that injects real capital into the DAO. We provide institutional infrastructure where "the house" always shares the flow.
            </p>
            <Link href="/products" className="text-red-500 font-black text-[10px] tracking-[0.2em] uppercase hover:text-red-400 flex items-center gap-2 group-hover:gap-4 transition-all">
              Launch App <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
