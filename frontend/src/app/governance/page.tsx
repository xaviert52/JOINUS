'use client';

import { useState } from 'react';
import { useGovernance } from '@/hooks/useGovernance';

export default function GovernanceTerminal() {
  const { votingPower, civicDutyEpoch, activeProposals } = useGovernance();
  const [selectedVotes, setSelectedVotes] = useState<Record<number, string>>({});

  const handleVoteSelect = (proposalId: number, voteType: string) => {
    setSelectedVotes(prev => ({ ...prev, [proposalId]: voteType }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-zinc-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* HEADER */}
      <div className="mb-14 border-b border-zinc-800/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-zinc-300 flex items-center gap-4">
            <span className="w-3 h-10 bg-red-600 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
            ZERO-KNOWLEDGE GOVERNANCE
          </h1>
          <p className="text-zinc-500 mt-4 tracking-[0.1em] uppercase text-xs font-bold pl-7 max-w-2xl leading-relaxed">
            Anonymous voting via Semaphore V4. Your weight is verified, your identity is cryptographically hidden.
          </p>
        </div>
        <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex flex-col gap-3 min-w-[240px]">
          <div>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">Voting Power (JNSX)</p>
            <p className="text-3xl font-mono font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">{votingPower.toLocaleString()}</p>
          </div>
          <div className="border-t border-zinc-800/80 pt-3 flex flex-col items-start gap-2">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Civic Duty</p>
            <p className="text-[10px] font-black text-green-400 tracking-[0.1em] shadow-inner">{civicDutyEpoch}</p>
          </div>
        </div>
      </div>

      {/* PROPOSALS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {activeProposals.length === 0 ? (
          <div className="col-span-1 xl:col-span-2 bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-12 text-center shadow-2xl">
            <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest">No active proposals</h3>
            <p className="text-zinc-600 mt-2 text-sm">There are currently no active governance proposals to vote on.</p>
          </div>
        ) : (
          activeProposals.map((proposal) => (
          <div key={proposal.id} className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-zinc-700/80 transition-all duration-500 shadow-2xl">
            
            {/* Header Propuesta */}
            <div className="flex justify-between items-start mb-6">
              <span className="bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                {proposal.status}
              </span>
              <span className="text-zinc-500 font-mono text-xs font-bold bg-zinc-900/80 px-3 py-1.5 rounded border border-zinc-800">
                Time left: {proposal.timeLeft}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-zinc-300 leading-tight mb-4 tracking-wide group-hover:text-red-100 transition-colors">{proposal.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 font-medium line-clamp-3">{proposal.description}</p>
            
            <div className="flex gap-4 mb-8">
              <a href="#" className="text-zinc-500 hover:text-red-500 transition-colors underline text-xs">Read full proposal</a>
              <a href="#" className="text-zinc-500 hover:text-red-500 transition-colors underline text-xs">Discord #proposal-discussion</a>
            </div>
            
            {/* Quorum Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Quorum Progress</span>
                <span className="text-xs font-mono font-bold text-zinc-300">{proposal.quorumProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-zinc-700 to-zinc-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${proposal.quorumProgress}%` }}
                />
              </div>
            </div>

            {/* Voting Terminal */}
            <div className="mt-auto bg-[#050505] border border-zinc-800/80 rounded-2xl p-6 shadow-inner relative z-10 flex flex-col">
              <h4 className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4 text-center">Cast Your Anonymous Vote</h4>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button 
                  onClick={() => handleVoteSelect(proposal.id, 'FOR')}
                  className={`py-3 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${selectedVotes[proposal.id] === 'FOR' ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.15)] scale-[1.02]' : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                >
                  FOR
                </button>
                <button 
                  onClick={() => handleVoteSelect(proposal.id, 'AGAINST')}
                  className={`py-3 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${selectedVotes[proposal.id] === 'AGAINST' ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)] scale-[1.02]' : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                >
                  AGAINST
                </button>
                <button 
                  onClick={() => handleVoteSelect(proposal.id, 'ABSTAIN')}
                  className={`py-3 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all ${selectedVotes[proposal.id] === 'ABSTAIN' ? 'bg-zinc-500/10 border-zinc-500/50 text-zinc-300 shadow-[0_0_15px_rgba(161,161,170,0.15)] scale-[1.02]' : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                >
                  ABSTAIN
                </button>
              </div>

              <button 
                disabled={!selectedVotes[proposal.id]}
                className={`w-full py-4 font-black rounded-xl uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all border mt-auto ${selectedVotes[proposal.id] ? 'bg-white text-black hover:bg-zinc-200 border-transparent shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-0.5' : 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'}`}
              >
                Generate ZK-Proof & Cast Vote
              </button>
              
              <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest text-center">
                  Generating proof off-chain... nullifierHash secured.
                </p>
              </div>
            </div>

          </div>
          ))
        )}
      </div>
    </div>
  );
}
