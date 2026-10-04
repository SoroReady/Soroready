# Problem Brief — Soroready (Semana 1)

**v1 · 4-oct-2026 · Blockchain Builders 101 (BAF)**

Revisado y aprobado por el equipo (Mau y Luis), 4-oct-2026. Investigación
con Raven + GitHub API, 3/4-oct-2026.

## Decisión del problema

**Problema elegido:** los equipos que mantienen un repositorio de
Stellar/Soroban no se enteran de que un upgrade de protocolo les va a
romper algo hasta que ya se rompió.

**Por qué elegimos este:** de las candidatas que trajo cada uno (ver
`MauGuillen.md` y `LuisLopez.md`), esta fue la única con un dato numérico
duro y verificable (1,282 de 5,708 repos indexados de Stellar con
`soroban-sdk` obsoleto, Raven 3-oct-2026), un mecanismo de detección
concreto y automatizable (comparar manifest contra versión vigente), un
canal de distribución identificable (Scaffold Stellar), y sin
competidor directo encontrado. También es la única candidata donde la
pregunta "¿por qué blockchain?" tiene una respuesta honesta y no
forzada — el histórico inalterable del tablero público — en vez de una
justificación inventada después del hecho.

**Propuestas descartadas:**
1. *Proyectos de hackathon que mueren al terminar el evento* (candidata
   de Mau) — descartada porque la causa raíz es social (incentivos,
   tiempo del equipo), no un problema de confianza entre partes ni de
   registro. Blockchain no resuelve por qué alguien deja de mantener su
   código.
2. *Fragmentación de kits de arranque de hackathon* (candidata de Luis)
   — descartada porque el mercado ya lo resolvió solo: un kit
   (`stellar-scaffold/cli` + `stellar-scaffold/ui`) se volvió el estándar
   de facto, documentado oficialmente por SDF, sin que hiciera falta
   ningún mecanismo distribuido.

**Cómo tomamos la decisión:** cada integrante trajo sus propias
candidatas por separado, ancladas en evidencia real levantada con Raven
y la API de GitHub, no en intuición. Se compararon contra tres filtros:
¿hay un número verificable detrás?, ¿el mecanismo de solución es
automatizable en el alcance de 3 semanas del bootcamp?, y ¿la respuesta
a "por qué blockchain" es honesta o forzada? La candidata del upgrade de
protocolo fue la única que pasó los tres filtros para ambos.

---

## 1. Encabezado

**Proyecto:** Soroready. **Fecha:** 4-oct-2026. **Bootcamp:** Blockchain
Builders 101 (BAF) — Semana 1. **Demo Day:** 26-oct-2026. **Equipo:**
Mau Guillén (@mawyguillen-cpu), Luis López (@LuisLopez1910).

## 2. Equipo y roles

- **Mau Guillén** (@mawyguillen-cpu) — foco tentativo: detección/
  diagnóstico de la Action y canal de distribución (Scaffold Stellar,
  eventos). 6 años organizando eventos de cripto, relevante para la
  tesis de canal del proyecto (eventos "upgrade day").
- **Luis López** (@LuisLopez1910) — foco tentativo: la pieza en testnet
  y la evidencia pública (contrato demo, tablero).

La división es un punto de partida propuesto por ambos en la revisión de
la Semana 2, no una asignación rígida — puede reacomodarse según avance
el trabajo real.

## 3. Problema y evidencia

Los repos de Stellar/Soroban dependen de `soroban-sdk`/`stellar-sdk`, y
esas librerías están atadas a una versión específica del protocolo de
la red. Cuando el protocolo sube de versión, el código que no se
actualizó puede dejar de compilar, de simular correctamente, o de
comportarse como antes — y nadie avisa a los mantenedores de que eso
viene. Medido con Raven el 3-oct-2026: de 5,708 repos indexados del
ecosistema Stellar, 1,282 (~22%) usan ya un `soroban-sdk` obsoleto, y
solo 106 (~1.9%) están en la versión vigente. La cadencia real del
protocolo es más agresiva que la suposición inicial del equipo: en 2026
subió de versión cada ~2 meses (protocolo 25 en enero, 26 en abril, 27
en junio, 28 en agosto, 29 confirmado vigente en Horizon el 4-oct-2026),
no cada trimestre, verificado contra los releases reales de
`stellar-core`/`rs-soroban-sdk`/`js-stellar-sdk`. La fecha del protocolo
30 no tiene señal oficial pública todavía — se reverifica antes de
cualquier entregable que dependa de ello.

