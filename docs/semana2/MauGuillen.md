# Historias de usuario — Mau (@mawyguillen-cpu)

Revisado y aprobado por Mau, 4-oct-2026.

Foco tentativo: el lado de detección/diagnóstico de la Action y la
integración con el canal de distribución (Scaffold Stellar, eventos). Si
prefieres repartir distinto con Luis, este agrupamiento es solo un punto
de partida, no una asignación fija.

1. **Como mantenedor de un repo de Soroban**, quiero que algo me avise
   antes de que el próximo protocolo rompa mi build, para no enterarme
   cuando ya falló en producción o en medio de una demo.

2. **Como mantenedor de un repo con CI ya configurado**, quiero instalar
   Soroready como una GitHub Action en minutos, sin tener que configurar
   nada manualmente más allá de agregar el workflow.

3. **Como mantenedor**, quiero que el issue que abre Soroready me diga
   exactamente qué cambia en el próximo protocolo y qué archivos tocar —
   no solo "tu `soroban-sdk` está desactualizado".

4. **Como desarrollador que arranca un proyecto nuevo con Scaffold
   Stellar**, quiero que el chequeo de versión venga preinstalado en el
   template (`stellar-scaffold/ui`), para no tener que buscarlo ni
   instalarlo después.

5. **Como organizador de un evento "upgrade day"**, quiero traer mi
   repo al evento y que se revise en vivo contra el protocolo vigente,
   para salir con un diagnóstico claro el mismo día — sin tener que
   instalar nada yo mismo si no quiero.

6. **Como mantenedor de un repo con múltiples contratos en el mismo
   workspace**, quiero que el issue distinga cuáles contratos
   específicos usan la versión obsoleta, para no tener que revisar
   manualmente cada `Cargo.toml` del repo.

## Nota de evidencia

Historias 1, 2 y 6 están ancladas en el dato real de Raven (3-oct-2026):
1,282 de 5,708 repos indexados de Stellar usan un `soroban-sdk`
obsoleto. La historia 4 está anclada en que el repo real de template de
Scaffold Stellar (`stellar-scaffold/ui`) ya tiene `.github/workflows/`
pero ninguno de chequeo de versión (verificado leyendo su árbol de
archivos, 4-oct-2026).
