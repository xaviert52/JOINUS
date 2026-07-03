# 05 — Registro de Deuda Técnica

## Deuda Activa

### DT-001: Implementación Frontend Pendiente
- **Fecha registro**: 2026-05-15
- **Descripción**: El directorio frontend se encuentra inicializado pero sin la arquitectura final de React y Web3 definida.
- **Riesgo**: Ninguno en esta fase.
- **Plan**: Abordar durante la Fase 5.

### DT-003: Refactorización UUPS JNSToken
- **Fecha registro**: 2026-06-24
- **Descripción**: Reescritura completa del token utilizando contratos base actualizables de OpenZeppelin para subsanar el diseño estático del repositorio anterior.
- **Riesgo**: Bajo. Limita la evolución futura del token si se mantiene el diseño estático anterior.
- **Plan**: Abordar durante la Fase 2 del desarrollo.

### DT-004: Descentralización de funciones en Staking
- **Fecha registro**: 2026-06-24
- **Descripción**: Eliminar el modificador `onlyOwner` de la función de retiro del 30% de fondos y acoplarla estrictamente al Governor.
- **Riesgo**: Alto. El control directo del Owner representa un backdoor centralizado no admisible en un estándar de grado bancario.
- **Plan**: Abordar durante la Fase 3 del desarrollo de staking.

### DT-005: Esquema de circuitos ZK
- **Fecha registro**: 2026-06-24
- **Descripción**: Diseñar y compilar el circuito zk-SNARK para integrarlo con la lógica de gobernanza anónima.
- **Riesgo**: Medio. Complejidad en la integración on-chain y costes de gas para verificación de pruebas.
- **Plan**: Diseñar los circuitos ZK y probar su compilación durante la Fase 4.

### DT-006: CORRECCIÓN CRÍTICA DE BUG EN STAKING - ALTA PRIORIDAD
- **Fecha registro**: 2026-06-24
- **Descripción**: Programar e indexar la función `getVotingPower` en `JNSStaking.sol`, dado que el contrato `Governor.sol` actual realiza una llamada externa a esta función pero no se encuentra declarada en el código base del staking del repositorio original, causando un fallo crítico de compilación.
- **Riesgo**: Crítico. Impide la compilación y despliegue del sistema de gobernanza y staking de forma integrada.
- **Plan**: Implementar e indexar de forma nativa la función en la Fase 3.

### DT-007: Integración de Auto-Compound y Bóveda Dual
- **Fecha registro**: 2026-07-03
- **Descripción**: Modificar el diseño inicial de `JNSStaking.sol` para soportar tanto auto-compound nativo en $JNS como la reclamación líquida (claim) de $ETH/$USDC en una bóveda de dividendos.
- **Riesgo**: Medio. Complejidad en la gestión de balances de múltiples tokens y reclamos meritocráticos dependientes de participación política.
- **Plan**: Diseñar e implementar la interfaz de reclamo dual en el contrato de staking durante la Fase 3.

---

## Deuda Resuelta

### DT-002: Selección de Librería Web3
- **Fecha registro**: 2026-05-15
- **Fecha resolución**: 2026-06-24
- **Resolución**: Se ha determinado la selección definitiva de `viem / wagmi` como stack Web3 para soportar de manera nativa la interacción y Abstracción de Cuenta (ERC-4337).

---

## Bloqueos
- No existen bloqueos técnicos en esta fase inicial de preparación.
- **Decisión pendiente**: Estrategia de indexación de eventos (The Graph vs backend propio) para visualización eficiente en el frontend de propuestas y transacciones.
