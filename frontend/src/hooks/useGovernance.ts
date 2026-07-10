'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { JNS_STAKING_ADDRESS } from '@/config/contracts';
import latestProposal from '@/config/latestProposal.json';

const GOVERNOR_ABI = [
  { name: 'state', type: 'function', stateMutability: 'view', inputs: [{ name: 'proposalId', type: 'uint256' }], outputs: [{ type: 'uint8' }] },
];

export function useGovernance() {
  const { address } = useAccount();

  const { data: jnsxBalanceRaw } = useReadContract({
    address: JNS_STAKING_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const votingPower = jnsxBalanceRaw ? Number(formatEther(jnsxBalanceRaw as bigint)) : 0;

  const { data: proposalState } = useReadContract({
    address: process.env.NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'state',
    args: latestProposal?.proposalId ? [BigInt(String(latestProposal.proposalId))] : undefined,
  });

  const stateMap: Record<number, string> = {
    0: 'Pending', 1: 'Active', 2: 'Canceled', 3: 'Defeated', 4: 'Succeeded', 5: 'Queued', 6: 'Expired', 7: 'Executed'
  };

  const currentStatus = proposalState !== undefined ? stateMap[Number(proposalState)] : 'Pending';

  return {
    votingPower,
    civicDutyEpoch: "Epoch 1: 100% Attended",
    activeProposals: [
      {
        id: 1,
        title: "PIP-001: Camelot Liquidity Bootstrapping",
        description: "Authorizes the DAO Treasury to bridge 500k USDC to Aave V3 on Ethereum Mainnet to capture Base Yield directly into the Ecosystem.",
        status: currentStatus,
        timeLeft: currentStatus === 'Active' ? "2 Days, 4 Hrs" : "Voting Closed",
        quorumProgress: currentStatus === 'Active' ? 65 : 100,
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
