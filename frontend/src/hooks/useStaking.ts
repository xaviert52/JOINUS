'use client';
import { useAccount, useReadContract, useWriteContract, useConfig, useWaitForTransactionReceipt } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { formatEther } from 'viem';
import { JNS_TOKEN_ADDRESS, JNS_TOKEN_ABI, JNS_STAKING_ADDRESS, JNS_STAKING_ABI } from '@/config/contracts';

export function useStaking() {
  const { address } = useAccount();

  const { data: jnsBalanceRaw, refetch: refetchJns } = useReadContract({
    address: JNS_TOKEN_ADDRESS,
    abi: JNS_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: JNS_TOKEN_ADDRESS,
    abi: JNS_TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, JNS_STAKING_ADDRESS] : undefined,
  });

  // Assuming JNSStaking also acts as an ERC20 or has balanceOf for JNSX
  const { data: jnsxBalanceRaw, refetch: refetchJnsx } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stakesRaw, refetch: refetchStakes } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: JNS_STAKING_ABI,
    functionName: 'getUserStakes',
    args: address ? [address] : undefined,
  });

  const jnsBalance = jnsBalanceRaw ? Number(formatEther(jnsBalanceRaw as bigint)) : 0;
  const jnsxBalance = jnsxBalanceRaw ? Number(formatEther(jnsxBalanceRaw as bigint)) : 0;
  const allowance = allowanceRaw ? Number(formatEther(allowanceRaw as bigint)) : 0;

  const rawStakes = (stakesRaw as any[]) || [];
  const stakes = rawStakes.map(stake => {
    // Handling wagmi tuple array or struct object
    if (Array.isArray(stake)) {
      return {
        amount: stake[0],
        jnsxMinted: stake[1],
        unlockTime: stake[2],
        lockType: stake[3]
      };
    }
    return stake;
  });

  const hasLockedPositions = stakes.length > 0;
  
  // Values pending real contract integration
  const baseYieldPending = 0;
  const extraordinaryDividends = 0;
  const isCivicDutyMet = true;
  
  let lockedJNS = 0;
  let has365DayLock = false;
  let latestUnlockDate = new Date();
  
  if (stakes.length > 0) {
    lockedJNS = stakes.reduce((acc: number, stake: any) => acc + Number(formatEther(stake.amount)), 0);
    has365DayLock = stakes.some((s: any) => Number(s.lockType) >= 4);
    const maxUnlock = Math.max(...stakes.map((s: any) => Number(s.unlockTime)));
    latestUnlockDate = new Date(maxUnlock * 1000);
  }

  const config = useConfig();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  const refetchAll = () => {
    refetchJns();
    refetchJnsx();
    refetchStakes();
    refetchAllowance();
  };

  return {
    jnsBalance,
    jnsxBalance,
    allowance,
    baseYieldPending,
    extraordinaryDividends,
    isCivicDutyMet,
    lockedJNS,
    unlockDate: stakes.length > 0 ? latestUnlockDate.toISOString().split('T')[0] : '-',
    has365DayLock,
    hasLockedPositions,
    stakes,
    daysUntilNextClaim: 5,
    
    // Write functions
    config,
    writeContractAsync,
    isWritePending,

    refetchAll
  };
}
