const hre = require("hardhat");

async function main() {
  console.log("Advancing time by 8 days (691200 seconds)...");
  await hre.network.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
  console.log("Mining a block to cement the timestamp...");
  await hre.network.provider.send("hardhat_mine", ["0x1"]);
  console.log("Time advanced successfully. Proposals should be closed if their voting period has elapsed.");
}

main().catch(console.error);
