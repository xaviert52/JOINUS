// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title JNSToken
/// @notice Upgradeable ERC-20 token for the JNS Ecosistema with a 3% transaction tax mechanism.
contract JNSToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    /// @notice Maximum supply capped at 10,000,000 $JNS
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18;
    
    /// @notice Address of the DAO reward pool for the 2% tax
    address public rewardPoolAddress;
    
    /// @notice Mapping to identify addresses exempt from the transfer tax
    mapping(address => bool) public feeExempt;
    
    event RewardPoolAddressUpdated(address indexed newRewardPoolAddress);
    event FeeExemptionUpdated(address indexed account, bool isExempt);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract and mints the max supply to the initial owner
    /// @param _name Name of the token
    /// @param _symbol Symbol of the token
    /// @param _initialOwner Address that will receive the initial supply and ownership
    /// @param _rewardPoolAddress Address of the reward pool
    function initialize(
        string memory _name,
        string memory _symbol,
        address _initialOwner,
        address _rewardPoolAddress
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __ERC20Burnable_init();
        __Pausable_init();
        __Ownable_init(_initialOwner);
        __UUPSUpgradeable_init();

        // Mint maximum supply of 10,000,000 $JNS to the initial owner
        _mint(_initialOwner, MAX_SUPPLY);

        // Set the initial reward pool address
        rewardPoolAddress = _rewardPoolAddress;
        
        // Exempt the initial owner and the contract itself from taxes
        feeExempt[_initialOwner] = true;
        feeExempt[address(this)] = true;
    }

    /// @notice Updates the reward pool address.
    /// @param _rewardPool New reward pool address.
    function setRewardPoolAddress(address _rewardPool) external onlyOwner {
        require(_rewardPool != address(0), "Invalid reward pool address");
        rewardPoolAddress = _rewardPool;

        emit RewardPoolAddressUpdated(_rewardPool);
    }

    /// @notice Sets fee exemption for a given address.
    /// @param account Address to exempt from fees.
    /// @param isExempt Whether the address is exempt from fees.
    function setFeeExemption(address account, bool isExempt) external onlyOwner {
        feeExempt[account] = isExempt;

        emit FeeExemptionUpdated(account, isExempt);
    }

    /// @notice Pauses all token transfers.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses all token transfers.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice UUPS authorize upgrade hook, restricted to the owner (Timelock).
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @notice Internal update override to implement the 3% transfer tax.
    /// @param from Sender address.
    /// @param to Recipient address.
    /// @param value Amount to transfer.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable) whenNotPaused {
        // Skip tax logic for minting and burning (which go from/to address(0))
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // Apply transfer tax if sender and receiver are not exempt
        if (feeExempt[from] || feeExempt[to]) {
            super._update(from, to, value);
        } else {
            uint256 burnAmount = (value * 1) / 100;         // 1% burn
            uint256 rewardPoolAmount = (value * 2) / 100;   // 2% reward pool
            uint256 netAmount = value - burnAmount - rewardPoolAmount; // 97% to recipient

            // Burn 1% automatically by calling the internal _burn function
            if (burnAmount > 0) {
                _burn(from, burnAmount);
            }

            // Transfer 2% to the reward pool address
            if (rewardPoolAmount > 0) {
                require(rewardPoolAddress != address(0), "Reward pool address not set");
                super._update(from, rewardPoolAddress, rewardPoolAmount);
            }

            // Transfer the remaining 97% to the final recipient
            super._update(from, to, netAmount);
        }
    }
}