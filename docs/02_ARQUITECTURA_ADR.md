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
- **Decisión**: Configurar formalmente el Tax del 3% (1% quema permanente). El 2% de retención se envía ÚNICA Y EXCLUSIVAMENTE al RewardPool General de la DAO. Ningún usuario recibe distribuciones directas del mercado. El Smart Contract calcula un APY dinámico. Reclamar este Base Yield a la wallet incurre en el 3% de Tax normal. El Compound es 100% Tax-Free e inyecta las ganancias por defecto en una nueva posición de Staking FLEXIBLE (1.0x), dando liquidez inmediata sobre los rendimientos.
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

### ADR-009: Ecosistema Modular y Flujo de Caja
- **Decisión**: Se fija una comisión operativa y de riesgo del 35% para el fundador (Jasar) sobre las ganancias netas de The Arena (cobertura de infraestructura y banca). El 65% restante se divide algorítmicamente entre:
  * 30% a la Bóveda de Dividendos (para CUALQUIER staker de $JNSX con >70% de asistencia cívica, sin importar tiempo de bloqueo).
  * 15% al RewardPool General (para potenciar masivamente el APY pasivo de todos los stakers).
  * 10% al House Bankroll (fondo de cobertura y crecimiento de la banca del casino).
  * 10% para recompras en DEX (Buyback) y quema perpetua de $JNS.
  Adicionalmente, el RewardPool General no solo se alimenta del Casino y los Taxes, sino que actuará como un "Agujero Negro de Valor" capturando comisiones de TODOS los futuros módulos del Ecosistema Modular (Launchpad, Lending Hub, etc.), engordando constantemente la emisión asintótica.
- **Motivo**: Canalizar el flujo de caja circular de The Arena priorizando el beneficio comunitario al elevar estratégicamente el RewardPool al 15% e incentivando el compromiso a largo plazo.
- **Estado**: Aceptado.

### ADR-010: Sostenibilidad Matemática y Health Factor
- **Decisión**: El concepto central del APY no es un "Porcentaje Fijo", sino una **"Porción del Pastel" (Slice of the Pie)**. La recompensa del usuario se calcula como: `(Tus $JNSX / Total Global $JNSX) * Emisión Semanal`. El tiempo de vida del RewardPool depende estrictamente de esta Tasa de Emisión Asintótica. Se establece la fórmula matemática inmutable para mantener el Health Factor en 10.2 Años de forma auto-regulada: `Weekly Emission = Current RewardPool Balance / Target Health Weeks`. Actualmente `Target Health Weeks` = 530, pero es un parámetro gobernable y modificable vía votación del DAO.
- **Motivo**: Garantiza una transparencia total sobre la pista de aterrizaje (runway). Si el pool cae, la emisión absoluta disminuye asintóticamente (auto-throttle) forzando el replenish matemático hasta volver al target de 530 semanas (10.2 años).
- **Estado**: Aceptado.

### ADR-011: Weekly Epochs, Claiming Frequency & Governance Filters
- **Decisión**: El ecosistema cierra recompensas en ciclos de 7 días (Weekly Epochs) para fomentar el pensamiento a largo plazo. 
  * **Claiming Frequency**: Las posiciones FLEXIBLES pueden reclamar/retirar o hacer Compound en cualquier momento. Las posiciones BLOQUEADAS (30 días a 3 años) solo pueden reclamar o hacer Compound una vez por semana.
  * **Compound Activo (El Ritual Semanal)**: El Compound NO es un proceso pasivo en background. Es una acción de ejecución estrictamente requerida por el usuario. El UI de la dApp permite enrutar estos dividendos reclamados a nuevas posiciones Flexibles o iniciar un "Stake Laddering" independiente.
  * **Governance Filters**: El periodo de votación oficial es estrictamente de 8 Días en bloques (blocks). Se requiere pasar por un "Temperature Check" (Off-chain en Discord) y superar el "Proposal Threshold" (On-chain, requiriendo un mínimo de 10,000 $JNSX) para someter propuestas formales. Las propuestas exitosas pagarán un "Bounty" al creador utilizando una curva decreciente.
  * **Cálculo Justo de Civismo (Civismo Dinámico)**: La asistencia cívica del usuario (Civic Duty) se calcula de forma relativa y justa, tomando como punto de partida su `registrationEpoch` (el ciclo en el que depositó por primera vez). Si un usuario retira sus fondos del Staking, las Épocas (Epochs) en las que no posea un balance activo de $JNSX NO se computarán en su denominador de asistencia, calculando el % de Civismo únicamente sobre el tiempo real de permanencia on-chain.
- **Motivo**: Las épocas semanales reducen el ruido de los reclamos diarios y promueven la estabilidad limitando los retiros de posiciones bloqueadas. Los filtros de gobernanza previenen el spam, y los bounties premian a los pioneros constructores de la DAO.
- **Estado**: Aceptado.

