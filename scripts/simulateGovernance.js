const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "frontend", ".env") });

async function main() {
  const governorAddress = process.env.NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS;
  
  const signers = await hre.ethers.getSigners();
  const founderWallet = signers[4]; // The founder wallet (index 4)

  console.log("Using Founder Wallet:", founderWallet.address);

  const JNSGovernorzk = await hre.ethers.getContractAt("JNSGovernorzk", governorAddress);
  const jnsToken = await hre.ethers.getContractAt("JNSToken", process.env.NEXT_PUBLIC_JNS_TOKEN_ADDRESS);
  const jnsStaking = await hre.ethers.getContractAt("JNSStaking", process.env.NEXT_PUBLIC_JNS_STAKING_ADDRESS);

  console.log("Staking JNS to get voting power...");
  const stakeAmount = hre.ethers.utils.parseEther("15000");
  await jnsToken.connect(founderWallet).approve(jnsStaking.address, stakeAmount);
  await jnsStaking.connect(founderWallet).deposit(stakeAmount, 4); // 365 days
  try {
    await jnsStaking.connect(founderWallet).delegate(founderWallet.address);
    console.log("Delegated voting power to self.");
  } catch(e) {
    console.log("Could not delegate (maybe not ERC20Votes?):", e.message);
  }
  
  console.log("Creating proposal 'PIP-001: Camelot Liquidity Bootstrapping'...");
  
  const target = founderWallet.address;
  const value = 0;
  const calldata = "0x";
  const description = "PIP-001: Camelot Liquidity Bootstrapping";

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

  // Save proposal ID to a JSON file so frontend can read it
  const configPath = path.join(__dirname, "..", "frontend", "src", "config", "latestProposal.json");
  fs.writeFileSync(configPath, JSON.stringify({ proposalId: proposalId.toString() }));
  console.log(`Saved proposal ID to ${configPath}`);

  try {
    const votingDelay = await JNSGovernorzk.votingDelay();
    console.log("Voting Delay:", votingDelay.toString());
    const blocksToMine = votingDelay.add(1);
    console.log(`Mining ${blocksToMine.toString()} blocks...`);
    await hre.network.provider.send("hardhat_mine", [hre.ethers.utils.hexValue(blocksToMine)]);
    
    // DEBUG
    const snapshot = await JNSGovernorzk.proposalSnapshot(proposalId);
    const clock = await JNSGovernorzk.clock();
    console.log("Snapshot:", snapshot.toString(), "Clock:", clock.toString());
    if (clock.lte(snapshot)) {
      console.log("Clock is still less than or equal to snapshot! Let's jump time.");
      await hre.network.provider.send("evm_increaseTime", [86400]);
      await hre.network.provider.send("evm_mine");
      console.log("New Clock:", (await JNSGovernorzk.clock()).toString());
    }
  } catch(e) {
    console.log("Error passing delay:", e.message);
  }

  console.log("Voting in favor...");
  await JNSGovernorzk.connect(founderWallet).castVote(proposalId, 1);
  console.log("Voted in favor.");

  try {
    const votingPeriod = await JNSGovernorzk.votingPeriod();
    console.log("Voting Period:", votingPeriod.toString());
    const blocksToMine2 = votingPeriod.add(1);
    console.log(`Mining ${blocksToMine2.toString()} blocks...`);
    await hre.network.provider.send("hardhat_mine", [hre.ethers.utils.hexValue(blocksToMine2)]);
  } catch(e) {
    console.log("Error passing period:", e.message);
  }
  
  const state = await JNSGovernorzk.state(proposalId);
  console.log("Time advanced. Current Proposal State:", state.toString());
}

main().catch(console.error);
