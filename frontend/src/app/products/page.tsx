import Link from 'next/link';

export default function ProductsTerminal() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[300px] bg-zinc-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* HEADER */}
      <div className="mb-14 border-b border-zinc-800/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-white flex items-center gap-4">
            <span className="w-3 h-10 bg-red-600 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
            ECOSYSTEM PRODUCTS
          </h1>
          <p className="text-zinc-500 mt-4 tracking-[0.1em] uppercase text-xs font-bold pl-7 max-w-2xl leading-relaxed">
            The decentralized financial engine that injects real capital into the DAO.
          </p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Product 1: The Arena (Casino) */}
        <div className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 hover:border-red-500/50 rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-red-500/20" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎰</span>
            </div>
            <span className="bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
              LIVE
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-widest group-hover:text-red-50 transition-colors">The Arena</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
            Our premier decentralized casino. Where the house always wins, and you are the house. Cashflows generated from The Arena are directly distributed to the DAO's RewardPool and High-Conviction stakers.
          </p>

          <Link href="/casino" className="mt-auto w-full">
            <button className="w-full py-5 bg-[#050505] hover:bg-zinc-900 border border-zinc-800/80 hover:border-red-500/50 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.1)]">
              Enter The Arena
            </button>
          </Link>
        </div>

        {/* Product 2: Lending Protocol */}
        <div className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 hover:border-blue-500/50 rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-blue-500/20" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏦</span>
            </div>
            <span className="bg-zinc-800/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-zinc-700 shadow-inner">
              IN DEVELOPMENT
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-widest group-hover:text-blue-50 transition-colors">Lending Protocol</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
            Institutional-grade over-collateralized lending. Borrow against your $JNSX or deposit stablecoins to earn risk-adjusted yield. Expanding the utility of our ecosystem assets.
          </p>

          <button disabled className="mt-auto w-full py-5 bg-[#050505] border border-zinc-800/50 text-zinc-600 font-black rounded-2xl uppercase tracking-[0.2em] text-xs transition-all cursor-not-allowed">
            Coming Soon
          </button>
        </div>

      </div>
    </div>
  );
}
