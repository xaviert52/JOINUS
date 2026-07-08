// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IJNSGovernor {
    function hasMetCivicDuty(address user, uint256 epochId) external view returns (bool);
}

/// @title JNSStaking
/// @notice Motor principal de Staking y contrato LST ($JNSX) para el JNS Ecosistema.
contract JNSStaking is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20PermitUpgradeable, 
    ERC20VotesUpgradeable, 
    AccessControlUpgradeable, 
    ReentrancyGuard, 
    PausableUpgradeable, 
    UUPSUpgradeable 
{
    bytes32 public constant TIMELOCK_ROLE = keccak256("TIMELOCK_ROLE");

    IERC20 public jnsToken;
    uint256 public totalJNSLocked;

    enum LockType { FLEXIBLE, DAYS_30, DAYS_90, DAYS_180, DAYS_365, DAYS_730, DAYS_1095 }

    struct StakeInfo {
        uint256 amount;
        uint256 jnsxMinted;
        uint256 unlockTime;
        LockType lockType;
    }

    mapping(address => StakeInfo[]) public userStakes;

    // --- REWARD ENGINE VARIABLES ---
    uint256 public accRewardPerShare;
    uint256 public jnsBalanceAccounted;
    address public daoRewardPool; // Si es address(0) o este contrato, las penas se auto-reinvierten
    uint256 public strategicDeployed; // JNS prestado al Timelock
    uint256 public lastRewardTime; // Para prorratear la emision semanal asintotica
    uint256 public healthTargetWeeks; // Factor gobernable para el APY asintotico

    mapping(address => uint256) public rewardDebt;
    mapping(address => uint256) public pendingRewards;
    mapping(address => uint256) public lastClaimTime;

    // --- DUAL VAULT & CIVIC EPOCHS ---
    IERC20 public dividendToken;
    IJNSGovernor public governorContract;

    uint256 public currentEpoch;
    uint256 public totalJNSX365; // Tracker global de JNSX en locks de 365 días
    
    mapping(uint256 => uint256) public epochTotalDividends;
    mapping(uint256 => uint256) public epochTotalEligibleShares;
    mapping(uint256 => uint256) public epochEndTimes;
    mapping(uint256 => mapping(address => bool)) public hasClaimedDividend;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Inicializa el contrato configurando los roles iniciales y dependencias.
    function initialize(address _admin, address _jnsToken) public initializer {
        __ERC20_init("Liquid JNS", "JNSX");
        __ERC20Permit_init("Liquid JNS");
        __ERC20Votes_init();
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        jnsToken = IERC20(_jnsToken);
        lastRewardTime = block.timestamp;
        healthTargetWeeks = 530;
    }

    function setDaoRewardPool(address _pool) external onlyRole(DEFAULT_ADMIN_ROLE) {
        daoRewardPool = _pool;
    }

    // ==========================================
    // REWARD ENGINE
    // ==========================================
    
    /// @notice Detecta ingresos pasivos y actualiza el indice global de recompensas usando emision asintotica
    function updateReward() public {
        uint256 currentBalance = jnsToken.balanceOf(address(this));
        if (currentBalance > jnsBalanceAccounted) {
            uint256 rewardPoolBalance = currentBalance - jnsBalanceAccounted;
            uint256 totalJNSX = totalSupply();
            if (totalJNSX > 0 && lastRewardTime > 0) {
                uint256 timeElapsed = block.timestamp - lastRewardTime;
                uint256 hTarget = healthTargetWeeks > 0 ? healthTargetWeeks : 530;
                uint256 weeklyEmission = rewardPoolBalance / hTarget;
                uint256 newRewards = (weeklyEmission * timeElapsed) / 7 days;
                
                if (newRewards > rewardPoolBalance) {
                    newRewards = rewardPoolBalance;
                }
                
                if (newRewards > 0) {
                    accRewardPerShare += (newRewards * 1e18) / totalJNSX;
                    jnsBalanceAccounted += newRewards;
                }
            }
            lastRewardTime = block.timestamp;
        } else {
            lastRewardTime = block.timestamp;
        }
    }

    function _updateUserReward(address account) internal {
        updateReward();
        if (balanceOf(account) > 0) {
            uint256 pending = ((balanceOf(account) * accRewardPerShare) / 1e18) - rewardDebt[account];
            if (pending > 0) {
                pendingRewards[account] += pending;
            }
        }
    }

    function _updateRewardDebt(address account) internal {
        rewardDebt[account] = (balanceOf(account) * accRewardPerShare) / 1e18;
    }

    function pendingBaseYield(address account) public view returns (uint256) {
        uint256 acc = accRewardPerShare;
        uint256 currentBalance = jnsToken.balanceOf(address(this));
        
        if (currentBalance > jnsBalanceAccounted && totalSupply() > 0 && lastRewardTime > 0) {
            uint256 rewardPoolBalance = currentBalance - jnsBalanceAccounted;
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 hTarget = healthTargetWeeks > 0 ? healthTargetWeeks : 530;
            uint256 weeklyEmission = rewardPoolBalance / hTarget;
            uint256 newRewards = (weeklyEmission * timeElapsed) / 7 days;
            
            if (newRewards > rewardPoolBalance) {
                newRewards = rewardPoolBalance;
            }
            
            acc += (newRewards * 1e18) / totalSupply();
        }
        
        uint256 pending = ((balanceOf(account) * acc) / 1e18) - rewardDebt[account];
        return pendingRewards[account] + pending;
    }

    // ==========================================
    // DEPOSIT & WITHDRAW
    // ==========================================

    function deposit(uint256 _amount, LockType _lockType) external nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");

        // El balance accounted debe aumentar antes del updateReward inducido por el mint, 
        // para que el capital no sea tomado como yield pasivo.
        require(jnsToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        jnsBalanceAccounted += _amount;

        uint256 multiplier = _getMultiplier(_lockType);
        uint256 duration = _getDuration(_lockType);

        uint256 amountJNSX = (_amount * multiplier) / 100;
        uint256 unlockTime = block.timestamp + duration;

        userStakes[msg.sender].push(StakeInfo({
            amount: _amount,
            jnsxMinted: amountJNSX,
            unlockTime: unlockTime,
            lockType: _lockType
        }));

        totalJNSLocked += _amount;
        if (_lockType == LockType.DAYS_365) {
            totalJNSX365 += amountJNSX;
        }
        
        // _mint dispara _update, el cual actualiza _updateUserReward y _updateRewardDebt
        _mint(msg.sender, amountJNSX);
        
        if (delegates(msg.sender) == address(0)) {
            _delegate(msg.sender, msg.sender);
        }
    }

    function withdraw(uint256 _amountJNSX, uint256 _stakeIndex) external nonReentrant whenNotPaused {
        StakeInfo storage stake = userStakes[msg.sender][_stakeIndex];
        require(stake.jnsxMinted >= _amountJNSX, "Not enough JNSX in stake");
        require(_amountJNSX > 0, "Amount must be > 0");

        uint256 multiplier = _getMultiplier(stake.lockType);
        uint256 amountJNS = (_amountJNSX * 100) / multiplier;

        stake.jnsxMinted -= _amountJNSX;
        stake.amount -= amountJNS;
        totalJNSLocked -= amountJNS;
        if (stake.lockType == LockType.DAYS_365) {
            totalJNSX365 -= _amountJNSX;
        }

        uint256 penalty = 0;
        if (block.timestamp < stake.unlockTime) {
            penalty = (amountJNS * _getPenaltyRate(stake.lockType)) / 100;
        }

        uint256 amountToUser = amountJNS - penalty;

        // Quema JNSX. Dispara actualización de recompensas para msg.sender.
        _burn(msg.sender, _amountJNSX);

        require(jnsToken.transfer(msg.sender, amountToUser), "Transfer failed");
        jnsBalanceAccounted -= amountToUser;

        if (penalty > 0) {
            if (daoRewardPool != address(0) && daoRewardPool != address(this)) {
                require(jnsToken.transfer(daoRewardPool, penalty), "Penalty transfer failed");
                jnsBalanceAccounted -= penalty;
            } else {
                // Si la pool es el propio staking, la penalidad se queda y el balanceAccounted
                // debe descontarla como si saliera del principal, para que sea tratada como recompensa
                jnsBalanceAccounted -= penalty;
            }
        }
    }

    // ==========================================
    // CLAIM & AUTO-COMPOUND
    // ==========================================

    function _enforceClaimFrequency(address user) internal {
        bool hasLockedStake = false;
        for (uint i = 0; i < userStakes[user].length; i++) {
            if (userStakes[user][i].lockType != LockType.FLEXIBLE && userStakes[user][i].amount > 0) {
                hasLockedStake = true;
                break;
            }
        }
        if (hasLockedStake) {
            require(block.timestamp >= lastClaimTime[user] + 7 days, "Claim available once per week for locked stakes");
        }
        lastClaimTime[user] = block.timestamp;
    }

    function claimBaseYield() external nonReentrant whenNotPaused {
        _enforceClaimFrequency(msg.sender);
        _updateUserReward(msg.sender);
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No yield to claim");
        
        pendingRewards[msg.sender] = 0;
        
        require(jnsToken.transfer(msg.sender, amount), "Transfer failed");
        jnsBalanceAccounted -= amount; 
    }

    function autoCompoundBaseYield() external nonReentrant whenNotPaused {
        _enforceClaimFrequency(msg.sender);
        _updateUserReward(msg.sender);
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No yield to auto-compound");
        
        pendingRewards[msg.sender] = 0;
        
        // El yield ya está dentro de currentBalance y de jnsBalanceAccounted gracias a updateReward
        // Siempre se inyecta como FLEXIBLE sin lock
        LockType _lockType = LockType.FLEXIBLE;
        uint256 multiplier = _getMultiplier(_lockType);
        uint256 amountJNSX = (amount * multiplier) / 100;
        uint256 unlockTime = block.timestamp + _getDuration(_lockType);
        
        userStakes[msg.sender].push(StakeInfo({
            amount: amount,
            jnsxMinted: amountJNSX,
            unlockTime: unlockTime,
            lockType: _lockType
        }));
        
        totalJNSLocked += amount;
        
        _mint(msg.sender, amountJNSX);
    }

    // ==========================================
    // DUAL VAULT & CIVIC EPOCHS
    // ==========================================

    function setDividendToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        dividendToken = IERC20(_token);
    }

    function setGovernorContract(address _governor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        governorContract = IJNSGovernor(_governor);
    }

    function setHealthTargetWeeks(uint256 _weeks) external onlyRole(TIMELOCK_ROLE) {
        require(_weeks > 0, "Target cannot be zero");
        healthTargetWeeks = _weeks;
    }

    function startNewEpoch() external onlyRole(TIMELOCK_ROLE) {
        epochTotalEligibleShares[currentEpoch] = totalSupply();
        epochEndTimes[currentEpoch] = block.timestamp;
        currentEpoch++;
    }

    function distributeExtraordinaryDividends(uint256 _amount) external nonReentrant {
        require(address(dividendToken) != address(0), "Dividend token not set");
        require(_amount > 0, "Amount must be > 0");
        require(dividendToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        epochTotalDividends[currentEpoch] += _amount;
    }

    function claimExtraordinaryDividends(uint256 _epochId) external nonReentrant whenNotPaused {
        require(_epochId < currentEpoch, "Epoch not ended yet");
        require(!hasClaimedDividend[_epochId][msg.sender], "Already claimed");
        require(address(governorContract) != address(0), "Governor not set");
        require(address(dividendToken) != address(0), "Dividend token not set");
        
        require(governorContract.hasMetCivicDuty(msg.sender, _epochId), "Civic duty not met");

        uint256 eligibleJNSX = 0;
        uint256 epochEnd = epochEndTimes[_epochId];
        
        for (uint i = 0; i < userStakes[msg.sender].length; i++) {
            StakeInfo storage stake = userStakes[msg.sender][i];
            if (stake.jnsxMinted > 0) {
                // Inferir momento de creacion restando el duration del lock
                uint256 createdAt = stake.unlockTime - _getDuration(stake.lockType);
                if (createdAt <= epochEnd) {
                    eligibleJNSX += stake.jnsxMinted;
                }
            }
        }

        require(eligibleJNSX > 0, "No eligible stakes");

        uint256 userShare = (eligibleJNSX * epochTotalDividends[_epochId]) / epochTotalEligibleShares[_epochId];
        require(userShare > 0, "No dividends to claim");

        hasClaimedDividend[_epochId][msg.sender] = true;
        require(dividendToken.transfer(msg.sender, userShare), "Transfer failed");
    }

    // ==========================================
    // HELPERS & OVERRIDES
    // ==========================================

    function _getMultiplier(LockType _lockType) internal pure returns (uint256) {
        if (_lockType == LockType.DAYS_30) return 110;
        if (_lockType == LockType.DAYS_90) return 130;
        if (_lockType == LockType.DAYS_180) return 160;
        if (_lockType == LockType.DAYS_365) return 200;
        if (_lockType == LockType.DAYS_730) return 260;
        if (_lockType == LockType.DAYS_1095) return 320;
        return 100; // FLEXIBLE
    }

    function _getDuration(LockType _lockType) internal pure returns (uint256) {
        if (_lockType == LockType.DAYS_30) return 30 days;
        if (_lockType == LockType.DAYS_90) return 90 days;
        if (_lockType == LockType.DAYS_180) return 180 days;
        if (_lockType == LockType.DAYS_365) return 365 days;
        if (_lockType == LockType.DAYS_730) return 730 days;
        if (_lockType == LockType.DAYS_1095) return 1095 days;
        return 0; // FLEXIBLE
    }

    function _getPenaltyRate(LockType _lockType) internal pure returns (uint256) {
        if (_lockType == LockType.DAYS_30) return 10;
        if (_lockType == LockType.DAYS_90) return 15;
        if (_lockType == LockType.DAYS_180) return 20;
        if (_lockType == LockType.DAYS_365) return 25;
        if (_lockType == LockType.DAYS_730) return 25; // Cap at 25%
        if (_lockType == LockType.DAYS_1095) return 25; // Cap at 25%
        return 0; // FLEXIBLE
    }

    function getVotingPower(address account) external view returns (uint256) {
        return getVotes(account);
    }

    function accessLockedFunds(uint256 _amount, address _destination) external onlyRole(TIMELOCK_ROLE) {
        require(_amount > 0, "Invalid amount");
        require(_destination != address(0), "Invalid destination");
        
        uint256 maxAllowed = (totalJNSLocked * 30) / 100;
        require((strategicDeployed + _amount) <= maxAllowed, "Cannot access more than 30% of TVL");
        
        strategicDeployed += _amount;
        jnsBalanceAccounted -= _amount;
        require(jnsToken.transfer(_destination, _amount), "Transfer failed");
    }

    function returnLockedFunds(uint256 _amount) external {
        require(jnsToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        jnsBalanceAccounted += _amount;
        strategicDeployed -= _amount;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        if (from != address(0)) { _updateUserReward(from); }
        if (to != address(0)) { _updateUserReward(to); }
        
        super._update(from, to, value);
        
        if (from != address(0)) { _updateRewardDebt(from); }
        if (to != address(0)) { _updateRewardDebt(to); }
    }

    function nonces(address owner) public view virtual override(ERC20PermitUpgradeable, NoncesUpgradeable) returns (uint256) {
        return super.nonces(owner);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}