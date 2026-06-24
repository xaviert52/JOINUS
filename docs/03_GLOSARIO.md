# 03 — Glosario de Dominio y Técnico

## Términos de Dominio (Negocio)

### $JNS
El token ERC-20 nativo del ecosistema. Sirve como medio de intercambio, reserva de valor y token de gobernanza de grado bancario.

### Launchpad
Plataforma del ecosistema destinada al financiamiento y lanzamiento de proyectos de alto impacto (científicos, filantrópicos o tecnológicos), aprobados por la comunidad mediante gobernanza ZK.

### Hedge Fund
Fondo de inversión del ecosistema que gestiona las reservas y capital (incluyendo el 30% del TVL de staking permitido bajo control estricto de gobernanza) en pools de liquidez y otras estrategias DeFi.

### Staking (Locks Largos vs Flexible)
Mecanismo por el cual los usuarios bloquean sus tokens $JNS.
- **Locks Largos**: Tiempos predefinidos (30, 90, 180, 365 días), mayor APY, mayor poder de voto a través de $JNSX.
- **Flexible**: Sin tiempo fijo, menor APY, menor poder de voto.

### Reward Pool
Fondo acumulado por tarifas de transacción (1% del Tax del token), penalizaciones por retiro anticipado y el Tributo de ganancias automatizado de la plataforma hermana "The Arena" (Casino), destinado a pagar los rendimientos reales (Real Yield) de los stakers.

---

## Términos Técnicos

### JNS Ecosistema
Estructura descentralizada gobernada por contratos inteligentes (Governor ZK y Timelock) y votaciones de sus miembros (stakers de $JNS mediante $JNSX) desplegada en Arbitrum One.

### $JNSX (Liquid Staking Token / LST)
Activo emitido 1:1 ponderado al depositar en locks largos, completamente líquido para su uso en DeFi pero que preserva de forma nativa los derechos de gobernanza y Real Yield en el contrato maestro.

### UUPS (Universal Upgradeable Proxy Standard)
Patrón de OpenZeppelin que permite que la lógica de un Smart Contract sea actualizada mientras el proxy mantiene el almacenamiento y la dirección (address) intactos. Se aplicará a `JNSToken.sol`.

### Governor Contract (Gobernanza ZK)
Contrato inteligente encargado de gestionar la creación, votación y recuento de propuestas de gobernanza utilizando pruebas de conocimiento cero (zk-SNARKs) para garantizar la privacidad y anonimato del voto.

### Timelock Contract
Contrato inteligente que actúa como propietario final de otros contratos. Impone un período de espera (delay) mínimo de 3 días entre la aprobación de una propuesta y su ejecución por seguridad.

### APY (Annual Percentage Yield) Dinámico
Tasa de rendimiento anual (del 8% al 25%) que ganan los usuarios al stakear sus tokens, fluctuando orgánicamente en función de la actividad del mercado y las inyecciones de ganancias sin emisiones inflacionarias.

### Multiplicador de Voto
Factor (de 1.1x a 2.0x) aplicado a la cantidad de tokens stakeados dependiendo del tiempo de bloqueo, incrementando linealmente el peso del voto del usuario en la gobernanza.
