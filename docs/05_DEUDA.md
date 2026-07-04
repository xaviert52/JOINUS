# 05 — Registro de Deuda Técnica

## Deuda Activa

### DT-001: Implementación Frontend Pendiente
- **Fecha registro**: 2026-05-15
- **Descripción**: El directorio frontend se encuentra inicializado pero sin la arquitectura final de React y Web3 definida.
- **Riesgo**: Ninguno en esta fase.
- **Plan**: Abordar durante la Fase 5.

### DT-005: Esquema de circuitos ZK
- **Fecha registro**: 2026-06-24
- **Descripción**: Diseñar y compilar el circuito zk-SNARK para integrarlo con la lógica de gobernanza anónima.
- **Riesgo**: Medio. Complejidad en la integración on-chain y costes de gas para verificación de pruebas.
- **Plan**: Diseñar los circuitos ZK y probar su compilación durante la Fase 4.

---

## Deuda Resuelta

### DT-002: Selección de Librería Web3
- **Fecha registro**: 2026-05-15
- **Fecha resolución**: 2026-06-24
- **Resolución**: Se ha determinado la selección definitiva de `viem / wagmi` como stack Web3 para soportar de manera nativa la interacción y Abstracción de Cuenta (ERC-4337).

### DT-003: Refactorización UUPS JNSToken
- **Fecha registro**: 2026-06-24
- **Fecha resolución**: 2026-07-03
- **Resolución**: Reescritura completa del token JNSToken.sol utilizando UUPS y OpenZeppelin v5 upgradeable, habilitando de manera correcta la compatibilidad y actualizabilidad del token.

### DT-004: Descentralización de funciones en Staking
- **Fecha registro**: 2026-06-24
- **Fecha resolución**: 2026-07-04
- **Resolución**: Solucionado en `JNSStaking.sol` mediante el modificador `onlyRole(TIMELOCK_ROLE)` y el límite matemático estricto del 30% del TVL para el despliegue estratégico de fondos.

### DT-006: CORRECCIÓN CRÍTICA DE BUG EN STAKING
- **Fecha registro**: 2026-06-24
- **Fecha resolución**: 2026-07-04
- **Resolución**: Solucionado implementando e indexando de forma nativa la función `getVotingPower` en `JNSStaking.sol` mediante la herencia de `ERC20VotesUpgradeable` y actualizando la firma y llamadas de `Governor.sol`.

### DT-007: Integración de Auto-Compound y Bóveda Dual
- **Fecha registro**: 2026-07-03
- **Fecha resolución**: 2026-07-04
- **Resolución**: Se programó exitosamente la inyección y el reclamo de dividendos en USDC para stakers a 365 días mediante Epochs cívicas controladas meritocráticamente.

### DT-008: Actualización de dependencias y tooling local (Fase 2)
- **Fecha registro**: 2026-07-03
- **Fecha resolución**: 2026-07-03
- **Resolución**: Resolución de dependencias locales obsoletas instalando e integrando la v5 de OpenZeppelin, Hardhat Toolbox, y configurando la compatibilidad con el EVM Cancun (mcopy) y las directrices de testeo en Hardhat.

---

## Bloqueos
- No existen bloqueos técnicos en esta fase inicial de preparación.
- **Decisión pendiente**: Estrategia de indexación de eventos (The Graph vs backend propio) para visualización eficiente en el frontend de propuestas y transacciones.
