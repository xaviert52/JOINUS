'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { JNS_STAKING_ADDRESS } from '@/config/contracts';

export function useGovernance() {
  const { address } = useAccount();

  const { data: jnsxBalanceRaw } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const votingPower = jnsxBalanceRaw ? Number(formatEther(jnsxBalanceRaw as bigint)) : 0;

  return {
    votingPower,
    civicDutyEpoch: "Epoch 1: 100% Attended",
    activeProposals: [
      {
        id: 1,
        title: "Proposal 01: Activate Hedge Fund deployment to Aave",
        description: "Authorizes the DAO Treasury to bridge 500k USDC to Aave V3 on Ethereum Mainnet to capture Base Yield directly into the Ecosystem.",
        status: "Active",
        timeLeft: "2 Days, 4 Hrs",
        quorumProgress: 65,
        maskedVotes: { for: '?', against: '?', abstain: '?' }
      },
      {
        id: 2,
        title: "Proposal 02: Fund Clean Water Initiative via Launchpad",
        description: "Deploys 50k JNS tokens from the Venture Fund to back the Clean Water NGO Launchpad IDO, validating our real world impact commitments.",
        status: "Active",
        timeLeft: "5 Days, 12 Hrs",
        quorumProgress: 42,
        maskedVotes: { for: '?', against: '?', abstain: '?' }
      }
    ]
  };
}
