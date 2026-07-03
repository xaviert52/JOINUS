const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("JNSToken", function () {
  let JNSToken;
  let jnsToken;
  let owner;
  let rewardPool;
  let user1;
  let user2;

  const MAX_SUPPLY = ethers.utils.parseEther("10000000"); // 10,000,000 tokens

  beforeEach(async function () {
    [owner, rewardPool, user1, user2] = await ethers.getSigners();

    // Deploy JNSToken as an upgradeable UUPS proxy
    JNSToken = await ethers.getContractFactory("JNSToken");
    jnsToken = await upgrades.deployProxy(
      JNSToken,
      ["JNS Token", "JNS", owner.address, rewardPool.address],
      { initializer: "initialize" }
    );
    await jnsToken.deployed();
  });

  describe("Deployment and Initialization", function () {
    it("Should set the right owner", async function () {
      expect(await jnsToken.owner()).to.equal(owner.address);
    });

    it("Should set the reward pool address correctly", async function () {
      expect(await jnsToken.rewardPoolAddress()).to.equal(rewardPool.address);
    });

    it("Should mint the MAX_SUPPLY capped at 10M to the owner", async function () {
      const ownerBalance = await jnsToken.balanceOf(owner.address);
      const totalSupply = await jnsToken.totalSupply();

      expect(totalSupply).to.equal(MAX_SUPPLY);
      expect(ownerBalance).to.equal(MAX_SUPPLY);
    });

    it("Should automatically add the deployer (owner) and contract to isTaxExempt", async function () {
      expect(await jnsToken.isTaxExempt(owner.address)).to.be.true;
      expect(await jnsToken.isTaxExempt(jnsToken.address)).to.be.true;
      expect(await jnsToken.isTaxExempt(user1.address)).to.be.false;
    });
  });

  describe("Validation of Exemptions and Transfer Tax Mechanism (3%)", function () {
    beforeEach(async function () {
      // Transfer 1,000 JNS to user1 to test standard non-exempt transfers.
      // Since owner is in isTaxExempt, this transfer incurs no tax.
      const transferAmount = ethers.utils.parseEther("1000");
      await jnsToken.transfer(user1.address, transferAmount);
    });

    it("Deployer (exempt) should be able to transfer without paying the 3% tax", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      // owner (exempt) sends 100 JNS to user2
      await jnsToken.transfer(user2.address, transferAmount);

      // user2 should receive the full amount
      expect(await jnsToken.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Should apply exactly 3% retention on a regular trade between non-exempt users (1% burn, 2% reward pool)", async function () {
      const initialTotalSupply = await jnsToken.totalSupply();
      const initialRewardPoolBalance = await jnsToken.balanceOf(rewardPool.address);
      
      const transferAmount = ethers.utils.parseEther("100");
      
      // Calculate expected tax distribution
      const burnAmount = transferAmount.mul(1).div(100);
      const rewardAmount = transferAmount.mul(2).div(100);
      const netAmount = transferAmount.sub(burnAmount).sub(rewardAmount);

      // user1 sends 100 JNS to user2
      await expect(jnsToken.connect(user1).transfer(user2.address, transferAmount))
        .to.emit(jnsToken, "Transfer")
        .withArgs(user1.address, ethers.constants.AddressZero, burnAmount)
        .to.emit(jnsToken, "Transfer")
        .withArgs(user1.address, rewardPool.address, rewardAmount)
        .to.emit(jnsToken, "Transfer")
        .withArgs(user1.address, user2.address, netAmount);

      // Verify recipient received exactly 97%
      expect(await jnsToken.balanceOf(user2.address)).to.equal(netAmount);

      // Verify reward pool received exactly 2%
      const newRewardPoolBalance = await jnsToken.balanceOf(rewardPool.address);
      expect(newRewardPoolBalance.sub(initialRewardPoolBalance)).to.equal(rewardAmount);

      // Verify 1% was burned (Total supply decreased by 1%)
      const finalTotalSupply = await jnsToken.totalSupply();
      expect(initialTotalSupply.sub(finalTotalSupply)).to.equal(burnAmount);
    });

    it("Should not apply tax if the recipient is exempt", async function () {
      // Set user2 as exempt using setTaxExempt
      await jnsToken.setTaxExempt(user2.address, true);

      const transferAmount = ethers.utils.parseEther("100");
      
      // user1 (not exempt) sends 100 JNS to user2 (exempt)
      await jnsToken.connect(user1).transfer(user2.address, transferAmount);

      // user2 should receive the full amount
      expect(await jnsToken.balanceOf(user2.address)).to.equal(transferAmount);
    });
  });

  describe("Pausable Functionality", function () {
    beforeEach(async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await jnsToken.transfer(user1.address, transferAmount);
    });

    it("Should freeze movements immediately when paused", async function () {
      await jnsToken.pause();

      const transferAmount = ethers.utils.parseEther("100");
      await expect(
        jnsToken.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.reverted;
    });
  });
});