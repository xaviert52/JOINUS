// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MockGovernor {
    mapping(address => mapping(uint256 => bool)) public hasMetDuty;

    function setCivicDuty(address user, uint256 epochId, bool status) external {
        hasMetDuty[user][epochId] = status;
    }

    function hasMetCivicDuty(address user, uint256 epochId) external view returns (bool) {
        return hasMetDuty[user][epochId];
    }
}
