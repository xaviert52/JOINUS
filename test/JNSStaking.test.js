const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("JNSStaking (Phase 3)", function () {
  let JNSToken, jnsToken;
  let JNSStaking, jnsStaking;
  let owner, user1, user2, timelock;
  let TIMELOCK_ROLE;

  beforeEach(async function () {
    [owner, user1, user2, timelock] = await ethers.getSigners();

    JNSToken = await ethers.getContractFactory("JNSToken");
    jnsToken = await upgrades.deployProxy(JNSToken, ["JNS Ecosistema", "JNS", owner.address, owner.address], { kind: "uups" });
    await jnsToken.deployed();

    // 2. Deploy JNSStaking
    JNSStaking = await ethers.getContractFactory("JNSStaking");
    jnsStaking = await upgrades.deployProxy(JNSStaking, [owner.address, jnsToken.address], { kind: "uups", unsafeAllow: ["constructor"] });
    await jnsStaking.deployed();

    TIMELOCK_ROLE = await jnsStaking.TIMELOCK_ROLE();

    // Asignar rol de Timelock
    await jnsStaking.grantRole(TIMELOCK_ROLE, timelock.address);

    // Lista Blanca: Eximir de comisiones (Tax 3%) a Staking y Usuarios 
    // para probar las matemáticas del staking sin ruido del tax.
    await jnsToken.setTaxExempt(jnsStaking.address, true);
    await jnsToken.setTaxExempt(user1.address, true);
    await jnsToken.setTaxExempt(user2.address, true);

    // Fondear usuarios
    await jnsToken.transfer(user1.address, ethers.utils.parseEther("1000"));
    await jnsToken.transfer(user2.address, ethers.utils.parseEther("1000"));

    // Aprobar que JNSStaking gaste JNS
    await jnsToken.connect(user1).approve(jnsStaking.address, ethers.constants.MaxUint256);
    await jnsToken.connect(user2).approve(jnsStaking.address, ethers.constants.MaxUint256);
  });

  describe("Deployment and Initial State", function () {
    it("Should correctly configure the JNSToken reference", async function () {
      expect(await jnsStaking.jnsToken()).to.equal(jnsToken.address);
    });

    it("Should grant DEFAULT_ADMIN_ROLE to the deployer", async function () {
      const adminRole = await jnsStaking.DEFAULT_ADMIN_ROLE();
      expect(await jnsStaking.hasRole(adminRole, owner.address)).to.be.true;
    });
  });

  describe("Core Engine: Staking and JNSX Multipliers", function () {
    it("Should allow a FLEXIBLE deposit and mint 1.0x JNSX", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      // LockType.FLEXIBLE = 0
      await jnsStaking.connect(user1).deposit(depositAmount, 0);

      const jnsxBalance = await jnsStaking.balanceOf(user1.address);
      expect(jnsxBalance).to.equal(depositAmount); // 1.0x

      expect(await jnsStaking.totalJNSLocked()).to.equal(depositAmount);
    });

    it("Should allow a 365 DAYS lock and mint 2.0x JNSX", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      // LockType.DAYS_365 = 4
      await jnsStaking.connect(user2).deposit(depositAmount, 4);

      const jnsxBalance = await jnsStaking.balanceOf(user2.address);
      expect(jnsxBalance).to.equal(depositAmount.mul(2)); // 2.0x
    });
  });

  describe("Governance Checkpointing (DT-006)", function () {
    it("Should natively reflect voting power (auto-delegated at deposit)", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await jnsStaking.connect(user1).deposit(depositAmount, 4); // 200 JNSX

      // Leer getVotingPower proxy function
      const votingPower = await jnsStaking.getVotingPower(user1.address);
      expect(votingPower).to.equal(depositAmount.mul(2));
    });
  });

  describe("Institutional Access / Strategy Fund (DT-004)", function () {
    beforeEach(async function () {
      // Usuario 1 deposita 1000 JNS para generar TVL
      await jnsStaking.connect(user1).deposit(ethers.utils.parseEther("1000"), 0);
    });

    it("Should revert if an unauthorized role tries to access locked funds", async function () {
      await expect(
        jnsStaking.connect(user1).accessLockedFunds(ethers.utils.parseEther("100"), user2.address)
      ).to.be.reverted;
    });

    it("Should strictly revert if Timelock tries to access MORE than 30% of TVL", async function () {
      // 30% of 1000 = 300
      await expect(
        jnsStaking.connect(timelock).accessLockedFunds(ethers.utils.parseEther("301"), timelock.address)
      ).to.be.revertedWith("Cannot access more than 30% of TVL");
    });

    it("Should allow Timelock to access 30% of TVL for strategic deployment", async function () {
      const extractAmount = ethers.utils.parseEther("300");
      await jnsStaking.connect(timelock).accessLockedFunds(extractAmount, timelock.address);

      const timelockBalance = await jnsToken.balanceOf(timelock.address);
      expect(timelockBalance).to.equal(extractAmount);
    });
  });

  describe("Security (Emergency Pausable)", function () {
    it("Should freeze operations when paused by Admin", async function () {
      await jnsStaking.pause();
      // En OpenZeppelin v5 el revert custom es EnforcedPause, usamos revert general para waffle
      await expect(
        jnsStaking.connect(user1).deposit(ethers.utils.parseEther("100"), 0)
      ).to.be.reverted; 
    });

    it("Should allow operations again after unpause", async function () {
      await jnsStaking.pause();
      await jnsStaking.unpause();
      await jnsStaking.connect(user1).deposit(ethers.utils.parseEther("100"), 0);
      expect(await jnsStaking.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("100"));
    });
  });

  describe("Withdrawals and Penalties (Early Unstake)", function () {
    it("Should allow withdrawal with NO penalty if time has passed", async function () {
      const amount = ethers.utils.parseEther("100");
      // deposit 365 days (200 JNSX)
      await jnsStaking.connect(user1).deposit(amount, 4);

      // Increase time by 365 days + 1 second
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");

      const balanceBefore = await jnsToken.balanceOf(user1.address);
      
      // Withdraw 200 JNSX
      await jnsStaking.connect(user1).withdraw(ethers.utils.parseEther("200"), 0);
      
      const balanceAfter = await jnsToken.balanceOf(user1.address);
      expect(balanceAfter.sub(balanceBefore)).to.equal(amount); // Returned 100 JNS
    });

    it("Should penalize 25% for breaking a 365 DAYS lock early", async function () {
      const amount = ethers.utils.parseEther("100");
      await jnsStaking.connect(user2).deposit(amount, 4);

      // Early withdraw
      const balanceBefore = await jnsToken.balanceOf(user2.address);
      
      await jnsStaking.connect(user2).withdraw(ethers.utils.parseEther("200"), 0);

      const balanceAfter = await jnsToken.balanceOf(user2.address);
      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther("75")); // 25% penalty -> 75 returned
    });
  });

  describe("Base Yield Reward Engine", function () {
    beforeEach(async function () {
      // User1 stakes 100 JNS (Flexible = 100 JNSX)
      await jnsStaking.connect(user1).deposit(ethers.utils.parseEther("100"), 0);
      // User2 stakes 100 JNS (365 days = 200 JNSX)
      await jnsStaking.connect(user2).deposit(ethers.utils.parseEther("100"), 4);

      // Total JNSX = 300. User1 has 1/3, User2 has 2/3.

      // Simulate a reward injection of 30 JNS (e.g., from market tax)
      await jnsToken.transfer(jnsStaking.address, ethers.utils.parseEther("30"));
    });

    it("Should distribute rewards proportionally to JNSX balance", async function () {
      const pending1 = await jnsStaking.pendingBaseYield(user1.address);
      const pending2 = await jnsStaking.pendingBaseYield(user2.address);

      expect(pending1).to.equal(ethers.utils.parseEther("10")); // 1/3 of 30
      expect(pending2).to.equal(ethers.utils.parseEther("20")); // 2/3 of 30
    });

    it("Should allow claiming the base yield", async function () {
      const balanceBefore = await jnsToken.balanceOf(user1.address);
      await jnsStaking.connect(user1).claimBaseYield();
      const balanceAfter = await jnsToken.balanceOf(user1.address);

      expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther("10"));
    });

    it("Should auto-compound the base yield natively into new JNSX stakes", async function () {
      // User2 has 20 JNS pending. Auto-compound with 365 Days (2.0x).
      // This should mint 40 JNSX (20 * 2).
      const jnsxBefore = await jnsStaking.balanceOf(user2.address); // 200
      await jnsStaking.connect(user2).autoCompoundBaseYield(4);
      const jnsxAfter = await jnsStaking.balanceOf(user2.address); // 200 + 40 = 240
      
      expect(jnsxAfter.sub(jnsxBefore)).to.equal(ethers.utils.parseEther("40"));
      
      const stakeInfo = await jnsStaking.userStakes(user2.address, 1);
      expect(stakeInfo.amount).to.equal(ethers.utils.parseEther("20"));
      expect(stakeInfo.jnsxMinted).to.equal(ethers.utils.parseEther("40"));
    });
  });
});