### ADR-012: Gasless Paymaster Economics (ERC-4337) y Subsidio Selectivo
- **Decisión**: La integración de Abstracción de Cuenta (Pimlico / ERC-4337) actuará como la estrategia central de adquisición de usuarios del protocolo. La DAO o la Billetera de Operaciones fundará y mantendrá el contrato Paymaster. Sin embargo, el Paymaster patrocinará única y exclusivamente transacciones de Civismo y Retención (Votar con pruebas ZK y hacer Compound). Las funciones de retiro de capital (Withdraw/Early Unstake) exigirán que el usuario pague su propio gas.
- **Motivo**: El ROI justificado para la DAO es la eliminación total de la fricción (especialmente para usuarios no nativos o con bajo balance de ETH) en las acciones constructivas para el TVL, mientras el usuario asume los costos de salida o retiro.
- **Estado**: Aceptado.

### ADR-013: Compound Routing y Acumulación Perpetua
- **Decisión**: El mecanismo de Compound requiere ejecución manual (Ritual Semanal). Queda fijado que el "Ritual Semanal" no confisca fondos. Si un usuario no ejecuta Claim o Compound el domingo, las recompensas (yield de cualquier candado no reclamado) se acumulan de forma segura bloque a bloque de manera perpetua en el mapeo del Smart Contract. Al ejecutarlo, el contrato (y la interfaz) exigen que el usuario elija la ruta de reinversión:
  * **Ruta A (Compound to Flexible)**: Permite mantener la liquidez total sobre el interés recién generado (1.0x).
  * **Ruta B (Stake Laddering)**: Permite re-bloquear las ganancias al plazo elegido (desde 30 Días hasta 3 Años) para escalar asintóticamente el multiplicador (hasta 3.2x).
- **Motivo**: Transfiere la soberanía del flujo de capital al usuario y desmitifica los procesos oscuros de "Compounding mágico" de la antigua era DeFi.
- **Estado**: Aceptado.

### ADR-014: Paymaster & Tubería Directa del Casino
- **Decisión**: El pool del Paymaster ERC-4337 se fundará exclusivamente con un porcentaje de las utilidades de moneda dura (ETH/USDC) generadas por el Casino (The Arena) y el Yield Aggregator. El sistema se auto-sustenta sin emitir ni vender tokens nativos. Adicionalmente, el saldo `Available to Withdraw` del RewardPool Yield estará conectado nativamente por Smart Contract con el Casino (The Arena) para permitir apuestas directas Tax-Free. Para proteger los fondos de ETH del Paymaster al inicio, se establece que los bots de Compound (Keepers) se retrasan a la Fase 6, dejando temporalmente la delegación a cargo del usuario.
- **Motivo**: Crea un ecosistema auto-sostenible donde los ingresos reales de los productos financian la experiencia del usuario (gasless mode). La tubería Tax-Free hacia el Casino aumenta drásticamente el volumen de apuestas sin fricción.
- **Estado**: Aceptado.

### ADR-015: Aislamiento de Riesgo y Transparencia UX
- **Decisión**: La función de Early Unstake estará aislada únicamente dentro del modal de detalles individuales de cada posición activa. Adicionalmente, el castigo (Early Unstake Penalty) ya no es un 25% fijo (flat). Escala proporcionalmente al tiempo faltante usando la fórmula: `Penalty % = (Days Left / Total Lock Days) * 25%`.
- **Motivo**: Previene retiros globales por error y falsas urgencias. La matemática dinámica hace la salida anticipada más justa a medida que se acerca el vencimiento, premiando la permanencia del usuario.
- **Estado**: Aceptado.

### ADR-016: Distribución de Ingresos de Productos
- **Decisión**: NINGÚN producto (DEX, Lending, etc.) enviará el 100% de sus comisiones al RewardPool. Todos seguirán la matriz de rentabilidad base: 35% Ops/Devs, 30% Dividendos Cívicos, 15% RewardPool, 10% Hedge Fund, 10% Burn.
- **Motivo**: Estandariza la distribución de ingresos para todos los productos del ecosistema, garantizando sustentabilidad y recompensas equitativas.
- **Estado**: Aceptado.

### ADR-017: Voto Facultativo Flexible
- **Decisión**: Para los usuarios que ÚNICAMENTE poseen posiciones "Flexible", el voto es Facultativo. Su inasistencia a las urnas no penalizará su "Civic Duty Score".
- **Motivo**: No forzar participación a stakers puramente líquidos, mientras se mantiene el incentivo de Civic Duty para aquellos que bloquean tokens buscando máximos rendimientos y gobernanza.
- **Estado**: Aceptado.
