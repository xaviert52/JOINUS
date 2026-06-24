# 04 — Índice Técnico

## Stack Tecnológico
- **Blockchain**: Arbitrum One / Arbitrum Sepolia (L2 Rollup nativo de Ethereum)
- **Lenguaje Smart Contracts**: Solidity
- **Framework de Desarrollo**: Hardhat
- **Librerías de Contratos**: OpenZeppelin (Upgradables, ERC20, Governance)
- **Frontend Framework**: React.js
- **Interacción Web3**: viem / wagmi

---

## Estructura de Carpetas (JNS-Ecosistema)
```text
JNS-Ecosistema/
├── contracts/               # Smart Contracts (Solidity)
│   ├── JNSToken.sol         # ERC-20 con Tax y UUPS ($JNS)
│   ├── JNSStaking.sol       # Contrato de Staking con LST $JNSX
│   ├── JNSGovernorzk.sol    # Gobernanza ZK (zk-SNARKs)
│   ├── Treasury.sol         # Gestión de fondos del ecosistema
│   ├── TheArenaCasino.sol   # Casino e inyecciones de cashflow
│   └── interfaces/          # Interfaces para interoperabilidad
├── frontend/                # MVP Web App (React)
├── scripts/                 # Scripts de despliegue de Hardhat
├── test/                    # Suite de pruebas automatizadas
├── docs/                    # Documentación y auditoría del ecosistema
├── hardhat.config.js        # Configuración de red y compilador
└── package.json             # Dependencias NPM
```

---

## Componentes del Ecosistema

### 1. Token $JNS (`JNSToken.sol`)
- ERC-20 Upgradable (patrón UUPS).
- Tax del 2% en transferencias (1% burn, 1% rewardPool).
- Pausable en emergencias.

### 2. Staking (`JNSStaking.sol`)
- Gestión de Locks (30, 90, 180, 365 días) y Flexible.
- Acuñación del Liquid Staking Token $JNSX (1:1 ponderado).
- Cálculo de recompensas reales (Real Yield) y penalizaciones por retiro anticipado.
- Solución nativa del bug de compilación mediante `getVotingPower` indexado.
- Función de préstamo autorizado (hasta 30% del TVL en locks largos) condicionado a llamada de gobernanza.

### 3. Gobernanza (`JNSGovernorzk.sol`)
- Sistema de propuestas y votos con soporte zk-SNARKs para anonimato.
- Solo el balance del token $JNSX otorga poder de voto.
- Delay de ejecución obligatorio a través del Timelock (mínimo 3 días).

### 4. Casino (`TheArenaCasino.sol`)
- Módulo generador de cashflow y recompra de tokens en el mercado (Buyback Engine).
- Tributo automatizado de ganancias hacia el Reward Pool del Staking y Launchpad.

### 5. Tesorería (`Treasury.sol`)
- Almacenamiento y categorización de fondos (Ecosistema, Equipos, Liquidez, etc.).
- Ejecución de transferencias controlada exclusivamente por Gobernanza, eliminando backdoors de `onlyOwner`.

---

## Puntos de Entrada
- **Compilación**: `npx hardhat compile`
- **Testing**: `npx hardhat test`
- **Despliegue Testnet**: `npx hardhat run scripts/<script>.js --network arbitrumSepolia`
