// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {GovernorUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import {GovernorSettingsUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import {GovernorCountingSimpleUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import {GovernorVotesUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract JNSGovernorzk is 
    Initializable, 
    GovernorUpgradeable, 
    GovernorSettingsUpgradeable, 
    GovernorCountingSimpleUpgradeable, 
    GovernorVotesUpgradeable 
{
    uint256 public currentEpoch;
    mapping(uint256 => mapping(address => bool)) public hasParticipated;

    ISemaphore public semaphore;
    uint256 public groupId;
    
    mapping(uint256 => bool) public usedNullifiers;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IVotes _token, 
        address _semaphoreAddress, 
        uint256 _groupId
    ) public initializer {
        __Governor_init("JNSGovernorZK");
        __GovernorSettings_init(1 days, 1 weeks, 0);
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        
        semaphore = ISemaphore(_semaphoreAddress);
        groupId = _groupId;
    }

    // ==========================================
    // RESOLUCIÓN ADR-007: VOTO ZK & PARADOJA CÍVICA
    // ==========================================
    
    function castVoteZK(
        uint256 proposalId, 
        uint8 support, 
        uint256 weight, 
        uint256 merkleTreeDepth, 
        uint256 merkleTreeRoot, 
        uint256 nullifierHash, 
        uint256[8] calldata proof
    ) external {
        require(!usedNullifiers[nullifierHash], "JNSGovernorZK: nullifier already used");

        // Construir struct compatible con Semaphore v4
        ISemaphore.SemaphoreProof memory zkProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifierHash,
            message: proposalId,
            scope: proposalId,
            points: proof
        });

        // Validar matemáticamente que el votante pertenece al grupo (proof)
        // TODO: En la Parte 2, conectar el peso del voto validado (weight) con el balance real de $JNSX on-chain
        require(semaphore.verifyProof(groupId, zkProof), "JNSGovernorZK: Invalid ZK Proof");

        // Quemar el nullifier para evitar doble voto en la misma propuesta
        usedNullifiers[nullifierHash] = true;

        // Registro Cívico Público: Guardar que el address pagador del gas sí cumplió con su deber cívico
        hasParticipated[currentEpoch][msg.sender] = true;

        // Contabilización base de OpenZeppelin
        _countVote(proposalId, msg.sender, support, weight, "");
    }

    // ==========================================
    // OVERRIDES
    // ==========================================

    function quorum(uint256) public pure override returns (uint256) {
        return 0; // Configurado en 0 temporalmente para facilitar testing en Fase 4
    }

    function votingDelay()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
