# JNS Ecosistema

## Overview
The **JNS Ecosistema** is a decentralized, bank-grade platform that combines ZK-governance, liquid staking, a hedge fund, and "The Arena" casino to empower the community with a circular cashflow. The project is built on the principles of absolute decentralization, transparency, and perpetual sustainability.

### Key Features
1. **ZK-Governance**: 
   - Anonymous community-driven decision-making using zk-SNARKs for voting privacy.
   - Powered by the $JNS token and $JNSX liquid staking.

2. **Liquid Staking ($JNSX)**:
   - Stake $JNS tokens to receive $JNSX, which yields real-yield rewards and linear time-weighted voting power (from 1.1x to 2.0x).
   - Dynamic APY range from 8% to 25% sustained by transaction taxes, early withdrawal penalties, casino revenue tributes, and hedge fund returns (Real Yield without inflation).

3. **Casino ("The Arena") & Hedge Fund**:
   - Cashflow generator feeding back into the Staking Reward Pool and the Scientific/Philanthropic Launchpad.
   - Hedge fund operates with up to 30% of the long-term locked staking TVL, strictly authorized via governance voting.

---

## Workspace Structure
### The project is organized as follows:
1. vscode/ 
     - settings.json # VSCode-specific settings 
2. JNS-Ecosistema/ 
     - .env # Environment variables (excluded from Git) 
     - .gitignore # Files and folders to ignore in Git 
     - hardhat.config.js # Hardhat configuration for Solidity development 
     - package.json # Node.js dependencies and scripts 
     - README.md # Project documentation 
     - cache/ # Hardhat cache (excluded from Git) 
     - contracts/ # Solidity smart contracts 
          + JNSGovernorzk.sol # ZK Governance contract 
          + JNSStaking.sol # Liquid Staking contract ($JNSX) 
          + TheArenaCasino.sol # Casino & Buyback engine contract
          + Timelock.sol # Timelock controller for proposal execution 
          + Treasury.sol # Treasury management contract 
          + JNSToken.sol # ERC-20 token contract ($JNS) with UUPS and transaction tax
          + interfaces/ # Interfaces for contracts 
     - frontend/ # Frontend code (React-based with viem/wagmi and ERC-4337 Account Abstraction) 
     - scripts/ # Deployment scripts 
     - test/ # Unit tests for smart contracts 

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/) (for interacting with the deployed contracts)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/xaviert52/JNS-Ecosystem.git
   cd JNS-Ecosystem
   ```

2. **Install dependencies**:
   - npm install

3. **Create a .env file with the following variables**:
     - PRIVATE_KEY=your_private_key
     - ARBISCAN_API_KEY=your_arbiscan_api_key
     - INITIAL_OWNER=your_wallet_address
     - TREASURY_ADDRESS=treasury_contract_address
     - TIMELOCK_MIN_DELAY=259200 # 3 days in seconds (minimum required delay)
     - EARLY_WITHDRAWAL_PENALTY=25 # 25% penalty

4. **Compile the contracts**:
   - npx hardhat compile

5. **Run tests**:
   - npx hardhat test


### Deployment
Deploy to Arbitrum Sepolia (Testnet)
1. **Deploy the contracts**:
     - npx hardhat run scripts/deployJNSToken.js --network arbitrumSepolia
     - npx hardhat run scripts/deployTreasury.js --network arbitrumSepolia
     - npx hardhat run scripts/deployStaking.js --network arbitrumSepolia
     - npx hardhat run scripts/deployTimelock.js --network arbitrumSepolia
     - npx hardhat run scripts/deployGovernor.js --network arbitrumSepolia

2. **Verify the contracts on Arbiscan**:
     - npx hardhat verify --network arbitrumSepolia <contract_address> <constructor_arguments>

### Usage
1. **Staking**
     - Stake $JNS tokens to receive $JNSX, earn Real Yield, and gain voting power.
     - Use the frontend to interact with the staking contract.
2. **Governance**
     - Propose and vote anonymously on decisions using $JNSX.
     - Only stakers can participate in governance.
3. **Treasury**
     - Funds are managed transparently and allocated based on governance decisions.
     
### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### Community
Join the revolution and participate in the DAO:
- **Discord:** [Join us on Discord](https://discord.gg/qKhFb4rT3Y)

### License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.