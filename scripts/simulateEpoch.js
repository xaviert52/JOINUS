const hre = require("hardhat");

async function main() {
  console.log("==========================================");
  console.log("⏳ TRAVELING IN TIME: SIMULATING EPOCH...");
  console.log("==========================================\n");

  const NINETY_DAYS_IN_SECONDS = 90 * 24 * 60 * 60; // 7776000

  // Check current block timestamp before fast-forwarding
  const blockBefore = await hre.ethers.provider.getBlock("latest");
  console.log(`Current Block Timestamp: ${blockBefore.timestamp} (${new Date(blockBefore.timestamp * 1000).toLocaleString()})`);

  // Fast forward time
  await hre.network.provider.send("evm_increaseTime", [NINETY_DAYS_IN_SECONDS]);
  
  // Mine a new block
  await hre.network.provider.send("evm_mine");

  const blockAfter = await hre.ethers.provider.getBlock("latest");
  console.log(`\nFast-forwarded by 90 days (${NINETY_DAYS_IN_SECONDS} seconds).`);
  console.log(`New Block Timestamp: ${blockAfter.timestamp} (${new Date(blockAfter.timestamp * 1000).toLocaleString()})`);

  console.log("\n✅ Epoch simulated successfully! You can now test dividend distributions.");
  console.log("==========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error simulating epoch:", error);
    process.exit(1);
  });
