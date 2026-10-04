# Historias de usuario — Luis (@LuisLopez1910)

Revisado y aprobado por Luis, 4-oct-2026.

Foco tentativo: la pieza en testnet y la evidencia pública (contrato
demo, tablero). Si prefieres repartir distinto con Mau, este agrupamiento
es solo un punto de partida, no una asignación fija.

1. **Como juez o revisor del Demo Day**, quiero ver un contrato real en
   testnet corriendo con una versión vieja de `soroban-sdk`, y a
   Soroready detectando en vivo que se va a romper con el próximo
   protocolo, para entender el problema sin que me lo expliquen con
   diapositivas.

2. **Como organizador de un hackathon/bootcamp**, quiero ver un tablero
   público con el % de repos de Stellar listos para el próximo
   protocolo, para usarlo como evidencia de que el problema es real y no
   un número inventado.

3. **Como mantenedor**, quiero que Soroready solo abra un issue — nunca
   un PR automático — en esta fase, para mantener control total sobre
   qué cambios entran a mi código.

4. **Como contribuidor nuevo a un repo de Stellar**, quiero que el issue
   de Soroready incluya un link directo a la guía de migración oficial
   del SDK (`docs.rs/soroban-sdk/<version>/soroban_sdk/_migrating`), para
   no tener que buscarla yo mismo.

5. **Como mantenedor de un repo público**, quiero que el issue cite la
   fuente exacta de la versión vigente (release de `stellar-core` /
   `rs-soroban-sdk`, no una suposición), para poder confiar en el
   diagnóstico sin tener que verificarlo yo mismo.

6. **Como alguien evaluando si instalar Soroready**, quiero ver el %
   real de repos del ecosistema que ya están al día, actualizado con
   datos verificables, para decidir si el problema me aplica a mí
   también.

## Nota de evidencia

Historia 1 usa la cadencia real verificada (protocolo 25 → 29 cada ~2
meses en 2026, no cada trimestre como se asumía originalmente —
corregido con releases reales de stellar-core/rs-soroban-sdk, 4-oct-2026).
Historias 2 y 6 usan el mismo dato base: 106 de 5,708 repos en la versión
vigente (Raven, 3-oct-2026).
