'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStaking } from '@/hooks/useStaking';
import { useGaslessTx } from '@/hooks/useGaslessTx';
import { parseEther, formatEther } from 'viem';
import { useChainId } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { JNS_TOKEN_ADDRESS, JNS_TOKEN_ABI, JNS_STAKING_ADDRESS, JNS_STAKING_ABI } from '@/config/contracts';

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
    allowance,
    baseYieldPending,
    extraordinaryDividends,
    isCivicDutyMet,
    lockedJNS,
    unlockDate,
    has365DayLock,
    hasLockedPositions,
    daysUntilNextClaim,
    stakes,
    config,
    writeContractAsync,
    isWritePending,
    refetchAll
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLock, setSelectedLock] = useState(LOCK_OPTIONS[4]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStake, setSelectedStake] = useState<any>(null);

  const chainId = useChainId();
  const { isGaslessMode, setIsGaslessMode, isSponsoring, sendGaslessTransaction } = useGaslessTx();

  const projectedJNSX = stakeAmount ? (parseFloat(stakeAmount) * selectedLock.multiplier).toFixed(2) : '0.00';

  // Flow asyncronous para Lock & Mint
  const handleDeposit = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const lockTypeIndex = LOCK_OPTIONS.findIndex(l => l.label === selectedLock.label);

    if (isGaslessMode && chainId !== 31337) {
      await sendGaslessTransaction(JNS_STAKING_ADDRESS as `0x${string}`, "0xDeposit" as `0x${string}`);
      return;
    }

    try {
      const amountInWei = parseEther(stakeAmount.toString());
      
      // Paso 1: Ejecutar Approve
      const approveTx = await writeContractAsync({
        address: JNS_TOKEN_ADDRESS as `0x${string}`,
        abi: JNS_TOKEN_ABI,
        functionName: 'approve',
        args: [JNS_STAKING_ADDRESS as `0x${string}`, amountInWei],
      });
      
      // Paso 2: ESPERAR OBLIGATORIAMENTE EL MINADO DEL BLOQUE
      await waitForTransactionReceipt(config, { hash: approveTx });

      // Paso 3: Detonar el depósito con el enum LockTypeIndex correcto
      const depositTx = await writeContractAsync({
        address: JNS_STAKING_ADDRESS as `0x${string}`,
        abi: JNS_STAKING_ABI,
        functionName: 'deposit',
        args: [amountInWei, lockTypeIndex],
      });

      await waitForTransactionReceipt(config, { hash: depositTx });
      
      setStakeAmount('');
      refetchAll();
    } catch (e) {
      console.error('Staking Error:', e);
    }
  };

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
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-zinc-300 flex items-center gap-4">
            <span className="w-3 h-10 bg-red-600 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
            STAKING TERMINAL
          </h1>
          <p className="text-zinc-500 mt-4 tracking-[0.3em] uppercase text-[10px] font-bold pl-7">Institutional Grade Yield Engine</p>
        </div>
        <div className="bg-[#0a0a0a]/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center justify-between md:block gap-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2">Available Balance</p>
          <p className="text-2xl font-mono font-bold text-zinc-300 drop-shadow-md">{jnsBalance.toLocaleString()} <span className="text-red-500 text-lg">$JNS</span></p>
        </div>
      </div>

      {/* PISO 1: DEPOSIT & MINT (Ancho Total) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group mb-8"
      >
          {/* Subtle hover effect on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
          
          <h2 className="text-sm font-black text-zinc-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"></span>
            Deposit & Mint
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Lado Derecho (Amount to Stake) */}
            <div className="flex flex-col justify-between h-full order-last md:order-last">
              <div>
                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Amount to Stake</label>
                  <div className="relative group/input">
                    <input 
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-[#050505] border border-zinc-800 text-zinc-300 text-4xl font-mono font-bold p-6 rounded-2xl focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-800 shadow-inner"
                    />
                    <button 
                      onClick={() => setStakeAmount(jnsBalance.toString())}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900 hover:bg-zinc-800 text-red-400 text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Projection Box */}
                <div className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-inner">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">You will receive:</span>
                  <span className="text-2xl font-mono font-bold text-zinc-300 tracking-wider">{projectedJNSX} <span className="text-red-500 text-lg">$JNSX</span></span>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-[#050505] rounded-2xl border border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 group/tooltip relative">
                      <p className="text-sm font-black uppercase text-zinc-300 tracking-[0.2em] flex items-center gap-2">
                        Gasless Mode
                        <span className="bg-red-500 text-[9px] px-2.5 py-1 rounded-full text-zinc-300">DAO Sponsored</span>
                      </p>
                      <span className="text-zinc-500 hover:text-zinc-300 cursor-help">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 w-72 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[9px] p-3 rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">
                        The DAO's Paymaster holds an ETH pool funded by product revenues to sponsor your network gas fees for Voting and Compounding.
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5 uppercase tracking-widest font-bold">Pay 0 ETH for Gas (ERC-4337)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isGaslessMode} onChange={() => setIsGaslessMode(!isGaslessMode)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                <button 
                  onClick={handleDeposit}
                  disabled={isSponsoring || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > jnsBalance || isWritePending}
                  className="w-full py-5 bg-red-600 hover:bg-red-500 text-zinc-300 font-black rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSponsoring ? "Sponsoring Tx..." : parseFloat(stakeAmount) > jnsBalance ? "Insufficient Balance" : isWritePending ? "Processing..." : "LOCK & MINT"}
                </button>
              </div>
            </div>

            {/* Lado Izquierdo (Time Lock Selector) */}
            <div className="flex flex-col order-first md:order-first">
              {/* Time Lock Selector */}
              <div className="h-full">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Time Lock Commitment</label>
                <div className="grid grid-cols-2 gap-3 h-[calc(100%-2rem)]">
                  {LOCK_OPTIONS.map((lock) => (
                    <button
                      key={lock.label}
                      onClick={() => setSelectedLock(lock)}
                      className={`py-4 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex flex-col justify-center items-center gap-1
                        ${selectedLock.label === lock.label 
                          ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] scale-[1.02]' 
                          : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900'
                        } ${lock.isVip ? 'col-span-2 bg-gradient-to-r flex-row justify-between' : ''} 
                        ${lock.isVip && selectedLock.label !== lock.label ? 'from-zinc-950/50 to-red-950/10 border-red-900/30 text-zinc-400' : ''}
                        ${lock.isVip && selectedLock.label === lock.label ? 'from-red-500/15 to-red-900/10 border-red-500/60 text-red-400' : ''}
                      `}
                    >
                      <span className="text-center w-full">{lock.label}</span>
                      <span className={`text-[10px] font-black ${selectedLock.label === lock.label ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-zinc-600'}`}>
                        {lock.multiplier.toFixed(1)}x {lock.isVip && '★'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      {/* PISO 2: REWARDS & DIVIDENDS (2 Columnas) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.1, staggerChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8"
      >
        
        {/* COL 1: BASE YIELD CAÑÓN 1 */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 hover:border-red-500/40 transition-colors duration-500 flex flex-col group relative overflow-hidden h-full"
        >
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-3 flex justify-between items-center z-10">
            RewardPool Yield 
            <span className="text-zinc-300 text-[9px] bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50 tracking-[0.2em] font-black shadow-inner">ACTIVE</span>
          </h3>
              <div className="mb-4"></div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 shadow-inner">
                  <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">Available to Withdraw:</div>
                  <div className="text-3xl font-mono font-bold text-zinc-300 drop-shadow-md">
                    {baseYieldPending.toFixed(2)} <span className="text-sm text-zinc-600">$JNS</span>
                  </div>
                </div>
                
                <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 shadow-inner flex flex-col justify-between">
                  <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">Accumulated this Cycle:</div>
                  <div className="text-xl font-mono font-bold text-zinc-300">
                    {(baseYieldPending * 0.1).toFixed(2)} <span className="text-xs text-zinc-600">$JNS</span>
                  </div>
                </div>
              </div>

              {hasLockedPositions && daysUntilNextClaim > 0 && (
                <div className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 px-3 py-2 rounded-lg mb-6 shadow-inner z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Weekly Epoch closes in: {daysUntilNextClaim} Days
                </div>
              )}
              {(!hasLockedPositions || daysUntilNextClaim === 0) && (
                <div className="mb-2"></div>
              )}
              
              <div className="flex flex-col gap-3 mt-auto z-10">
                <button 
                  onClick={() => sendGaslessTransaction("0xStaking" as `0x${string}`, "0xClaim" as `0x${string}`)}
                  disabled={hasLockedPositions && daysUntilNextClaim > 0}
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-colors border border-zinc-700/50 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Claim Yield
                </button>
                
                <div className="bg-[#050505] border border-zinc-800/80 rounded-xl p-3 shadow-inner">
                  <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Compound Routing</label>
                  <select className="w-full bg-[#0a0a0a] border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg p-2 focus:outline-none focus:border-red-500/50">
                    <option value="flexible">Route to Flexible (1.0x)</option>
                    <option value="30days">Route to 30 Days (1.1x)</option>
                    <option value="90days">Route to 90 Days (1.3x)</option>
                    <option value="180days">Route to 180 Days (1.6x)</option>
                    <option value="1year">Route to 1 Year (2.0x ★)</option>
                    <option value="2years">Route to 2 Years (2.6x ★)</option>
                    <option value="3years">Route to 3 Years (3.2x ★)</option>
                  </select>
                </div>

                <button 
                  onClick={() => sendGaslessTransaction("0xStaking" as `0x${string}`, "0xAutoCompound" as `0x${string}`)}
                  disabled={hasLockedPositions && daysUntilNextClaim > 0}
                  className="w-full py-4 bg-red-600/90 hover:bg-red-500 text-zinc-300 font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  Compound
                </button>
              </div>
            </motion.div>

        {/* COL 2: EXTRAORDINARY USDC */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 hover:border-zinc-500/40 transition-colors duration-500 flex flex-col group relative overflow-hidden h-full"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-3 flex justify-between items-center z-10">
            Civic Dividends
            {isCivicDutyMet ? (
              <span className="text-zinc-300 text-[9px] bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50 tracking-[0.2em] font-black shadow-inner">ELIGIBLE</span>
            ) : (
              <span className="text-zinc-500 text-[9px] bg-zinc-900/50 px-2.5 py-1 rounded-full border border-zinc-800 tracking-[0.2em] font-black">INELIGIBLE</span>
            )}
          </h3>
          <div className="mb-4"></div>
          
          <div className="bg-[#050505] p-5 rounded-2xl border border-zinc-800/80 mb-6 shadow-inner relative z-10 flex flex-col items-center text-center">
            <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-2">Ready to Claim:</div>
            <div className="text-3xl font-mono font-bold text-zinc-300 drop-shadow-md mb-4">
              {extraordinaryDividends.toFixed(2)} <span className="text-sm text-zinc-500">$USDC</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold max-w-[90%] mx-auto leading-relaxed">
              To be eligible you must have over 70% civic duty attendance. To check your real-time civic status, review <Link href="/governance" className="text-zinc-400 underline hover:text-zinc-300 transition-colors">Governance</Link>.
            </p>
          </div>

          <div className="flex-1"></div>

          {!isCivicDutyMet && (
            <div className="text-[9px] uppercase tracking-widest text-zinc-400 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl mb-6 shadow-inner z-10 text-center">
              <span className="font-black text-zinc-300">Warning:</span> You have missed more than 30% of votes this epoch. Dividends forfeited.
            </div>
          )}

          <div className="flex flex-col gap-3 z-10">
            <button 
              disabled={!isCivicDutyMet}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black rounded-xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Claim USDC
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* PISO 3: ACTIVE STAKING POSITIONS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full bg-[#0a0a0a]/70 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden"
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
                  {stakes.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-center text-zinc-500">No active positions found.</td></tr>
                  ) : (
                    stakes.map((stake: any, idx: number) => {
                      const amount = Number(formatEther(stake.amount)).toLocaleString();
                      const jnsxAmountNum = Number(formatEther(stake.jnsxMinted));
                      const amountNum = Number(formatEther(stake.amount));
                      const jnsxAmount = jnsxAmountNum.toLocaleString();
                      const mult = amountNum > 0 ? (jnsxAmountNum / amountNum).toFixed(1) : "1.0";
                      const lockTypeToDays = [0, 30, 90, 180, 365, 730, 1095];
                      const duration = lockTypeToDays[Number(stake.lockType)] || 0;
                      const isFlex = duration === 0;
                      const typeLabel = isFlex ? 'Flexible' : `${duration} Days`;
                      const date = isFlex ? 'N/A' : new Date(Number(stake.unlockTime) * 1000).toISOString().split('T')[0];
                      return (
                        <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                          <td className="py-4 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isFlex ? 'bg-zinc-600' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]'}`}></span>
                            {typeLabel} <span className="text-[9px] text-zinc-500">{mult}x</span>
                          </td>
                          <td className="py-4">{amount}</td>
                          <td className="py-4 text-red-400">{jnsxAmount}</td>
                          <td className="py-4 text-zinc-500">{date}</td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => { setSelectedStake({ type: typeLabel, mult: `${mult}x`, amount, power: jnsxAmount, date, lockValue: isFlex ? 'flexible' : 'ladder' }); setIsModalOpen(true); }}
                              className="text-[9px] bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded uppercase tracking-wider text-zinc-400 hover:text-zinc-300 transition-colors border border-zinc-800"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 border-t border-zinc-800/80 pt-4">
              <p className="text-[9px] text-zinc-500 italic flex items-center gap-2">
                <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                * Positions marked as FLEXIBLE can be unstaked instantly with 0% time penalty.
              </p>
            </div>
          </motion.div>
      {/* Individual Stake Details Modal */}
      {isModalOpen && selectedStake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl w-full max-w-md relative shadow-2xl flex flex-col gap-6"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div>
              <h3 className="text-zinc-300 font-black uppercase tracking-[0.2em] mb-1">Stake Details</h3>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{selectedStake.type} Lock ({selectedStake.mult})</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 shadow-inner">
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Amount</p>
                <p className="text-zinc-300 font-mono text-xl font-bold">{selectedStake.amount} <span className="text-[10px] text-zinc-600">$JNS</span></p>
              </div>
              <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/80 shadow-inner">
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Unlock Date</p>
                <p className="text-zinc-300 font-mono text-sm font-bold mt-1.5">{selectedStake.date}</p>
              </div>
            </div>

            <div className="bg-[#050505] border border-zinc-800/80 rounded-xl p-4 shadow-inner">
              <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Compound Routing</label>
              <select 
                defaultValue={selectedStake.lockValue}
                className="w-full bg-[#0a0a0a] border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg p-2.5 focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
              >
                <option value="flexible">Flexible (1.0x)</option>
                <option value="30days">30 Days (1.1x)</option>
                <option value="90days">90 Days (1.3x)</option>
                <option value="180days">180 Days (1.6x)</option>
                <option value="365days">1 Year (2.0x ★)</option>
                <option value="2years">2 Years (2.6x ★)</option>
                <option value="3years">3 Years (3.2x ★)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { sendGaslessTransaction("0xStaking" as `0x${string}`, "0xClaim" as `0x${string}`); setIsModalOpen(false); }}
                className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl uppercase tracking-[0.2em] text-[10px] border border-zinc-700/50 hover:border-zinc-500 transition-colors"
              >
                Claim Yield
              </button>
              <button 
                onClick={() => { sendGaslessTransaction("0xStaking" as `0x${string}`, "0xAutoCompound" as `0x${string}`); setIsModalOpen(false); }}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black rounded-xl uppercase tracking-[0.2em] text-[10px] shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all transform hover:-translate-y-0.5"
              >
                Compound
              </button>
            </div>
            
            {selectedStake.type !== 'Flexible' ? (
              <div className="w-full border border-red-900/30 bg-red-950/10 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1 text-[9px] uppercase tracking-widest font-black">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Early Unstake Penalty:</span>
                    <span className="text-red-500">12.5% Burn</span>
                  </div>
                  <span className="text-zinc-600 text-[8px] text-right">(Proportional to time left)</span>
                </div>
                <button className="w-full py-3 bg-red-900/20 text-red-500 hover:bg-red-900/40 hover:text-red-400 border border-red-900/50 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.05)]">
                  Force Early Unstake
                </button>
              </div>
            ) : (
              <div className="w-full border border-zinc-800 bg-[#050505] rounded p-4 flex flex-col gap-3">
                <div className="relative group/input">
                  <input 
                    type="number" 
                    placeholder="0.0" 
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-lg rounded p-3 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-colors">
                    MAX
                  </button>
                </div>
                <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-black uppercase tracking-[0.2em] rounded transition-all">
                  WITHDRAW PARTIAL / FULL
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
