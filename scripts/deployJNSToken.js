require("dotenv").config();
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  const tokenName = "JNS Token";
  const tokenSymbol = "JNS";
  const treasuryAddress = process.env.TREASURY_ADDRESS;
  const initialOwner = process.env.INITIAL_OWNER;

  if (!treasuryAddress || !initialOwner) {
    throw new Error("Please set TREASURY_ADDRESS and INITIAL_OWNER in your .env file");
  }

  console.log("Deploying JNSToken as UUPS Upgradeable Proxy...");
  const JNSToken = await ethers.getContractFactory("JNSToken");
  const jnsToken = await upgrades.deployProxy(JNSToken, [tokenName, tokenSymbol, initialOwner, treasuryAddress], {
    initializer: "initialize",
  });

  await jnsToken.deployed();
  console.log("JNSToken proxy deployed to:", jnsToken.address);

  // Guardar la dirección del token en el archivo .env
  const envPath = "./.env";
  fs.appendFileSync(envPath, `STAKING_TOKEN_ADDRESS=${jnsToken.address}\n`);
  console.log(`STAKING_TOKEN_ADDRESS saved to ${envPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });