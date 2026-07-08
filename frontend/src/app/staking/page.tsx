'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStaking } from '@/hooks/useStaking';
import { useGaslessTx } from '@/hooks/useGaslessTx';

const LOCK_OPTIONS = [
  { label: 'Flexible', days: 0, multiplier: 1.0 },
  { label: '30 Days', days: 30, multiplier: 1.1 },
  { label: '90 Days', days: 90, multiplier: 1.3 },
  { label: '180 Days', days: 180, multiplier: 1.6 },
  { label: '365 Days', days: 365, multiplier: 2.0, isVip: true },
  { label: '2 Years', days: 730, multiplier: 2.6, isVip: true },
  { label: '3 Years', days: 1095, multiplier: 3.2, isVip: true },
];

export default function StakingTerminal() {
  const {
    jnsBalance,
    jnsxBalance,
    baseYieldPending,
    extraordinaryDividends,
    isCivicDutyMet,
    lockedJNS,
    unlockDate,
    has365DayLock,
    hasLockedPositions,
    daysUntilNextClaim
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLock, setSelectedLock] = useState(LOCK_OPTIONS[4]);

  const { isGaslessMode, setIsGaslessMode, isSponsoring, sendGaslessTransaction } = useGaslessTx();

  const projectedJNSX = stakeAmount ? (parseFloat(stakeAmount) * selectedLock.multiplier).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 relative z-10">
      
      {/* Background Ambience / Grid */}
      <div className="fixed top-20 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-red-900/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* HEADER */}
      <div className="mb-14 border-b border-zinc-800/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white flex items-center gap-4">
            <span className="w-3 h-10 bg-red-600 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
            STAKING TERMINAL
          </h1>
          <p className="text-zinc-500 mt-4 tracking-[0.3em] uppercase text-[10px] font-bold pl-7">Institutional Grade Yield Engine</p>
        </div>
        <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between md:block gap-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2">Available Balance</p>
          <p className="text-2xl font-mono font-bold text-white drop-shadow-md">{jnsBalance.toLocaleString()} <span className="text-red-500 text-lg">$JNS</span></p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, staggerChildren: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        
        {/* PANEL IZQUIERDO: ACCIÓN (Lock & Mint) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="lg:col-span-5 bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col relative overflow-hidden group"
        >
          {/* Subtle hover effect on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
          
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"></span>
            Deposit & Mint
          </h2>

          {/* Amount Input */}
          <div className="mb-10">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Amount to Stake</label>
            <div className="relative group/input">
              <input 
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-[#050505] border border-zinc-800 text-white text-4xl font-mono font-bold p-6 rounded-2xl focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-800 shadow-inner"
              />
              <button 
                onClick={() => setStakeAmount(jnsBalance.toString())}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900 hover:bg-zinc-800 text-red-400 text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                Max
              </button>
            </div>
          </div>

          {/* Time Lock Selector */}
          <div className="mb-10">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Time Lock Commitment</label>
            <div className="grid grid-cols-2 gap-3">
              {LOCK_OPTIONS.map((lock) => (
                <button
                  key={lock.label}
                  onClick={() => setSelectedLock(lock)}
                  className={`py-4 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all
                    ${selectedLock.label === lock.label 
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] scale-[1.02]' 
                      : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900'
                    } ${lock.isVip ? 'col-span-2 bg-gradient-to-r' : ''} 
                    ${lock.isVip && selectedLock.label !== lock.label ? 'from-zinc-950/50 to-red-950/10 border-red-900/30 text-zinc-400' : ''}
                    ${lock.isVip && selectedLock.label === lock.label ? 'from-red-500/15 to-red-900/10 border-red-500/60 text-red-400' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{lock.label}</span>
                    <span className={`text-[10px] font-black ${selectedLock.label === lock.label ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-zinc-600'}`}>
                      {lock.multiplier.toFixed(1)}x {lock.isVip && '★'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Projection Box */}
          <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 mb-10 flex justify-between items-center shadow-inner">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">You will receive:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-wider">{projectedJNSX} <span className="text-red-500 text-lg">$JNSX</span></span>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-[#050505] rounded-2xl border border-zinc-800">
              <div>
                <p className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-2">
                  Gasless Mode
                  <span className="bg-red-500 text-[8px] px-2 py-0.5 rounded-full">DAO Sponsored</span>
                </p>
                <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">Pay 0 ETH for Gas (ERC-4337)</p>
                <p className="text-[8px] text-zinc-600 mt-1 italic">When enabled, the DAO's Paymaster contract sponsors your Ethereum network gas fees. You transact for free.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isGaslessMode} onChange={() => setIsGaslessMode(!isGaslessMode)} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <button 
              onClick={() => sendGaslessTransaction("0xStakingContract", "0xLockData")}
              disabled={isSponsoring}
              className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSponsoring ? "Sponsoring Tx..." : "Lock & Mint"}
            </button>
          </div>
        </motion.div>


        {/* PANEL DERECHO: PORTFOLIO & REWARDS */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Active Positions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 md:p-10 relative"
          >
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8">Your Portfolio</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Locked Value</p>
                <p className="text-4xl md:text-5xl font-mono font-bold text-white drop-shadow-md">{lockedJNS.toLocaleString()} <span className="text-base text-zinc-600">$JNS</span></p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Voting Power</p>
                <p className="text-4xl md:text-5xl font-mono font-bold text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]">{jnsxBalance.toLocaleString()} <span className="text-base text-zinc-600">$JNSX</span></p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Unlock Date</span>
              <span className="text-white font-mono bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-800/80 text-sm shadow-inner">{unlockDate}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Cañón 1: Base Yield */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 hover:border-red-500/40 transition-colors duration-500 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3 flex justify-between items-center z-10">
                RewardPool Yield 
                <span className="text-green-400 text-[9px] bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30 tracking-[0.2em] font-black shadow-[0_0_10px_rgba(74,222,128,0.2)]">ACTIVE</span>
              </h3>
              <div className="mb-8"></div>
              
              <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-10 group-hover:text-red-50 transition-colors drop-shadow-md z-10">
                {baseYieldPending.toFixed(2)} <span className="text-xl text-zinc-600">$JNS</span>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto z-10">
                <button 
                  onClick={() => sendGaslessTransaction("0xStaking", "0xClaim")}
                  disabled={hasLockedPositions && daysUntilNextClaim > 0}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-colors border border-zinc-700/50 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(hasLockedPositions && daysUntilNextClaim > 0) ? `Unlocks in ${daysUntilNextClaim} days` : "Claim Yield"}
                </button>
                <button 
                  onClick={() => sendGaslessTransaction("0xStaking", "0xAutoCompound")}
                  disabled={hasLockedPositions && daysUntilNextClaim > 0}
                  className="w-full py-4 bg-red-600/90 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {(hasLockedPositions && daysUntilNextClaim > 0) ? `Unlocks in ${daysUntilNextClaim} days` : "Auto-Compound"}
                </button>
                <p className="text-[8px] text-zinc-500 mt-2 px-1 leading-relaxed">
                  * Transparent Execution: Auto-compounding creates an independent lock (Stake Laddering). It maximizes your $JNSX multiplier without resetting your original deposit's unlock date. Weekly Epochs apply to locked stakes.
                </p>
              </div>
            </motion.div>

            {/* Cañón 2: High-Conviction Dividends */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 hover:border-blue-500/40 transition-colors duration-500 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3 flex justify-between items-center z-10">
                USDC Dividends
                <span className="text-blue-400 text-[9px] bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30 tracking-[0.2em] font-black shadow-[0_0_10px_rgba(59,130,246,0.2)]">VAULT</span>
              </h3>
              <p className="text-zinc-500 text-[11px] font-medium mb-8 leading-relaxed z-10">Casino Cashflow distributions for true believers</p>
              
              <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-8 group-hover:text-blue-50 transition-colors drop-shadow-md z-10">
                ${extraordinaryDividends.toFixed(2)} <span className="text-xl text-zinc-600">USDC</span>
              </div>
              
              <div className="mb-8 p-4 bg-[#050505] border border-zinc-800/80 rounded-xl flex items-center justify-between shadow-inner z-10">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Civic Duty Status</span>
                {isCivicDutyMet ? (
                  <span className="text-[10px] font-black text-green-400 tracking-[0.15em] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">VERIFIED (70%+)</span>
                ) : (
                  <span className="text-[10px] font-black text-red-500 tracking-[0.15em]">FAILED</span>
                )}
              </div>
              
              <button 
                onClick={() => sendGaslessTransaction("0xStaking", "0xClaimDividends")}
                disabled={!isCivicDutyMet || isSponsoring}
                className={`w-full py-4 font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all border mt-auto z-10
                  ${isCivicDutyMet 
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transform hover:-translate-y-0.5' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'}
                `}
              >
                {isSponsoring ? "Sponsoring..." : "Claim Dividends"}
              </button>
            </motion.div>
          </div>

          {/* Active Staking Positions Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden"
          >
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Active Staking Positions</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                    <th className="pb-3 font-black">Type / Multiplier</th>
                    <th className="pb-3 font-black">Locked Amount ($JNS)</th>
                    <th className="pb-3 font-black text-red-500/70">Voting Power ($JNSX)</th>
                    <th className="pb-3 font-black">Unlock Date</th>
                    <th className="pb-3 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono text-zinc-300">
                  {/* Mock Row 1 */}
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                      365 Days <span className="text-[9px] text-zinc-500">2.0x</span>
                    </td>
                    <td className="py-4">1,000</td>
                    <td className="py-4 text-red-400">2,000</td>
                    <td className="py-4 text-zinc-500">2027-07-05</td>
                    <td className="py-4 text-right">
                      <button className="text-[9px] bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded uppercase tracking-wider text-zinc-400 hover:text-white transition-colors border border-zinc-800">
                        Details
                      </button>
                    </td>
                  </tr>
                  {/* Mock Row 2 */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      Flexible <span className="text-[9px] text-zinc-500">1.0x</span>
                    </td>
                    <td className="py-4">1,500</td>
                    <td className="py-4 text-red-400/70">1,500</td>
                    <td className="py-4 text-zinc-500">N/A</td>
                    <td className="py-4 text-right">
                      <button className="text-[9px] bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded uppercase tracking-wider text-zinc-400 hover:text-white transition-colors border border-zinc-800">
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Zona de Peligro (Withdraw) */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-6 border border-red-900/30 bg-red-950/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 group hover:bg-red-950/20 transition-colors"
          >
            <div>
              <h4 className="text-red-500 font-black uppercase text-[10px] mb-2 tracking-[0.3em] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Danger Zone
              </h4>
              <p className="text-[10px] text-red-500/70 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">Warning: Breaking the lock incurs up to a 25% penalty burned to the RewardPool.</p>
            </div>
            <button className="whitespace-nowrap px-8 py-3 border border-red-900/50 hover:border-red-500 text-red-500 hover:bg-red-950/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              Early Unstake
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
