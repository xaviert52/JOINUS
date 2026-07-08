'use client';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { JNS_TOKEN_ADDRESS, JNS_TOKEN_ABI, JNS_STAKING_ADDRESS, JNS_STAKING_ABI } from '@/config/contracts';

export function useStaking() {
  const { address } = useAccount();

  const { data: jnsBalanceRaw } = useReadContract({
    address: JNS_TOKEN_ADDRESS,
    abi: JNS_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Assuming JNSStaking also acts as an ERC20 or has balanceOf for JNSX
  const { data: jnsxBalanceRaw } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const jnsBalance = jnsBalanceRaw ? Number(formatEther(jnsBalanceRaw as bigint)) : 0;
  const jnsxBalance = jnsxBalanceRaw ? Number(formatEther(jnsxBalanceRaw as bigint)) : 0;

  return {
    jnsBalance,
    jnsxBalance,
    baseYieldPending: 120.5, // To be integrated
    extraordinaryDividends: 450.0, // To be integrated
    isCivicDutyMet: true, // To be integrated
    lockMultiplier: 2.0, // To be integrated
    lockedJNS: 2500, // To be integrated
    unlockDate: '2027-07-05', // To be integrated
    has365DayLock: true // To be integrated
  };
}
