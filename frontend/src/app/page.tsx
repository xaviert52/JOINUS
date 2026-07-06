import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10">
      
      {/* SECCIÓN HERO */}
      <section className="flex flex-col items-center text-center space-y-6 mt-16 mb-24 relative">
        {/* Efecto Glow Atmosférico Oculto */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none" />

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-lg">
          THE FINANCIAL REBELLION
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl font-light tracking-wide">
          Liquid Staking & DeFi Venture Hub. <span className="text-red-500 font-medium">Institutional grade Zero-Knowledge Governance</span> on Arbitrum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
          <Link href="/staking">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]">
              Enter the dApp
            </button>
          </Link>
          <Link href="/manifesto">
            <button className="px-8 py-3 bg-transparent border border-zinc-700 hover:border-zinc-500 text-gray-300 font-bold rounded-sm uppercase tracking-wider transition-all hover:bg-zinc-900">
              Read Manifesto
            </button>
          </Link>
        </div>
      </section>

      {/* GRID DE ESTADÍSTICAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {/* Stat 1: TVL */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center items-center text-center shadow-lg hover:border-red-900/50 transition-colors">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Total Value Locked</h3>
          <p className="text-4xl font-bold text-white mb-2">$0.00</p>
          <p className="text-xs text-red-500 font-medium tracking-wide">Secured by 3-Day Timelock</p>
        </div>

        {/* Stat 2: Base APY */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center items-center text-center shadow-lg hover:border-red-900/50 transition-colors">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Current Base APY</h3>
          <p className="text-4xl font-bold text-green-400 mb-2 flex items-center gap-2">
            15.00%
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">🔥</span>
          </p>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Powered by JNS Casino Revenue</p>
        </div>

        {/* Stat 3: Burned */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center items-center text-center shadow-lg hover:border-red-900/50 transition-colors">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">$JNS Burned</h3>
          <p className="text-4xl font-bold text-white mb-2">0 JNS</p>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Deflación Perpetua</p>
        </div>
      </section>

      {/* ECOSISTEMA (CARDS) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-center text-gray-200 mb-10 border-b border-zinc-800 pb-4">
          Core Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-red-500/80 rounded-lg p-8 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-red-400 transition-colors">Dual Staking</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Participa en el staking líquido con $JNSX. Elige periodos de bloqueo hasta 365 días para multiplicar tu Yield Base e interactuar con la Bóveda Dual.
            </p>
            <Link href="/staking" className="text-red-500 font-semibold text-sm hover:text-red-400">Launch App &rarr;</Link>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-red-500/80 rounded-lg p-8 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-red-400 transition-colors">ZK Governance</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Ejerce tu poder de voto de forma anónima a través de Pruebas de Conocimiento Cero (Semaphore). Evita Sybil Attacks y garantiza verdadera descentralización.
            </p>
            <Link href="/governance" className="text-red-500 font-semibold text-sm hover:text-red-400">Launch App &rarr;</Link>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-red-500/80 rounded-lg p-8 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-red-400 transition-colors">The Arena</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              El motor financiero descentralizado que inyecta capital real hacia la DAO. Proveemos infraestructura institucional donde "la casa" siempre comparte el flujo.
            </p>
            <Link href="/arena" className="text-red-500 font-semibold text-sm hover:text-red-400">Launch App &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
