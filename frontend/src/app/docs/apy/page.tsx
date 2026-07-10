'use client';

import Link from 'next/link';
import { useReadContract } from 'wagmi';

const JNS_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_JNS_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";
const JNS_STAKING_ADDRESS = process.env.NEXT_PUBLIC_JNS_STAKING_ADDRESS || "0x0000000000000000000000000000000000000000";

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

export default function ApyAnalytics() {
  const { data: poolBalanceData, isError, isLoading } = useReadContract({
    address: JNS_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [JNS_STAKING_ADDRESS as `0x${string}`],
    query: {
      enabled: Boolean(JNS_TOKEN_ADDRESS && JNS_STAKING_ADDRESS)
    }
  });

  const rewardPoolBalance = poolBalanceData ? Number(poolBalanceData) / 1e18 : 0;
  // 530 Weeks = ~10.2 Years target divisor
  const annualEmission = rewardPoolBalance / 10.2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="mb-14 border-b border-zinc-800/80 pb-8 pt-6">
        <Link href="/docs" className="text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-2 mb-6 w-max transition-colors">
          &larr; Back to Docs
        </Link>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-zinc-300 flex flex-col md:flex-row md:items-center gap-4">
          <span className="w-3 h-10 bg-green-500 rounded-sm shadow-[0_0_15px_rgba(74,222,128,0.8)] hidden md:block"></span>
          THE MATHEMATICS OF REAL YIELD
        </h1>
        <p className="text-zinc-500 mt-4 tracking-[0.1em] uppercase text-xs font-bold md:pl-7 max-w-2xl leading-relaxed">
          The Dynamic Asymptotic Emission Model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: THE FORMULA */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <h2 className="text-sm font-black text-zinc-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse"></span>
              Core Equation
            </h2>

            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 md:p-8 flex items-center justify-center shadow-inner mb-10 overflow-x-auto">
              <code className="text-green-400 font-mono text-sm md:text-lg lg:text-xl whitespace-nowrap drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                Annual Emission = Current RewardPool Balance / 10.2 Years Target
              </code>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-zinc-400 leading-relaxed font-medium">
                Unlike traditional DAOs that hardcode an inflationary schedule, our RewardPool implements a mathematically self-correcting engine operating in <strong>Weekly Epochs</strong>. The yield dynamically scales based on the actual capital held by the DAO, protecting the protocol from hyperinflation and guaranteeing long-term sustainability.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 shadow-inner">
            <h3 className="text-xs text-zinc-500 font-black uppercase tracking-[0.3em] mb-6">Engine Specifications</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-red-500 text-xs font-black">01</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Self-Regulating Runway (Auto-Throttle)</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    The pool mathematically targets a 10.2-year lifespan (530 Weeks) (100% Health). It adjusts emissions dynamically per week. If the pool health drops below 100%, the absolute emissions are proportionally throttled down, forcing a mathematical replenish until the 10.2 years target is restored.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-green-500 text-xs font-black">02</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Casino Injections</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    When external products (The Arena) generate profit, they fill the pool. The formula detects the increase and naturally raises the APY, routing real yield directly to the stakers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-500 text-xs font-black">03</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Protection against Bank Runs</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    In bear markets, emissions slow down, preventing the treasury from ever going to zero. This creates a psychological floor and a mathematical guarantee of protocol survival.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-yellow-500 text-xs font-black">04</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Slice of the Pie Mechanics</h4>
                  <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 my-3">
                    <code className="text-yellow-400 font-mono text-xs md:text-sm">
                      Your Reward = (Your $JNSX / Total Global $JNSX) * Weekly Emission
                    </code>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    The APY is not a fixed percentage. It is a competition for a slice of the weekly emission. 
                    Because extreme locks grant up to a <span className="text-red-400 font-bold">3.2x multiplier</span> in $JNSX, 
                    those who commit long-term devour the slices of those who don't.
                  </p>
                  <blockquote className="mt-4 border-l-2 border-red-500 pl-4 py-1">
                    <p className="text-zinc-300 italic text-sm">"We encode long-term thinking. This is meritocracy verified by code."</p>
                  </blockquote>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-purple-500 text-xs font-black">05</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Dynamic Early Unstake Penalty</h4>
                  <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 my-3">
                    <code className="text-purple-400 font-mono text-xs md:text-sm">
                      Penalty % = (Days Left / Total Lock Days) * 25%
                    </code>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Breaking a time lock incurs a variable penalty that scales proportionally to the remaining time. The maximum burn is 25%. This prevents false urgency and rewards users for waiting out the majority of their lock.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-cyan-500 text-xs font-black">06</span>
                </div>
                <div>
                  <h4 className="text-zinc-300 font-bold mb-2">Compound Routing</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Instead of arbitrary reinvestment, the DAO grants sovereignty via Compound Routing. When claiming yield, users route funds across 7 options: from <span className="text-cyan-400 font-bold">Flexible (1.0x)</span> to <span className="text-cyan-400 font-bold">3 Years (3.2x)</span>, unlocking massive yield acceleration on new dividends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZER (ON-CHAIN) */}
        <div className="lg:col-span-5">
          <div className="bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 shadow-2xl sticky top-28">
            <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-6">Live On-Chain Engine State</h3>
            
            <div className="space-y-8">
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">RewardPool Balance</p>
                <p className="text-3xl font-mono font-bold text-zinc-300 drop-shadow-md">
                  {isLoading ? 'SYNCING...' : isError ? 'ERROR' : rewardPoolBalance.toLocaleString()} <span className="text-sm text-zinc-600">$JNS</span>
                </p>
              </div>
              
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Current Target Divisor</p>
                <p className="text-xl font-mono font-bold text-zinc-300">10.2 Years <span className="text-xs text-zinc-600">(530 Weeks)</span></p>
              </div>

              <div className="pt-6 border-t border-zinc-800/80">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Resulting Base Emission</p>
                <p className="text-4xl font-mono font-bold text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                  {isLoading ? 'SYNCING...' : isError ? 'ERROR' : annualEmission.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-green-500/50">$JNS / Year</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
