// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title JNSTimelock
/// @notice Contrato maestro y ejecutor del DAO con retardo temporal por seguridad.
/// @dev Requiere mínimo 3 días de retardo forzoso en la inicialización.
import {TimelockControllerUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

contract JNSTimelock is TimelockControllerUpgradeable {
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 minDelay, 
        address[] memory proposers, 
        address[] memory executors, 
        address admin
    ) public override initializer {
        require(minDelay >= 3 days, "JNSTimelock: Delay must be at least 3 days (259200 seconds)");
        __TimelockController_init(minDelay, proposers, executors, admin);
    }
}
