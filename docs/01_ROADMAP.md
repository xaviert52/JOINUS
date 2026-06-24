# 01 — Roadmap Técnico y de Ecosistema

## Visión General
El roadmap de JNS Ecosistema está estructurado para construir paso a paso un ecosistema descentralizado robusto, que integre un launchpad, gobernanza ZK y un hedge fund. El token $JNS es el núcleo del ecosistema.

---

### 🧱 FASE 1 — Preparación (VIGENTE)
**Objetivo:** Establecer las bases del proyecto, economía y control.
- [x] Finalizar definición de tokenomics inmutables (10M supply).
- [ ] Realizar la migración técnica a Arbitrum.
- [ ] Reestructuración completa de la documentación a JNS/$JNSX.

### 🪙 FASE 2 — Desarrollo del Token
**Objetivo:** Implementar el activo principal del ecosistema.
- [ ] Crear `JNSToken.sol` con patrón UUPS Upgradeable.
- [ ] Integrar Tax transaccional del 2% (1% quema, 1% rewardPool).
- [ ] Transferencia de propiedad al Timelock.

### 🔒 FASE 3 — Desarrollo del Staking
**Objetivo:** Crear incentivos para la retención y participación.
- [ ] Implementar `JNSStaking.sol` con acuñación del LST $JNSX.
- [ ] Programar función `addRewardPool` para inyecciones externas.
- [ ] Solucionar el bug de compilación inyectando de forma nativa e indexada la función crítica `getVotingPower`.
- [ ] Rediseñar `accessLockedFunds` para acoplarla rígidamente al Governor eliminando el control directo del Owner.

### 🏛️ FASE 4 — Gobernanza y Tesorería
**Objetivo:** Descentralizar el control y gestionar los fondos.
- [ ] Desarrollar `JNSGovernorzk.sol` (zk-SNARKs para anonimato de voto).
- [ ] Desarrollar contrato Timelock con retraso mínimo de 3 días.
- [ ] Configurar módulos de Circuit Breakers controlados por Multisig de Guardianes.

### 🚀 FASE 5 — Lanzamiento y The Arena MVP
**Objetivo:** Interfaz funcional y despliegue en redes.
- [ ] Lanzamiento del Frontend MVP (React + viem/wagmi) con Abstracción de Cuenta (ERC-4337).
- [ ] Despliegue del primer módulo de The Arena (Casino) en Arbitrum One (y Arbitrum Sepolia para pruebas).
- [ ] Activación del motor de recompra (Buyback Engine).

### 🌌 FASE 6 — El Ecosistema Integrado
**Objetivo:** Completar la visión del ecosistema.
- [ ] Despliegue del Launchpad asistido por Chainlink Functions.
- [ ] Apertura del Hedge Fund operando el 30% autorizado del TVL de locks largos.
