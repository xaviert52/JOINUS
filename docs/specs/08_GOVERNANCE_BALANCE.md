# Especificación Técnica: Equilibrio de Gobernanza y Distribución

Este documento detalla el mecanismo político-económico del JNS Ecosistema, garantizando que el peso en la gobernanza y los dividendos extraordinarios estén perfectamente alineados con el compromiso de convicción a largo plazo.

---

## 1. Mecanismo de Distribución de Alta Convicción

Para incentivar la participación activa y evitar la apatía política en el ecosistema, los flujos extraordinarios del protocolo (por ejemplo, trimestres de alta rentabilidad en The Arena Casino o rendimientos excepcionales del Hedge Fund) se distribuyen mediante un modelo de **Alta Convicción**.

### Reglas de Asignación de Dividendos Extraordinarios
Los dividendos extraordinarios no se distribuyen a todos los tenedores por igual, sino bajo dos condiciones estrictas y auditables on-chain:
1. **Compromiso de Convicción Temporal (Lock de 365 días):** El usuario debe poseer el Liquid Staking Token (LST) **$JNSX** correspondiente a un bloqueo de máxima duración (365 días).
2. **Participación Democrática Activa:** El contrato de distribución cruzará los balances de staking con el registro histórico de votaciones del **JNSGovernorzk.sol**. Los dividendos extraordinarios se calculan proporcionalmente sólo para aquellas direcciones que hayan emitido votos en al menos el 80% de las propuestas cerradas en el período evaluado.

Este mecanismo mitiga el parasitismo financiero (free-riding), premiando exclusivamente a quienes aportan valor tanto en capital como en dirección política al protocolo.

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

### Razón de Diseño
Se descarta la utilización de una votación cuadrática simple debido al riesgo latente de desincentivar y ahuyentar a los grandes proveedores de capital (ballenas) ante la fuga de liquidez en un entorno multicadena. No obstante, al mantener multiplicadores temporales significativos (hasta 2.0x), se concede una ventaja proporcional y competitiva al inversor minorista dispuesto a bloquear su capital por un año completo, contrarrestando el peso bruto del capital oportunista a corto plazo.
