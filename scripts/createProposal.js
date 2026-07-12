const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "frontend", ".env") });

async function main() {
  const governorAddress = process.env.NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS;
  const signers = await hre.ethers.getSigners();
  const founderWallet = signers[4]; // The founder wallet

  console.log("Using Founder Wallet:", founderWallet.address);

  const JNSGovernorzk = await hre.ethers.getContractAt("JNSGovernorzk", governorAddress);
  const jnsToken = await hre.ethers.getContractAt("JNSToken", process.env.NEXT_PUBLIC_JNS_TOKEN_ADDRESS);
  const jnsStaking = await hre.ethers.getContractAt("JNSStaking", process.env.NEXT_PUBLIC_JNS_STAKING_ADDRESS);


  
  console.log("Creating proposal 'PIP-001: Camelot LP Funding'...");
  
  const target = founderWallet.address;
  const value = 0;
  const calldata = "0x";
  const description = "PIP-001: Camelot LP Funding";

  const proposeTx = await JNSGovernorzk.connect(founderWallet).propose(
    [target],
    [value],
    [calldata],
    description
  );
  
  const proposeReceipt = await proposeTx.wait();
  const event = proposeReceipt.events.find(e => e.event === 'ProposalCreated');
  const proposalId = event.args.proposalId;
  
  console.log("Proposal Created! ID:", proposalId.toString());

  const configPath = path.join(__dirname, "..", "frontend", "src", "config", "latestProposal.json");
  fs.writeFileSync(configPath, JSON.stringify({ proposalId: proposalId.toString() }));
  console.log(`Saved proposal ID to ${configPath}`);

  try {
    const votingDelay = await JNSGovernorzk.votingDelay();
    console.log("Voting Delay:", votingDelay.toString());
    const blocksToMine = votingDelay.add(1);
    console.log(`Mining ${blocksToMine.toString()} blocks...`);
    await hre.network.provider.send("hardhat_mine", [hre.ethers.utils.hexValue(blocksToMine)]);
  } catch(e) {
    console.log("Error passing delay:", e.message);
  }

  const state = await JNSGovernorzk.state(proposalId);
  console.log("Current Proposal State (Should be 1 for Active):", state.toString());
}

main().catch(console.error);
