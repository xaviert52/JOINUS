const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy JNSTimelock
  const minDelay = 259200; // 3 days in seconds
  const proposers = [];
  const executors = [];
  const admin = deployer.address;
  const JNSTimelock = await hre.ethers.getContractFactory("JNSTimelock");
  const timelock = await hre.upgrades.deployProxy(
    JNSTimelock,
    [minDelay, proposers, executors, admin],
    { initializer: "initialize", unsafeAllow: ["constructor"] }
  );
  await timelock.deployed();
  const timelockAddress = timelock.address;
  console.log("JNSTimelock deployed to:", timelockAddress);

  // 2. Deploy JNS_Treasury
  const JNS_Treasury = await hre.ethers.getContractFactory("JNS_Treasury");
  const treasury = await JNS_Treasury.deploy();
  await treasury.deployed();
  const treasuryAddress = treasury.address;
  console.log("JNS_Treasury deployed to:", treasuryAddress);

  // 3. Deploy JNSToken (ERC20 UUPS Upgradeable)
  const JNSToken = await hre.ethers.getContractFactory("JNSToken");
  const jnsToken = await hre.upgrades.deployProxy(
    JNSToken, 
    ["JOINUS", "JNS", deployer.address, treasuryAddress], 
    { initializer: "initialize", kind: 'uups', unsafeAllow: ["constructor"] }
  );
  await jnsToken.deployed();
  const tokenAddress = jnsToken.address;
  console.log("JNSToken deployed to:", tokenAddress);

  // 4. Deploy JNSStaking
  const JNSStaking = await hre.ethers.getContractFactory("JNSStaking");
  const staking = await hre.upgrades.deployProxy(
    JNSStaking, 
    [deployer.address, tokenAddress], 
    { initializer: "initialize", kind: 'uups', unsafeAllow: ["constructor"] }
  );
  await staking.deployed();
  const stakingAddress = staking.address;
  console.log("JNSStaking deployed to:", stakingAddress);

  // 5. Deploy JNSGovernorzk
  const MockSemaphore = await hre.ethers.getContractFactory("MockSemaphore");
  const semaphore = await MockSemaphore.deploy();
  await semaphore.deployed();
  const semaphoreAddress = semaphore.address;
  
  const JNSGovernorzk = await hre.ethers.getContractFactory("JNSGovernorzk");
  const governor = await hre.upgrades.deployProxy(
    JNSGovernorzk, 
    [stakingAddress, semaphoreAddress, 1, deployer.address, deployer.address], 
    { initializer: "initialize", unsafeAllow: ["constructor"] }
  );
  await governor.deployed();
  const governorAddress = governor.address;
  console.log("JNSGovernorzk deployed to:", governorAddress);

  console.log("\n=======================================================");
  console.log("🚀 LOCALHOST DEPLOYMENT COMPLETE!");
  
  // Auto-inject .env to frontend
  const envPath = path.join(__dirname, "..", "frontend", ".env");
  const envContent = `NEXT_PUBLIC_JNS_TOKEN_ADDRESS="${tokenAddress}"
NEXT_PUBLIC_JNS_STAKING_ADDRESS="${stakingAddress}"
NEXT_PUBLIC_JNS_TIMELOCK_ADDRESS="${timelockAddress}"
NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS="${governorAddress}"
`;
  fs.writeFileSync(envPath, envContent);
  console.log(`Auto-injected contract addresses into ${envPath}`);
  console.log("=======================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
