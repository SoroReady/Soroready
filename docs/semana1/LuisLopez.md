# Problema — Luis (@LuisLopez1910)

Revisado y aprobado por Luis, 4-oct-2026.

Dos candidatas reales, basadas en datos verificados con Raven/GitHub API
(3/4-oct-2026). La segunda es la que el equipo terminó eligiendo — ver el
razonamiento completo en `docs/semana1/ProblemBrief.md`.

## Candidata 1 (descartada) — Cada hackathon usa su propio kit de arranque, y la mayoría no sobrevive

**El problema:** quien empieza un proyecto nuevo tiene que elegir entre
varios puntos de partida distintos, casi todos abandonados, sin saber
cuál seguirá vivo en seis meses.

**¿Quién lo sufre?** desarrolladores nuevos en un ecosistema, que pierden
tiempo evaluando opciones muertas antes de llegar a la que sí funciona.

**¿Cómo se resuelve hoy y qué cuesta?** preguntando en Discord o
buscando a ciegas. Confirmé que existen múltiples "scaffolds" de Stellar
compitiendo por atención, casi todos inactivos
(`stevmolina/token-scaffold`, `danielgorgonha/hackthon-scaffold-stellar`,
`masch/stellar-scaffold-front-hackaton`, `anataliocs/validate-scaffold`),
mientras uno solo —`stellar-scaffold/cli` + `stellar-scaffold/ui`— está
activo, documentado oficialmente en developers.stellar.org, y mantenido
(54★/37 forks el repo de CLI, commits hasta el 1-oct-2026).

**¿Por qué creo que blockchain podría aportar?** No mucho, y esa es
justamente la razón para descartarla: el mercado ya resolvió esto solo
—un kit se volvió el estándar de facto porque SDF lo documentó
oficialmente— sin que hiciera falta ningún mecanismo de confianza
distribuida. Un "directorio curado" no agrega nada que la adopción
orgánica no haya resuelto ya.

## Candidata 2 (elegida) — Un upgrade de protocolo rompe tu build y no te avisan

**El problema:** quienes mantienen un repositorio de software dejan de
darse cuenta cuando una pieza externa de la que dependen cambia de forma
que rompe su proyecto.

**¿Quién lo sufre?** cualquier equipo con un repo activo de
Stellar/Soroban. Medido con Raven (3-oct-2026): 1,282 de 5,708 repos
indexados usan un `soroban-sdk` ya obsoleto; solo 106 están al día. Y la
cadencia real es más agresiva de lo que asumíamos al principio —
protocolo 25→29 cada ~2 meses en 2026, no cada trimestre (verificado con
releases reales de `stellar-core`).

**¿Cómo se resuelve hoy y qué cuesta?** nadie lo centraliza. Las
versiones viven repartidas en cuatro repos distintos de releases
(`stellar-core`, `rs-soroban-sdk`, `js-stellar-sdk`, `stellar-cli`) que
hay que cruzar a mano contra lo que tu `Cargo.toml`/`package.json`
dice — y herramientas genéricas de dependencias no saben qué versión
corresponde a qué protocolo.

**¿Por qué creo que blockchain podría aportar?** El tablero público de
"% de repos listos" solo tiene valor como evidencia si es un **registro
que distintas partes que no se conocen entre sí** —organizadores de
eventos, jueces de un Demo Day, otro equipo evaluando si le aplica el
problema— pueden confiar sin tener que creerle a Soroready por su
palabra. Publicar el histórico de esa métrica de forma que no se pueda
reescribir después (un hash periódico, por ejemplo) es lo que lo
convierte en evidencia real en vez de un número que publicamos nosotros
mismos. Es una pieza secundaria del proyecto, no el núcleo, pero es
honesta: ahí sí hay algo que blockchain resuelve y una base de datos
normal no.
