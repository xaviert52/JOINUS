const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  
  // 8 Genesis Wallets
  const liquidityWallet = signers[1];
  const launchpadWallet = signers[2];
  const hedgeFundWallet = signers[3];
  const founderWallet = signers[4];
  const devsWallet = signers[5];
  const incentivesWallet = signers[6];
  const communityWallet = signers[7];

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

  // 2. Deploy JNS_Treasury (fallback)
  const JNS_Treasury = await hre.ethers.getContractFactory("JNS_Treasury");
  const treasuryContract = await JNS_Treasury.deploy();
  await treasuryContract.deployed();
  const treasuryContractAddress = treasuryContract.address;
  console.log("JNS_Treasury Contract deployed to:", treasuryContractAddress);

  // 3. Deploy JNSToken
  const JNSToken = await hre.ethers.getContractFactory("JNSToken");
  const jnsToken = await hre.upgrades.deployProxy(
    JNSToken, 
    ["JOINUS", "JNS", deployer.address, treasuryContractAddress], 
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

  // ==========================================
  // DISTRIBUCIÓN ESTRICTA DE 8 BÓVEDAS (10M $JNS)
  // ==========================================
  console.log("\n--- Executing Genesis Distribution (8 Vaults) ---");
  
  const stakeAmount = hre.ethers.utils.parseEther("2500000");     // 2.5M to Staking (RewardPool)
  const liqAmount = hre.ethers.utils.parseEther("2500000");       // 2.5M to Liquidity
  const launchpadAmount = hre.ethers.utils.parseEther("1000000"); // 1.0M to Launchpad
  const hedgeFundAmount = hre.ethers.utils.parseEther("1000000"); // 1.0M to Hedge Fund
  const founderAmount = hre.ethers.utils.parseEther("700000");    // 0.7M to Founder
  const devsAmount = hre.ethers.utils.parseEther("800000");       // 0.8M to Devs & Advisors
  const incAmount = hre.ethers.utils.parseEther("1000000");       // 1.0M to Incentives/Paymaster
  const commAmount = hre.ethers.utils.parseEther("500000");       // 0.5M to Community

  await jnsToken.transfer(stakingAddress, stakeAmount);
  console.log("Transferred 2.5M $JNS to Staking (RewardPool)");

  await jnsToken.transfer(liquidityWallet.address, liqAmount);
  console.log("Transferred 2.5M $JNS to Liquidity Wallet");

  await jnsToken.transfer(launchpadWallet.address, launchpadAmount);
  console.log("Transferred 1.0M $JNS to Launchpad Wallet");

  await jnsToken.transfer(hedgeFundWallet.address, hedgeFundAmount);
  console.log("Transferred 1.0M $JNS to Hedge Fund Wallet");

  await jnsToken.transfer(founderWallet.address, founderAmount);
  console.log("Transferred 0.7M $JNS to Founder Wallet");

  await jnsToken.transfer(devsWallet.address, devsAmount);
  console.log("Transferred 0.8M $JNS to Devs & Advisors Wallet");

  await jnsToken.transfer(incentivesWallet.address, incAmount);
  console.log("Transferred 1.0M $JNS to Incentives/Paymaster Wallet");

  await jnsToken.transfer(communityWallet.address, commAmount);
  console.log("Transferred 0.5M $JNS to Community Wallet");

  // Retrieve deterministic private keys from Hardhat default mnemonic
  const mnemonic = "test test test test test test test test test test test junk";
  const deriveKey = (index) => hre.ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`).privateKey;

  console.log("\n=======================================================");
  console.log("🚀 LOCALHOST DEPLOYMENT & DISTRIBUTION COMPLETE!");
  
  // Auto-inject .env to frontend
  const envPath = path.join(__dirname, "..", "frontend", ".env");
  const envContent = `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_PIMLICO_API_KEY="your_pimlico_api_key"

# Smart Contracts
NEXT_PUBLIC_JNS_TOKEN_ADDRESS="${tokenAddress}"
NEXT_PUBLIC_JNS_STAKING_ADDRESS="${stakingAddress}"
NEXT_PUBLIC_JNS_TIMELOCK_ADDRESS="${timelockAddress}"
NEXT_PUBLIC_JNS_GOVERNOR_ADDRESS="${governorAddress}"

# Genesis Wallets
NEXT_PUBLIC_LIQUIDITY_WALLET="${liquidityWallet.address}"
NEXT_PUBLIC_LAUNCHPAD_WALLET="${launchpadWallet.address}"
NEXT_PUBLIC_HEDGE_FUND_WALLET="${hedgeFundWallet.address}"
NEXT_PUBLIC_FOUNDER_WALLET="${founderWallet.address}"
NEXT_PUBLIC_DEVS_WALLET="${devsWallet.address}"
NEXT_PUBLIC_INCENTIVES_WALLET="${incentivesWallet.address}"
NEXT_PUBLIC_COMMUNITY_WALLET="${communityWallet.address}"

# Local Hardhat Private Keys (For Testing Only)
NEXT_PUBLIC_LIQUIDITY_PK="${deriveKey(1)}"
NEXT_PUBLIC_LAUNCHPAD_PK="${deriveKey(2)}"
NEXT_PUBLIC_HEDGE_FUND_PK="${deriveKey(3)}"
NEXT_PUBLIC_FOUNDER_PK="${deriveKey(4)}"
NEXT_PUBLIC_DEVS_PK="${deriveKey(5)}"
NEXT_PUBLIC_INCENTIVES_PK="${deriveKey(6)}"
NEXT_PUBLIC_COMMUNITY_PK="${deriveKey(7)}"
`;
  fs.writeFileSync(envPath, envContent);
  console.log(`Auto-injected contract & wallet addresses into ${envPath}`);
  console.log("=======================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
