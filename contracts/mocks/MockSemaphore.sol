// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract MockSemaphore {
    function verifyProof(uint256 /*groupId*/, ISemaphore.SemaphoreProof calldata /*proof*/) external pure returns (bool) {
        return true;
    }
}
