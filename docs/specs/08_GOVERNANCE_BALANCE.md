# Especificación Técnica: Equilibrio de Gobernanza y Distribución

Este documento detalla el mecanismo político-económico del JNS Ecosistema, garantizando que el peso en la gobernanza y los dividendos extraordinarios estén perfectamente alineados con el compromiso de convicción a largo plazo.

---

## 1. Mecanismo de Distribución y Estructura de Recompensa Dual

Para incentivar la participación activa y evitar la apatía política en el ecosistema, JNS implementa una **Estructura de Recompensa Dual** y un modelo de distribución de **Alta Convicción**.

### Estructura de Recompensa Dual
Las recompensas distribuidas a los stakers se dividen en dos flujos independientes gestionados por contratos inteligentes:

1. **RewardPool General (APY Dinámico en $JNS):**
   - El 2% de retención del tax transaccional se envía ÚNICA Y EXCLUSIVAMENTE a la dirección de la bóveda del RewardPool General de la DAO. Ningún usuario recibe distribuciones directas del mercado. El Smart Contract calcula un APY dinámico. Reclamar este Base Yield a la wallet incurre en el 3% de Tax normal. El Auto-Compound es 100% Tax-Free.
   - **Ecosistema Modular**: Adicionalmente, el RewardPool actúa como un "Agujero Negro de Valor" alimentándose de TODOS los futuros módulos del Ecosistema Modular (Casino, Launchpad, Lending Hub, etc.), engordando constantemente la emisión asintótica pasiva.
   - El saldo acumulado en este pool se distribuye asintóticamente a los stakers.

2. **Bóveda de Dividendos Extraordinarios (Excedente Limpio B2B en $ETH o $USDC):**
   - Se alimenta de los ingresos extraordinarios netos del DeFi Venture Hub (B2B Yield Routing Engine y tarifas del Launchpad).
   - Estos fondos se almacenan en una bóveda separada y no sufren auto-compound automático.
   - Se distribuyen a CUALQUIER staker de Alta Participación Cívica para reclamarse de forma directa en monedas duras líquidas ($ETH o $USDC), independientemente de su tiempo de bloqueo.

### Reglas de Asignación de la Bóveda de Dividendos
Los fondos de la Bóveda de Dividendos se asignan de forma meritocrática bajo dos condiciones estrictas on-chain:
1. **Sin Restricción de Convicción Temporal:** El usuario puede poseer el Liquid Staking Token (LST) **$JNSX** en cualquier bloqueo (incluso Flexible).
2. **Participación Democrática Activa (Quórum de Voto > 70%):** El contrato de distribución cruzará los balances de staking con el registro histórico de votaciones del **JNSGovernorzk.sol**. Solo se considerarán aptas las direcciones que registren participación en más del 70% de las propuestas del período evaluado.

Este mecanismo mitiga el parasitismo financiero (free-riding) y premia de manera directa y tangible a los usuarios alineados a largo plazo con la gobernanza y solvencia del Hub.

### Filtros de Gobernanza y Ciclos de Votación
Para asegurar una democracia madura, se imponen las siguientes reglas:
- **Periodo de Votación**: 7 Días inmutables en el Governor (Weekly Epochs).
- **Proposal Threshold (Umbral de Propuesta)**: Para someter una propuesta oficial on-chain, se requiere un mínimo de Poder de Voto en $JNSX, validando el compromiso del proponente.
- **Temperature Check**: Todo proposal debe superar primero un sondeo off-chain en la comunidad para filtrar spam.

---

## 2. Ecuación del Peso de Voto

El poder de voto dentro del contrato de gobernanza con soporte zk-SNARKs (`JNSGovernorzk.sol`) se calcula de manera lineal y descentralizada a partir de los depósitos en el contrato de staking. 

### Cálculo Formal
Para asegurar la gobernanza líquida, el poder de voto está directamente indexado al balance del LST del usuario ($JNSX) y ponderado por un multiplicador temporal según el lock elegido:

$$\text{Poder de Voto} = \text{Balance } JNSX \times \text{Multiplicador de Bloqueo}$$