## 4. Usuario y actores

El usuario principal es cualquier mantenedor de un repo activo de
Stellar/Soroban, pero no es un grupo homogéneo: hay al menos dos
segmentos con comportamiento distinto. El primero es el equipo de
hackathon o bootcamp que despliega rápido y no vuelve a tocar el repo —
la población donde el desfase se acumula más rápido y con menos
probabilidad de que alguien lo note a tiempo. El segundo es el equipo en
producción, sin una persona dedicada a monitorear releases de SDK, que
sí revisa su código pero no tiene forma barata de saber cuándo revisar.
Actores secundarios: organizadores de hackathons/bootcamps que quieren
evidencia de que el problema es real para justificar un evento tipo
"upgrade day" (rol que calza con la experiencia de Mau organizando
eventos de cripto), jueces de un Demo Day evaluando la pieza en testnet,
y el propio proyecto Scaffold Stellar (`stellar-scaffold/cli` +
`stellar-scaffold/ui`) como canal de distribución potencial si acepta la
integración propuesta. Es importante notar lo que NO hay: ningún actor
custodia fondos ni actúa como intermediario de confianza en este flujo —
Soroready solo lee repos públicos y diagnostica, nunca firma
transacciones ni sostiene una llave.

## 5. Flujo actual de valor

Hoy, mantenerse al día depende de que alguien en el equipo lea por su
cuenta los release notes de cuatro repos distintos
(`stellar-core`, `rs-soroban-sdk`, `js-stellar-sdk`, `stellar-cli`) y las
notas de las reuniones de protocolo en developers.stellar.org/meetings,
y cruce eso manualmente contra lo que su propio `Cargo.toml`/
`package.json` declara. Ese cruce no es trivial: cada repo publica en su
propio calendario (verificado — `stellar-cli` v28.0.0 salió el
26-ago-2026, `rs-soroban-sdk` v28.0.0 el 18-sep-2026, ambos "para"
protocolo 28, con tres semanas de diferencia entre sí), así que no basta
con mirar un solo changelog. Herramientas genéricas de dependencias
(Dependabot, Renovate) sí avisan cuando existe una versión más nueva de
un paquete, pero no saben qué significa ese cambio en términos de
protocolo de Stellar ni qué se rompe específicamente — tratan
`soroban-sdk` como cualquier otro crate de Rust, sin distinguir un bump
cosmético de uno que cambia el formato de autorización (como pasó entre
protocolo 27 y 28). El costo real de este flujo no es solo el tiempo de
revisión manual, sino el riesgo de que el primer síntoma visible sea un
despliegue roto en vivo, en medio de una demo o en producción. No se
encontró ninguna herramienta que automatice este cruce específicamente
para el ecosistema Stellar (búsqueda de competidores vía Raven,
3-oct-2026).

## 6. Fricciones identificadas

(1) La información de versión vigente está repartida en cuatro repos de
releases distintos, sin un solo lugar que diga "esto es lo vigente hoy"
— cruzarlos a mano es exactamente el tipo de tarea mecánica que un
humano hace mal y se salta cuando tiene prisa. (2) Un aviso genérico de
"hay una versión nueva" no dice qué archivos tocar ni qué cambió
realmente — el mantenedor tiene que leer el changelog completo por su
cuenta y traducirlo a su propio código, cada vez. (3) Los repos que
salen de un hackathon quedan `dormant` después del evento (confirmado en
varios scaffolds reales de Stellar: `SecureFlow-scaffold`,
`token-scaffold`, `hackthon-scaffold-stellar`, entre otros), así que
nadie vuelve a revisarlos nunca y el desfase se acumula en silencio, sin
ningún disparador que lo haga visible. (4) No existe una métrica pública
y verificable de qué tan preparado está el ecosistema en conjunto — el
106/5,708 de hoy es un dato que generamos nosotros con Raven, no algo
que ya existiera publicado en ningún lugar. (5) Un mantenedor que sí
quiere estar al día no tiene forma de saber si ya está bien sin hacer el
trabajo completo de verificación — no hay un chequeo rápido tipo
"semáforo", solo la opción de leer todo o no revisar nada.

## 7. Oportunidad e hipótesis

