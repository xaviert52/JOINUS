// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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

    enum LockType { FLEXIBLE, DAYS_30, DAYS_90, DAYS_180, DAYS_365 }

    struct StakeInfo {
        uint256 amount;
        uint256 jnsxMinted;
        uint256 unlockTime;
        LockType lockType;
    }

    mapping(address => StakeInfo[]) public userStakes;

    // TODO: Phase 3.2 - Mappings y variables de estado para el sistema de Epochs cívicas
    // TODO: Phase 3.2 - Variables de estado para Bóveda Dual (Base Yield en $JNS y Dividendos en $ETH/USDC)
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Inicializa el contrato configurando los roles iniciales y dependencias.
    /// @param _admin Dirección del administrador inicial (deployer temporal).
    /// @param _jnsToken Dirección del token nativo JNS.
    function initialize(address _admin, address _jnsToken) public initializer {
        __ERC20_init("Liquid JNS", "JNSX");
        __ERC20Permit_init("Liquid JNS");
        __ERC20Votes_init();
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        jnsToken = IERC20(_jnsToken);
    }

    /// @notice Deposita $JNS para acuñar $JNSX según el multiplicador de tiempo.
    /// @param _amount Cantidad de JNS a depositar.
    /// @param _lockType Periodo de bloqueo.
    function deposit(uint256 _amount, LockType _lockType) external nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");

        // Transfiere JNS al contrato
        require(jnsToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        uint256 multiplier = 100; // 1.0x por defecto (FLEXIBLE)
        uint256 duration = 0;

        if (_lockType == LockType.DAYS_30) {
            multiplier = 110;
            duration = 30 days;
        } else if (_lockType == LockType.DAYS_90) {
            multiplier = 130;
            duration = 90 days;
        } else if (_lockType == LockType.DAYS_180) {
            multiplier = 160;
            duration = 180 days;
        } else if (_lockType == LockType.DAYS_365) {
            multiplier = 200;
            duration = 365 days;
        }

        uint256 amountJNSX = (_amount * multiplier) / 100;
        uint256 unlockTime = block.timestamp + duration;

        userStakes[msg.sender].push(StakeInfo({
            amount: _amount,
            jnsxMinted: amountJNSX,
            unlockTime: unlockTime,
            lockType: _lockType
        }));

        totalJNSLocked += _amount;
        _mint(msg.sender, amountJNSX);
        
        // Auto-delegación para activar poder de voto si no se ha hecho
        if (delegates(msg.sender) == address(0)) {
            _delegate(msg.sender, msg.sender);
        }
    }

    // Funcionalidad de DT-006: Proxy para leer votos on-chain y prevenir flash-loans
    function getVotingPower(address account) external view returns (uint256) {
        return getVotes(account);
    }

    // Funcionalidad de DT-004: Acceso Institucional para fondo estratégico descentralizado (Timelock)
    function accessLockedFunds(uint256 _amount, address _destination) external onlyRole(TIMELOCK_ROLE) {
        require(_amount > 0, "Invalid amount");
        require(_destination != address(0), "Invalid destination");
        
        uint256 maxAllowed = (totalJNSLocked * 30) / 100;
        require(_amount <= maxAllowed, "Cannot access more than 30% of TVL");
        
        require(jnsToken.transfer(_destination, _amount), "Transfer failed");
    }

    // Controles de Emergencia (Pausable)
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // Overrides mandatorios de OpenZeppelin v5 para Checkpointing
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view virtual override(ERC20PermitUpgradeable, NoncesUpgradeable) returns (uint256) {
        return super.nonces(owner);
    }

    // Override para autorizar futuras actualizaciones de contrato inteligente
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}