const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Step 1: Deploy JNSToken
  console.log("Deploying JNSToken...");
  const JNSToken = await ethers.getContractFactory("JNSToken");
  // Deploy with placeholder for reward pool set to deployer address
  const jnsToken = await upgrades.deployProxy(JNSToken, ["JNS Token", "JNS", deployer.address, deployer.address], {
    initializer: "initialize",
  });
  await jnsToken.deployed();
  console.log("JNSToken deployed to:", jnsToken.address);

  // Step 2: Deploy StakingContract
  console.log("Deploying StakingContract...");
  const Staking = await ethers.getContractFactory("StakingContract");
  const staking = await Staking.deploy(
    jnsToken.address, // Address of the JNSToken
    deployer.address, // Initial owner
    ethers.utils.parseEther("10000"), // Max stake
    [30 * 24 * 60 * 60, 90 * 24 * 60 * 60, 180 * 24 * 60 * 60, 365 * 24 * 60 * 60], // Lock periods
    [5, 10, 15, 20], // Reward rates
    [20, 15, 10, 5] // Early withdrawal penalties
  );
  await staking.deployed();
  console.log("StakingContract deployed to:", staking.address);

  // Step 3: Set reward pool in JNSToken
  console.log("Setting reward pool in JNSToken...");
  await jnsToken.setRewardPool(staking.address);
  console.log("Reward pool set to:", staking.address);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });