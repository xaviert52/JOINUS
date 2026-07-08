// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title JNSGovernorzk
/// @notice Contrato de Gobernanza Privada mediante pruebas criptográficas ZK.
/// @dev Hereda de OpenZeppelin Governor y utiliza Semaphore V4.
import {GovernorUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import {GovernorSettingsUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import {GovernorCountingSimpleUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import {GovernorVotesUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract JNSGovernorzk is 
    Initializable, 
    GovernorUpgradeable, 
    GovernorSettingsUpgradeable, 
    GovernorCountingSimpleUpgradeable, 
    GovernorVotesUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    uint256 public currentEpoch;
    mapping(uint256 => mapping(address => bool)) public hasParticipated;

    ISemaphore public semaphore;
    uint256 public groupId;
    
    mapping(uint256 => bool) public zkNullifiers;

    struct ProposalZK {
        uint256 merkleRoot;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        uint256 totalVotesAbstain;
    }
    mapping(uint256 => ProposalZK) public proposalZKs;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IVotes _token, 
        address _semaphoreAddress, 
        uint256 _groupId,
        address _admin,
        address _guardian
    ) public initializer {
        __Governor_init("JNSGovernorZK");
        __GovernorSettings_init(1 days, 1 weeks, 10000 * 1e18);
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __AccessControl_init();
        __Pausable_init();
        
        semaphore = ISemaphore(_semaphoreAddress);
        groupId = _groupId;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(GUARDIAN_ROLE, _guardian);
    }

    function pause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(GUARDIAN_ROLE) {
        _unpause();
    }

    function setProposalMerkleRoot(uint256 proposalId, uint256 merkleRoot) external onlyRole(DEFAULT_ADMIN_ROLE) {
        proposalZKs[proposalId].merkleRoot = merkleRoot;
    }

    // ==========================================
    // RESOLUCIÓN ADR-007: VOTO ZK PONDERADO & PARADOJA CÍVICA
    // ==========================================
    
    function castVoteZK(
        uint256 proposalId, 
        uint8 support, 
        uint256 weight, 
        uint256 nullifierHash, 
        uint256[8] calldata proof
    ) external whenNotPaused {
        require(!zkNullifiers[nullifierHash], "JNSGovernorZK: nullifier already used");

        uint256 root = proposalZKs[proposalId].merkleRoot;
        require(root != 0, "JNSGovernorZK: Merkle root not set for proposal");

        // Construir struct compatible con Semaphore v4. 
        // El weight y support se empaquetan en el message para evitar falsificaciones
        uint256 message = uint256(keccak256(abi.encodePacked(weight, support)));

        ISemaphore.SemaphoreProof memory zkProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: 20, 
            merkleTreeRoot: root,
            nullifier: nullifierHash,
            message: message,
            scope: proposalId,
            points: proof
        });

        // Validar matemáticamente off-chain vs on-chain
        require(semaphore.verifyProof(groupId, zkProof), "JNSGovernorZK: Invalid ZK Proof");

        // Paso A: Quemar nullifier
        zkNullifiers[nullifierHash] = true;

        // Paso C: Conteo Ponderado
        if (support == 0) {
            proposalZKs[proposalId].totalVotesAgainst += weight;
        } else if (support == 1) {
            proposalZKs[proposalId].totalVotesFor += weight;
        } else if (support == 2) {
            proposalZKs[proposalId].totalVotesAbstain += weight;
        } else {
            revert("JNSGovernorZK: invalid support value");
        }

        // Paso D: Registro Cívico Público (Paradoja de Identidad)
        hasParticipated[currentEpoch][msg.sender] = true;
    }

    // ==========================================
    // OVERRIDES
    // ==========================================

    function quorum(uint256) public pure override returns (uint256) {
        return 0; // Configurado en 0 temporalmente para testing
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(GovernorUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
