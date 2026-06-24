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
- **Decisión**: Confirmar el Tax del 2% (1% quema, 1% asignado al `rewardPool` de staking).
- **Motivo**: Genera presión deflacionaria y financia de manera pasiva a los stakers, asegurando incentivos a largo plazo sin depender de emisiones inflacionarias.
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
