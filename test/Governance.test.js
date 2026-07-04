const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Governance ZK (Phase 4)", function () {
  let jnsTimelock, jnsGovernor, mockSemaphore, jnsStaking;
  let owner, user1;

  before(async function () {
    [owner, user1] = await ethers.getSigners();
  });

  describe("JNSTimelock", function () {
    it("Should revert if minDelay is less than 3 days", async function () {
      const Timelock = await ethers.getContractFactory("JNSTimelock");
      
      const minDelay = 2 * 24 * 60 * 60; // 2 days
      const proposers = [owner.address];
      const executors = [owner.address];
      
      await expect(
        upgrades.deployProxy(Timelock, [minDelay, proposers, executors, owner.address])
      ).to.be.revertedWith("JNSTimelock: Delay must be at least 3 days (259200 seconds)");
    });

    it("Should deploy and initialize correctly with a 3-day delay", async function () {
      const Timelock = await ethers.getContractFactory("JNSTimelock");
      
      const minDelay = 3 * 24 * 60 * 60; // 3 days
      const proposers = [owner.address];
      const executors = [owner.address];
      
      jnsTimelock = await upgrades.deployProxy(Timelock, [minDelay, proposers, executors, owner.address]);
      await jnsTimelock.deployed();

      const delay = await jnsTimelock.getMinDelay();
      expect(delay).to.equal(minDelay);
    });
  });

  describe("JNSGovernorzk", function () {
    let jnsToken;

    beforeEach(async function () {
      const JNSToken = await ethers.getContractFactory("JNSToken");
      jnsToken = await upgrades.deployProxy(JNSToken, ["JNS Ecosistema", "JNS", owner.address, owner.address]);
      await jnsToken.deployed();

      const JNSStaking = await ethers.getContractFactory("JNSStaking");
      jnsStaking = await upgrades.deployProxy(JNSStaking, [owner.address, jnsToken.address], { initializer: "initialize", unsafeAllow: ["constructor"] });
      await jnsStaking.deployed();

      const MockSemaphore = await ethers.getContractFactory("MockSemaphore");
      mockSemaphore = await MockSemaphore.deploy();
      await mockSemaphore.deployed();

      const Governor = await ethers.getContractFactory("JNSGovernorzk");
      jnsGovernor = await upgrades.deployProxy(Governor, [jnsStaking.address, mockSemaphore.address, 1], { unsafeAllow: ["constructor"] });
      await jnsGovernor.deployed();
    });

    it("Should deploy and recognize JNSStaking as its token source", async function () {
      const tokenAddress = await jnsGovernor.token();
      expect(tokenAddress).to.equal(jnsStaking.address);
    });

    it("Should update the public civic registry (hasParticipated) when a ZK vote is cast", async function () {
      await jnsToken.approve(jnsStaking.address, ethers.utils.parseEther("100"));
      await jnsStaking.deposit(ethers.utils.parseEther("100"), 0); 
      
      await ethers.provider.send("evm_mine", []);

      const grantTx = await jnsGovernor.propose(
        [owner.address],
        [0],
        ["0x"],
        "Proposal #1: Test ZK Anonymity"
      );
      const receipt = await grantTx.wait();
      
      const event = receipt.events.find(e => e.event === "ProposalCreated");
      const proposalId = event.args.proposalId;
      
      await ethers.provider.send("evm_increaseTime", [1.5 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const nullifierHash = 123456789;
      const proof = [0, 0, 0, 0, 0, 0, 0, 0];
      
      await jnsGovernor.connect(user1).castVoteZK(
        proposalId,
        1, // support (For)
        ethers.utils.parseEther("10"), // simulated weight
        20, // tree depth
        111111, // root
        nullifierHash,
        proof
      );

      const epoch = await jnsGovernor.currentEpoch();
      const participated = await jnsGovernor.hasParticipated(epoch, user1.address);
      expect(participated).to.be.true;
    });
  });
});
