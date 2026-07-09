const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security Edge Cases (Fase 5)", function () {
  let JNSStaking, staking, JNSToken, token, JNSGovernorzk, governor, MockSemaphore, semaphore;
  let owner, user1, user2, attacker;

  beforeEach(async function () {
    [owner, user1, user2, attacker] = await ethers.getSigners();

    // Deploy Mocks
    const TokenFactory = await ethers.getContractFactory("JNSToken");
    token = await upgrades.deployProxy(TokenFactory, ["JNS Token", "JNS", owner.address, owner.address], { initializer: "initialize", unsafeAllow: ["constructor"] });

    const SemaphoreFactory = await ethers.getContractFactory("MockSemaphore");
    semaphore = await SemaphoreFactory.deploy();

    // Deploy Staking
    const StakingFactory = await ethers.getContractFactory("JNSStaking");
    staking = await upgrades.deployProxy(StakingFactory, [owner.address, (token.target || token.address)], { initializer: "initialize", unsafeAllow: ["constructor"] });

    // Set DaoRewardPool to avoid transfer failures during penalty application
    await staking.setDaoRewardPool(owner.address);

    // Deploy GovernorZK
    const GovFactory = await ethers.getContractFactory("JNSGovernorzk");
    governor = await upgrades.deployProxy(GovFactory, [(staking.target || staking.address), (semaphore.target || semaphore.address), 1, owner.address, owner.address], { initializer: "initialize", unsafeAllow: ["constructor"] });

    // Setup initial funds
    await token.transfer(user1.address, ethers.utils.parseEther("10000"));
    await token.transfer(attacker.address, ethers.utils.parseEther("10000"));
    
    // Whitelist staking from fees so calculations align perfectly in tests
    await token.setTaxExempt((staking.target || staking.address), true);
    await token.setTaxExempt(user1.address, true);
    await token.setTaxExempt(attacker.address, true);

    await token.connect(user1).approve((staking.target || staking.address), ethers.utils.parseEther("10000"));
    await token.connect(attacker).approve((staking.target || staking.address), ethers.utils.parseEther("10000"));
  });

  describe("JNSStaking: Reentrancy & Fuzzing", function () {
    it("Should penalize correctly on absurd amounts (Fuzzing Early Unstake)", async function () {
      // Simulate large integer amount (1M JNS)
      const absurdAmount = ethers.utils.parseEther("1000000");
      await token.transfer(user1.address, absurdAmount);
      await token.connect(user1).approve((staking.target || staking.address), absurdAmount);
      
      await staking.connect(user1).deposit(absurdAmount, 4); // 365 Days
      
      // Withdraw immediately to trigger 25% penalty
      const jnsxMinted = absurdAmount.mul(200).div(100); // 2x multiplier
      const initialBalance = await token.balanceOf(user1.address);
      
      await staking.connect(user1).withdraw(jnsxMinted, 0); // 100% withdraw
      
      const finalBalance = await token.balanceOf(user1.address);
      const difference = finalBalance.sub(initialBalance);
      
      // Expected return is 75% of original (25% penalty applied max, but dynamically scales so slightly less)
      const expectedReturn = absurdAmount.mul(75).div(100);
      const tolerance = ethers.utils.parseEther("0.1"); // Small tolerance for timestamp variance
      expect(difference).to.be.closeTo(expectedReturn, tolerance);
    });

    it("Should prevent state manipulation via repeated partial withdraws", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await staking.connect(user1).deposit(depositAmount, 1); // 30 Days
      
      const jnsxMinted = depositAmount.mul(110).div(100);
      
      // Attempt multiple fast partial withdraws to break math (simulated by sequence)
      await staking.connect(user1).withdraw(jnsxMinted.div(4), 0);
      await staking.connect(user1).withdraw(jnsxMinted.div(4), 0);
      
      const stakeInfo = await staking.userStakes(user1.address, 0);
      expect(stakeInfo.amount).to.equal(depositAmount.div(2)); // Exactly half should remain
    });
  });

  describe("JNSGovernorzk: Nullifier Collisions & Replays", function () {
    it("Should permanently lock out used nullifierHashes (Double Vote Attack)", async function () {
      const proposalId = 1;
      const merkleRoot = 12345;
      const nullifierHash = 99999;
      const weight = ethers.utils.parseEther("500");
      const support = 1;

      await governor.setProposalMerkleRoot(proposalId, merkleRoot);
      const proof = [0,0,0,0,0,0,0,0];

      // First vote succeeds
      await governor.connect(user1).castVoteZK(proposalId, support, weight, nullifierHash, proof);

      // Attack: Attempt to replay the same nullifier to artificially inflate votes
      await expect(
        governor.connect(attacker).castVoteZK(proposalId, support, weight, nullifierHash, proof)
      ).to.be.revertedWith("JNSGovernorZK: nullifier already used");

      const proposal = await governor.proposalZKs(proposalId);
      expect(proposal.totalVotesFor).to.equal(weight);
    });
  });
});
