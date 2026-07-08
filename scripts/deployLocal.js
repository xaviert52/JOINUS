const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy JNSToken (ERC20 UUPS Upgradeable)
  const JNSToken = await hre.ethers.getContractFactory("JNSToken");
  const jnsToken = await hre.upgrades.deployProxy(JNSToken, [deployer.address], { kind: 'uups' });
  await jnsToken.waitForDeployment();
  const tokenAddress = await jnsToken.getAddress();
  console.log("JNSToken deployed to:", tokenAddress);

  // 2. Deploy JNSTimelock
  const minDelay = 259200; // 3 days
  const proposers = [];
  const executors = [];
  const admin = deployer.address;
  const JNSTimelock = await hre.ethers.getContractFactory("JNSTimelock");
  const timelock = await JNSTimelock.deploy(minDelay, proposers, executors, admin);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("JNSTimelock deployed to:", timelockAddress);

  // 3. Deploy JNSStaking
  const JNSStaking = await hre.ethers.getContractFactory("JNSStaking");
  const staking = await hre.upgrades.deployProxy(JNSStaking, [tokenAddress, timelockAddress], { kind: 'uups' });
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("JNSStaking deployed to:", stakingAddress);

  // 4. Deploy JNSGovernorzk
  const JNSGovernorzk = await hre.ethers.getContractFactory("JNSGovernorzk");
  const governor = await JNSGovernorzk.deploy(stakingAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("JNSGovernorzk deployed to:", governorAddress);

  console.log("\n=======================================================");
  console.log("🚀 LOCALHOST DEPLOYMENT COMPLETE!");
  console.log("Add these addresses to frontend/.env.local:");
  console.log(`NEXT_PUBLIC_JNS_TOKEN_ADDRESS="${tokenAddress}"`);
  console.log(`NEXT_PUBLIC_JNS_STAKING_ADDRESS="${stakingAddress}"`);
  console.log(`NEXT_PUBLIC_JNS_TIMELOCK_ADDRESS="${timelockAddress}"`);
  console.log(`NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS="${governorAddress}"`);
  console.log("=======================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