Donde los parámetros y límites están definidos estrictamente por los siguientes multiplicadores:

| Tipo de Lock | Duración del Bloqueo | Multiplicador de Bloqueo |
| :--- | :--- | :--- |
| Flexible | Sin bloqueo | 1.0x |
| Lock Corto | 30 días | 1.1x |
| Lock Medio | 90 días | 1.3x |
| Lock Largo | 180 días | 1.6x |
| Lock Convicción | 365 días | 2.0x |
| Lock Extremo 1 | 730 días (2 Años) | 2.6x |
| Lock Extremo 2 | 1095 días (3 Años) | 3.2x |

### La Porción del Pastel (Slice of the Pie)
El concepto central del APY no es un "Porcentaje Fijo", sino una **"Porción del Pastel" (Slice of the Pie)**. La justicia matemática de las recompensas base se define estrictamente bajo la siguiente ecuación en cada cierre de época:
**`(User $JNSX / Total Global $JNSX) * Weekly Emission`**

La Emisión Semanal está regulada por la fórmula asintótica para mantener el Health Factor en 10.2 Años de forma auto-regulada: 
**`Weekly Emission = Current RewardPool Balance / Target Health Weeks`**
*(Actualmente `Target Health Weeks` = 530, gobernable vía votación)*

### Frecuencia de Pagos (Claiming) y Auto-Compound Activo (El Ritual Semanal)
El mecanismo de Auto-Compound NO es un proceso pasivo en background, sino una acción de ejecución requerida por el usuario de forma periódica. Queda fijado que el "Ritual Semanal" no confisca fondos. Si un usuario no ejecuta Claim o Compound el domingo, las recompensas se acumulan perpetuamente y de manera segura en el Smart Contract. Cuando el usuario decide ejecutar el "Ritual Semanal" para reinvertir sus utilidades, la interfaz de la dApp le permite enrutar estas ganancias por defecto hacia una nueva posición de Staking FLEXIBLE o iniciar un "Stake Laddering" independiente para cada reinversión eligiendo entre los 7 niveles de candado (desde 1.0x hasta 3.2x). Adicionalmente, el Paymaster ERC-4337 patrocinará única y exclusivamente transacciones de Civismo y Retención (Votar con pruebas ZK y hacer Auto-Compound). Las funciones de retiro de capital (Withdraw/Early Unstake) exigirán que el usuario pague su propio gas.

### Transparencia de UI y Aislamiento de Acciones Destructivas
Para salvaguardar el capital de los usuarios:
- **Aislamiento de Retiros**: La opción de Early Unstake está aislada atómicamente a nivel de interfaz. Solo puede ser ejecutada desde el Modal Individual de Detalles de una posición activa específica, previniendo así retiros globales por error.
- **Saldos Dinámicos**: Los rendimientos del RewardPool (Base Yield) no se renderizan como un solo bloque engañoso. Se desglosan en (a) Disponible para retirar, (b) Acumulado en este ciclo y (c) Temporizador de Epoch. Todo en paleta monocromática (blanco/gris) para evitar falsa urgencia psicológica (colores verdes/rojos).
- **Regla de Frecuencia**: Las posiciones FLEXIBLES (que no tengan ningún bloqueo activo asociado a la wallet) pueden reclamar el Base Yield o hacer Auto-Compound en cualquier momento (diario, por minuto). 
- Sin embargo, las posiciones BLOQUEADAS (30 días a 3 años) deben respetar el ciclo de la época, por lo cual **solo pueden reclamar o hacer Auto-Compound una vez por semana (7 días de enfriamiento mínimo entre retiros)**.

### Razón de Diseño
Se descarta la utilización de una votación cuadrática simple debido al riesgo latente de desincentivar y ahuyentar a los grandes proveedores de capital (ballenas) ante la fuga de liquidez en un entorno multicadena. No obstante, al mantener multiplicadores temporales significativos (hasta 2.0x), se concede una ventaja proporcional y competitiva al inversor minorista dispuesto a bloquear su capital por un año completo, contrarrestando el peso bruto del capital oportunista a corto plazo.
