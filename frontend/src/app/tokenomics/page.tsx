'use client';

import Link from 'next/link';
import { useReadContract } from 'wagmi';

// Mock ABI and addresses for the future
const JNS_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  }
];

const VAULTS = [
  {
    name: "Liquidity & Staking",
    address: "0x1111111111111111111111111111111111111111",
    allocation: 40,
    amount: 4000000,
    color: "bg-red-500",
    description: "Initial DEX Liquidity and the Genesis Staking RewardPool."
  },
  {
    name: "Ecosystem & Treasury",
    address: "0x2222222222222222222222222222222222222222",
    allocation: 25,
    amount: 2500000,
    color: "bg-zinc-300",
    description: "Fund for future product development (The Arena, Lending Hub, etc.) and DAO operations."
  },
  {
    name: "Community Incentives",
    address: "0x3333333333333333333333333333333333333333",
    allocation: 15,
    amount: 1500000,
    color: "bg-green-500",
    description: "Airdrops, Zealy campaigns, and initial community bootstrapping."
  },
  {
    name: "Team & Advisors",
    address: "0x4444444444444444444444444444444444444444",
    allocation: 10,
    amount: 1000000,
    color: "bg-blue-500",
    description: "Core contributors and strategic advisors. Locked with a strict vesting schedule."
  },
  {
    name: "Initial Burn",
    address: "0x5555555555555555555555555555555555555555",
    allocation: 10,
    amount: 1000000,
    color: "bg-yellow-500",
    description: "Permanently removed from circulating supply at TGE to create immediate deflation."
  }
];

export default function TokenomicsTracker() {
  const TOTAL_SUPPLY = 10000000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-zinc-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="mb-14 border-b border-zinc-800/80 pb-8 pt-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-white flex flex-col md:flex-row md:items-center gap-4">
          <span className="w-3 h-10 bg-red-500 rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.8)] hidden md:block"></span>
          LIVE TOKENOMICS TRACKER
        </h1>
        <p className="text-zinc-500 mt-4 tracking-[0.1em] uppercase text-xs font-bold md:pl-7 max-w-2xl leading-relaxed">
          Real-time on-chain verification of the $JNS Genesis Supply Distribution.
        </p>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Genesis Supply</p>
          <p className="text-3xl font-mono font-bold text-white drop-shadow-md">10,000,000 <span className="text-sm text-zinc-600">$JNS</span></p>
        </div>
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Network Target</p>
          <p className="text-3xl font-mono font-bold text-white drop-shadow-md">Arbitrum One</p>
        </div>
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Perpetual Deflation</p>
          <p className="text-xl font-black text-red-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">1% Burn on Transfer</p>
        </div>
      </div>

      {/* VISUAL BREAKDOWN BARS */}
      <div className="bg-[#050505] border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <span className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"></span>
          Vault Distribution (Live Allocation)
        </h2>
        
        {/* Progress Bar Stacked */}
        <div className="w-full h-8 flex rounded-xl overflow-hidden mb-12 shadow-inner border border-zinc-800/50">
          {VAULTS.map((vault, idx) => (
            <div 
              key={idx} 
              style={{ width: `${vault.allocation}%` }} 
              className={`${vault.color} h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer relative group`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-900 border border-zinc-700 text-white text-[9px] font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {vault.name} ({vault.allocation}%)
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {VAULTS.map((vault, idx) => (
            <VaultCard key={idx} vault={vault} totalSupply={TOTAL_SUPPLY} />
          ))}
        </div>
      </div>

    </div>
  );
}

function VaultCard({ vault, totalSupply }: { vault: any, totalSupply: number }) {
  // Configured architecture for live wagmi reads:
  const { data: balanceData } = useReadContract({
    address: JNS_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [vault.address as `0x${string}`],
    query: {
      enabled: false // Disabled mock call to prevent errors on uninitialized addresses
    }
  });

  // Fallback to static mock amount for UI presentation
  const amountToDisplay = balanceData ? Number(balanceData) / 1e18 : vault.amount;
  const currentPercentage = ((amountToDisplay / totalSupply) * 100).toFixed(1);

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${vault.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></span>
            {vault.name}
          </h3>
          <span className="text-zinc-500 font-mono text-[10px] bg-zinc-900 px-2 py-1 rounded">Target: {vault.allocation}%</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-6">
          {vault.description}
        </p>
      </div>
      <div className="pt-4 border-t border-zinc-800/50">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Live Balance</span>
          <span className="text-white font-mono font-bold text-lg">{amountToDisplay.toLocaleString()} <span className="text-[10px] text-zinc-500">$JNS</span></span>
        </div>
        {/* Mini progress bar for individual vault health relative to its allocation */}
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className={`h-full ${vault.color}`} style={{ width: '100%' }}></div>
        </div>
        <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-2 text-right">
          Currently holds {currentPercentage}% of Total Supply
        </p>
      </div>
    </div>
  );
}
