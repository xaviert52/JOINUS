'use client';

export function useGovernance() {
  return {
    votingPower: 2500,
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
