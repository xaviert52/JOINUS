'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsTerminal() {
  const [activeSection, setActiveSection] = useState('governance-balance');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSection = entry.target.id;
          }
        });
        if (visibleSection) {
          setActiveSection(visibleSection);
        }
      },
      { rootMargin: '-30% 0px -70% 0px', threshold: 0 } // Ajuste del sweet spot
    );

    const elements = document.querySelectorAll('section[id], div[id="zk-proofs"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-10">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:w-1/4 flex flex-col gap-6">
          <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-24 h-fit">
            <h2 className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Directory
            </h2>
            
            <nav className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-3">Specifications</p>
                <a href="#governance-balance" className={`block text-xs font-medium transition-colors border-l-2 pl-3 py-1 ${activeSection === 'governance-balance' ? 'text-white border-red-500 bg-red-500/5' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-white'}`}>
                  Governance Balance (08)
                </a>
                <a href="#zk-proofs" className={`block text-xs font-medium transition-colors border-l-2 pl-3 py-1 ${activeSection === 'zk-proofs' ? 'text-white border-red-500 bg-red-500/5' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-white'}`}>
                  ZK-Proofs Integration
                </a>
                <a href="#asymptotic" className={`block text-xs font-medium transition-colors border-l-2 pl-3 py-1 ${activeSection === 'asymptotic' ? 'text-white border-red-500 bg-red-500/5' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-white'}`}>
                  Asymptotic Economics
                </a>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-3">Architecture (ADR)</p>
                <a href="#apy" className={`block text-xs font-medium transition-colors border-l-2 pl-3 py-1 ${activeSection === 'apy' ? 'text-white border-red-500 bg-red-500/5' : 'text-zinc-500 border-transparent hover:border-zinc-700 hover:text-white'}`}>
                  ADR-009: APY & RewardPool
                </a>
                <a href="#adr-016" className="block text-xs font-medium text-zinc-500 hover:text-white transition-colors border-l-2 border-transparent hover:border-zinc-700 pl-3 py-1">
                  ADR-016: Paymaster Runway
                </a>
                <a href="#adr-019" className="block text-xs font-medium text-zinc-500 hover:text-white transition-colors border-l-2 border-transparent hover:border-zinc-700 pl-3 py-1">
                  ADR-019: Lending Hub Base
                </a>
                <a href="#adr-020" className="block text-xs font-medium text-zinc-500 hover:text-white transition-colors border-l-2 border-transparent hover:border-zinc-700 pl-3 py-1">
                  ADR-020: The Arena Spec
                </a>
                <Link href="/docs/whitepaper" className="block text-xs font-medium text-zinc-500 hover:text-white transition-colors border-l-2 border-transparent hover:border-zinc-700 pl-3 py-1 mt-4">
                  Whitepaper
                </Link>
                <Link href="/tokenomics" className="block text-xs font-medium text-zinc-500 hover:text-white transition-colors border-l-2 border-transparent hover:border-zinc-700 pl-3 py-1">
                  Live Tokenomics
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="lg:w-3/4">
          <div className="mb-12 border-b border-zinc-800/80 pb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white flex items-center gap-4">
              DOCUMENTATION
            </h1>
            <p className="text-zinc-500 mt-4 tracking-[0.1em] uppercase text-xs font-bold leading-relaxed max-w-2xl">
              Technical Specifications, Architecture Decisions (ADR), and Protocol Rules. Extracted directly from the DAO's Git repository.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* GOVERNANCE BALANCE SPECS */}
            <section id="governance-balance" className="scroll-mt-24 bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <span className="bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-red-500/20 w-max">
                  SPEC-08
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Governance Balance</h2>
              </div>
              
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed font-medium text-sm md:text-base">
                  The protocol enforces strict separation between economic incentives and voting power. To prevent plutocracy (where wealth equals absolute control), voting weight is not purely determined by token holdings, but by <strong>Time-Locked Commitment</strong> and <strong>Civic Duty</strong>.
                </p>
                
                <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-inner hover:border-red-500/30 transition-colors">
                    <h3 className="text-white font-black mb-3 uppercase text-xs tracking-widest flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      Voting Power ($JNSX)
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      Minted 1:1 when staking $JNS, but multiplied algorithmically up to <span className="text-red-400 font-bold">2.0x</span> based on the lock period (up to 365 days). $JNSX is non-transferable and represents true conviction in the DAO.
                    </p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-inner hover:border-green-500/30 transition-colors">
                    <h3 className="text-white font-black mb-3 uppercase text-xs tracking-widest flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      Civic Duty Requirement
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      To claim extraordinary USDC dividends from Ecosystem Products (The Arena), a user MUST have participated in at least <span className="text-green-400 font-bold">70%</span> of the Governance proposals in the active epoch.
                    </p>
                  </div>
                </div>

                <div id="zk-proofs" className="scroll-mt-32 bg-red-950/10 border-l-4 border-red-600 p-8 rounded-r-2xl relative overflow-hidden mt-6">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  </div>
                  <h4 className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3 relative z-10">Zero-Knowledge Nullifiers (Semaphore V4)</h4>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed relative z-10">
                    To prevent double-voting and protect privacy, Semaphore generates off-chain proofs. The Smart Contract ONLY verifies the math and stores a unique nullifier hash, ensuring cryptographically that a voter belongs to the Merkle tree of valid $JNSX holders without ever revealing which one they are.
                  </p>
                </div>
              </div>
            </section>

            {/* ASYMPTOTIC ECONOMICS */}
            <section id="asymptotic" className="scroll-mt-32 bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-zinc-700 w-max">
                  SPEC-09
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Asymptotic Economics</h2>
              </div>
              
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed font-medium text-sm md:text-base">
                  The tokenomics model follows an asymptotic decay curve for emission schedules, guaranteeing mathematical scarcity over time. Rewards distribute heavily in early epochs to bootstrap liquidity, then stabilize to reward long-term conviction via real-yield routing from the DeFi Venture Hub.
                </p>
              </div>
            </section>

            {/* THE APY ARCHITECTURE */}
            <section id="apy" className="scroll-mt-32 bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-zinc-700 w-max">
                  ADR-009
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">RewardPool & APY</h2>
              </div>
              
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-400 leading-relaxed font-medium text-sm md:text-base">
                  The JOINUS economic model separates inflationary rewards from real yield. The <strong>Base APY</strong> is funded exclusively by the Genesis Pool and the Transactional Tax, whereas external dividends come from the Ecosystem Products.
                  <br /><br />
                  <Link href="/docs/apy" className="inline-block mt-2 text-red-500 hover:text-red-400 font-bold underline transition-colors">
                    Understand how our Asymptotic APY works in real-time
                  </Link>
                </p>

                <div className="flex flex-col gap-4 mt-10">
                  <div className="flex items-start gap-4 p-5 bg-[#0a0a0a] rounded-2xl border border-zinc-800/80 shadow-inner hover:border-zinc-600 transition-colors">
                    <div className="text-2xl mt-1 opacity-80">🔥</div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">1% Burn (Perpetual Deflation)</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">Every on-chain transfer of $JNS burns exactly 1% of the total transaction amount, constantly and irreversibly reducing the circulating supply.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-5 bg-[#0a0a0a] rounded-2xl border border-zinc-800/80 shadow-inner hover:border-zinc-600 transition-colors">
                    <div className="text-2xl mt-1 opacity-80">🏦</div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">2% RewardPool (Staking Fuel)</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">2% of every transfer is injected directly into the locked RewardPool contract. This contract mathematically distributes yield to $JNS stakers based on their locked timeframe.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#0a0a0a] rounded-2xl border border-zinc-800/80 shadow-inner hover:border-zinc-600 transition-colors">
                    <div className="text-2xl mt-1 opacity-80">🎰</div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Ecosystem Cashflow (USDC)</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">External revenue generated from products like The Arena is routed directly to High-Conviction stakers (users locked for 365 days who have fulfilled their Civic Duty).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>

      </div>
    </div>
  );
}
