# 02 — Arquitectura y Decisiones (ADR)

## 1. Principios Inmutables

1. **El Smart Contract es la Ley**: Todas las reglas de negocio, staking, penalizaciones y gobernanza viven on-chain.
2. **Seguridad y Actualización**: Se utiliza el patrón UUPS para permitir mejoras futuras sin perder el estado o la dirección del contrato.
3. **Control Descentralizado**: Aunque el fundador posee el control inicial, este se transferirá íntegramente al JNS Ecosistema (Governor ZK + Timelock) tras el despliegue.
4. **Protección del Valor**: Los mecanismos deflacionarios (quema) y de acumulación (reward pool) en transferencias aseguran sostenibilidad.
5. **Documentación como Contrato**: El código implementa las reglas detalladas en la documentación, no al revés.

---

## 2. Decisiones de Arquitectura (ADR)

### ADR-001: Patrón Upgradable (UUPS) para Smart Contracts
- **Decisión**: Mantener el estándar UUPS Upgradeable de OpenZeppelin especificando que se aplicará estrictamente desde el bloque génesis de `JNSToken.sol`.
- **Motivo**: Permite actualizar la lógica de los contratos en caso de bugs o nuevas funcionalidades (Fase 6) mientras es más económico en gas que los proxies transparentes.
- **Estado**: Aceptado.

### ADR-002: Tarifas en Transferencias (Tax Token)
- **Decisión**: Configurar formalmente el Tax del 3% (1% quema permanente). Respecto al restante: El 2% de retención del tax transaccional se envía ÚNICA Y EXCLUSIVAMENTE a la dirección de la bóveda del RewardPool General de la DAO. Ningún usuario recibe distribuciones directas del mercado. El Smart Contract de Staking se alimenta de este RewardPool colectivo para calcular matemáticamente un APY dinámico y pagar a los stakers. El Auto-Compound es una acción estrictamente manual y voluntaria donde el usuario decide reinvertir sus propias utilidades ya devengadas.
- **Motivo**: Genera presión deflacionaria y centraliza el yield en el contrato de staking protegiendo jurídicamente a la DAO de distribuciones automáticas.
- **Estado**: Aceptado.

### ADR-003: Time-weighted Voting lineal
- **Decisión**: El poder de voto será calculado linealmente multiplicando los tokens por el tiempo de bloqueo a través del LST $JNSX (1.1x a 2.0x). Se descarta la votación puramente cuadrática para proteger los grandes capitales (ballenas) de la fuga de liquidez, pero se mantiene la ventaja del compromiso temporal para el inversor minorista.
- **Motivo**: Prioriza las decisiones de actores con compromiso a largo plazo en el ecosistema sobre especuladores a corto plazo, equilibrando los intereses de tenedores institucionales y minoristas.
- **Estado**: Aceptado.

### ADR-004: Acceso Estratégico al TVL de Staking
- **Decisión**: El acceso al 30% del TVL de locks largos queda exclusivamente condicionado a una llamada exitosa del contrato Governor tras votación on-chain. Se elimina cualquier backdoor de `onlyOwner`.
- **Motivo**: Provee liquidez para las inversiones estratégicas del Hedge Fund sin requerir inflar el token, bajo un control político completamente descentralizado y transparente.
- **Estado**: Aceptado.

### ADR-005: Stack Frontend
- **Decisión**: React.js para el MVP con integración a Web3 a través de viem / wagmi.
- **Motivo**: Ecosistema maduro, interoperabilidad nativa y rápida iteración para interfaces descentralizadas con soporte para Abstracción de Cuenta.
- **Estado**: Aceptado.

### ADR-006: Checkpointing de Gobernanza
- **Decisión**: El token $JNSX heredará de `ERC20VotesUpgradeable` de OpenZeppelin. El contrato de Staking emitirá $JNSX multiplicando el depósito base por el factor de tiempo (1.0x a 2.0x), integrando la función `getVotingPower` nativamente y previniendo flash-loans.
- **Motivo**: Previene ataques de gobernanza por préstamos rápidos (flash-loans) y recompensa linealmente a los stakers según su compromiso temporal.
- **Estado**: Aceptado.

### ADR-007: Paradoja ZK y Civismo
- **Decisión**: Para compatibilizar el voto anónimo (zk-SNARKs) con la exigencia de >70% de participación cívica para dividendos, el Governor registrará públicamente el "acto de votar" (`hasParticipated`), pero mantendrá encriptado el peso y la decisión. Los dividendos se calcularán mediante "Épocas" (Epochs).
- **Motivo**: Garantiza la privacidad y el voto anónimo mientras se verifica on-chain la participación cívica agregada y mínima para recibir recompensas B2B.
- **Estado**: Aceptado.

### ADR-008: Estándares DeFi
- **Decisión**: Se adopta el estándar ERC-4626 para las bóvedas del B2B Yield Aggregator.
- **Motivo**: Facilita la interoperabilidad y la integración estándar con otros protocolos DeFi y Yield Engines.
- **Estado**: Aceptado.

### ADR-009: Distribución del Flujo de Caja del Casino
- **Decisión**: Se fija una comisión operativa y de riesgo del 35% para el fundador (Jasar) sobre las ganancias netas de The Arena (cobertura de infraestructura y banca). El 65% restante se divide algorítmicamente entre:
  * 30% a la Bóveda de Dividendos de Alta Convicción (para stakers de $JNSX a 365 días con >70% de asistencia cívica).
  * 15% al RewardPool General (para potenciar masivamente el APY pasivo de todos los stakers).
  * 10% al House Bankroll (fondo de cobertura y crecimiento de la banca del casino).
  * 10% para recompras en DEX (Buyback) y quema perpetua de $JNS.
- **Motivo**: Canalizar el flujo de caja circular de The Arena priorizando el beneficio comunitario al elevar estratégicamente el RewardPool al 15% e incentivando el compromiso a largo plazo.
- **Estado**: Aceptado.

### ADR-010: Sostenibilidad Matemática y Health Factor
- **Decisión**: El concepto central del APY no es un "Porcentaje Fijo", sino una **"Porción del Pastel" (Slice of the Pie)**. La recompensa del usuario se calcula como: `(Tus $JNSX / Total Global $JNSX) * Emisión Semanal`. El tiempo de vida del RewardPool depende estrictamente de esta Tasa de Emisión Asintótica. Se establece la fórmula matemática inmutable para mantener el Health Factor en 10.2 Años de forma auto-regulada: `Weekly Emission = Current RewardPool Balance / 530 Weeks`.
- **Motivo**: Garantiza una transparencia total sobre la pista de aterrizaje (runway). Si el pool cae, la emisión absoluta disminuye asintóticamente (auto-throttle) forzando el replenish matemático hasta volver al target de 530 semanas (10.2 años).
- **Estado**: Aceptado.

### ADR-011: Weekly Epochs & Decreasing Proposal Bounties
- **Decisión**: El ecosistema cierra recompensas en ciclos de 7 días (Weekly Epochs) para fomentar el pensamiento a largo plazo ("El Ritual Semanal"). Además, las propuestas de gobernanza exitosas pagarán un "Bounty" al creador utilizando una curva decreciente desde el pool de incentivos.
- **Motivo**: Las épocas semanales reducen el ruido de los reclamos diarios y promueven la estabilidad. Las primeras propuestas pagarán más tokens (pero menos valor fiat inicial), y las futuras pagarán menos tokens (que presumiblemente tendrán alta apreciación), premiando a los pioneros constructores de la DAO.
- **Estado**: Aceptado.
