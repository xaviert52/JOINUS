'use client';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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

  const stakes = (stakesRaw as any[]) || [];
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
    has365DayLock = stakes.some((s: any) => Number(s.durationInDays) >= 365);
    const maxUnlock = Math.max(...stakes.map((s: any) => Number(s.unlockTime)));
    latestUnlockDate = new Date(maxUnlock * 1000);
  }

  const { writeContract: writeApprove, data: approveHash, error: approveError, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: writeDeposit, data: depositHash, error: depositError, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  const refetchAll = () => {
    refetchJns();
    refetchJnsx();
    refetchStakes();
  };

  return {
    jnsBalance,
    jnsxBalance,
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
    writeApprove,
    approveHash,
    isApprovePending,
    isApproveConfirming,
    isApproveSuccess,
    approveError,

    writeDeposit,
    depositHash,
    isDepositPending,
    isDepositConfirming,
    isDepositSuccess,
    depositError,

    refetchAll
  };
}
