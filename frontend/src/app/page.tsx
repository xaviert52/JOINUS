export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-900 selection:text-white font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Cyber-Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 -z-10" />

      {/* Glow */}
      <div className="absolute top-0 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <HeroSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center space-y-6 z-10 max-w-4xl">
      <div className="inline-flex items-center space-x-2 bg-red-950/40 border border-red-500/30 rounded-full px-4 py-1.5 text-red-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Venture Hub Activo
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-lg">
        LA REBELIÓN FINANCIERA
      </h1>
      
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light tracking-wide">
        Liquid Staking & DeFi Venture Hub. <span className="text-red-400 font-medium">Gobernanza ZK</span> de grado institucional.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
        <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:-translate-y-0.5">
          Ingresar al Hub
        </button>
        <button className="px-8 py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 font-bold rounded-sm uppercase tracking-wider transition-all hover:bg-gray-900">
          Leer Manifiesto
        </button>
      </div>
    </section>
  );
}