La hipótesis central: si se reduce el costo de saber "¿me afecta el
próximo protocolo?" a instalar una GitHub Action sin configuración, la
mayoría de los mantenedores sí van a actuar sobre un issue claro, en vez
de descubrir el problema cuando ya falló. Esta hipótesis es comprobable
dentro del bootcamp sin esperar adopción externa: basta con correr la
Action sobre un repo demo con `soroban-sdk` deliberadamente viejo y
verificar que el issue que abre sea correcto, específico y accionable —
no un simple "actualiza tu dependencia". La oportunidad de crecimiento
más grande no está en el producto aislado, sino en el canal: si
Soroready queda preinstalado en `stellar-scaffold/ui` (el template real
detrás de `stellar scaffold init`, confirmado activo y oficialmente
documentado por SDF), cada proyecto nuevo del ecosistema nace ya
protegido, sin que nadie tenga que buscarlo ni instalarlo por su cuenta
— la misma lógica de "primer paso universal" que explica por qué otras
herramientas de adopción masiva crecen vía integración en el punto de
partida, no vía marketing directo. Para el Demo Day, la validación se
reduce a tres señales concretas: que la Action detecte correctamente el
desfase en el contrato demo, que el issue generado sea legible por
alguien sin contexto previo del proyecto, y que el % del tablero público
suba de forma verificable si se corre sobre una muestra más grande que
la de hoy.

## 8. Criterio de pertinencia

Este problema es específico de Stellar, no un chequeador de dependencias
genérico disfrazado: el acoplamiento entre versión de SDK y versión de
protocolo es real y documentado (ej. `rs-soroban-sdk` v28.0.0 dice
explícitamente "supporting Protocol 28", y el cambio de formato de
credenciales de autorización entre protocolo 27 y 28 es un breaking
change real, no cosmético), y la solución solo tiene sentido dentro de
este ecosistema — no se puede recortar y pegar para otra red sin
rehacer todo el mapeo versión↔protocolo. Dicho con honestidad, para no
caer en blockchain-washing: la arquitectura de la Action y del issue es
tooling convencional de CI, no on-chain — el criterio de pertinencia
blockchain no viene de que el producto necesite una cadena para
funcionar como notificador, sino de que el problema que resuelve es
nativo de mantener software que vive sobre una blockchain específica
con su propio ciclo de upgrades. La única pieza donde blockchain aporta
algo que una base de datos normal no daría — el histórico inalterable
del tablero público, auditable por terceros que no confían en el
autorreporte de Soroready — está identificada, acotada y marcada como
secundaria, no forzada para justificar el proyecto completo. Preferimos
esta honestidad a inflar una justificación on-chain que no sería real.

## 9. Supuestos y riesgos

**Supuestos:** que los mantenedores de repos de Stellar van a confiar en
que una Action de terceros abra issues en su repo sin sentir que es
ruido o spam, siempre que el diagnóstico sea específico y no genérico;
que las fuentes de versión vigente (releases de GitHub de
`stellar-core`/`rs-soroban-sdk`/`js-stellar-sdk`/`stellar-cli`) van a
seguir siendo públicas y parseables de la misma forma, sin requerir
autenticación especial; y que un repo de hackathon abandonado sigue
siendo un objetivo válido para medir el % del tablero aunque nadie vaya
a actuar sobre su issue.

**Riesgos:** (1) inscripción del equipo en BAF pendiente de confirmar
con Fer — el registro cerró el 19-sep-2026, y sin esa confirmación el
proyecto no tiene garantizado un lugar en el Demo Day; (2) la fecha del
protocolo 30 no está confirmada públicamente (verificado con Raven,
4-oct-2026), así que no se puede prometer un plazo exacto en el pitch
sin reverificarlo ese mismo día; (3) la integración a
`stellar-scaffold/ui` es una propuesta, no un acuerdo — nadie del lado
de Scaffold Stellar la ha visto ni evaluado todavía, y podría ser
rechazada o tardar más de lo que dura el bootcamp; (4) el nombre
`soroready` está libre en npm y GitHub, reverificado hoy (4-oct-2026),
pero nada se registra sin el OK explícito de Giovanni; (5) si la
muestra del tablero público es chica al inicio, el % puede no ser
representativo del ecosistema completo — hay que decir explícitamente
el tamaño de la muestra cada vez que se cite el número.
