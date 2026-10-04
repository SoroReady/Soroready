# Problema — Mau (@mawyguillen-cpu)

Revisado y aprobado por Mau, 4-oct-2026.

Dos candidatas reales, basadas en datos verificados con Raven/GitHub API
(3/4-oct-2026). La segunda es la que el equipo terminó eligiendo — ver el
razonamiento completo en `docs/semana1/ProblemBrief.md`.

## Candidata 1 (descartada) — Proyectos de hackathon que mueren al terminar el evento

**El problema:** la gente arma un proyecto para un evento de un fin de
semana y, apenas termina, nadie vuelve a tocarlo nunca.

**¿Quién lo sufre?** los propios equipos (el trabajo se pierde), los
organizadores de hackathons (no pueden mostrar impacto después del
evento), y cualquiera que llegue después buscando un ejemplo real para
aprender y encuentre solo código abandonado.

**¿Cómo se resuelve hoy y qué cuesta?** no se resuelve — se acepta como
normal. Lo confirmé revisando repos reales que salieron de hackathons de
Stellar: `SecureFlow-scaffold`, `token-scaffold`,
`hackthon-scaffold-stellar`, `stellar-scaffold-front-hackaton`,
`dropsland-scaffold`, `validate-scaffold` — todos marcados `dormant`
(sin commits en más de 180 días), la mayoría con 0-2 estrellas.

**¿Por qué creo que blockchain podría aportar?** Honestamente, poco. Lo
intenté encajar en "registro compartido entre partes que no confían
entre sí" o "histórico inalterable", pero la causa real de que un
proyecto muera es social — tiempo, incentivos, que el equipo se
disuelve — no un problema de confianza ni de registro. Blockchain no
arregla por qué alguien deja de mantener su código. Por eso la
descartamos: si la respuesta honesta a "¿por qué blockchain?" es "no
mucho", no es el problema correcto para este bootcamp.

## Candidata 2 (elegida) — Un upgrade de protocolo rompe tu build y no te avisan

**El problema:** quienes mantienen un repositorio de software dejan de
darse cuenta cuando una pieza externa de la que dependen cambia de forma
que rompe su proyecto.

**¿Quién lo sufre?** cualquier equipo con un repo activo de
Stellar/Soroban — medido con Raven (3-oct-2026): 1,282 de 5,708 repos
indexados usan un `soroban-sdk` ya obsoleto; solo 106 están al día. Es
más agudo para equipos de hackathon que despliegan y no vuelven (la
misma población de la candidata 1, pero aquí sí hay un mecanismo
concreto y medible que se puede arreglar).

**¿Cómo se resuelve hoy y qué cuesta?** manualmente — alguien tiene que
leer los release notes de `stellar-core`/`rs-soroban-sdk`/`js-stellar-sdk`
y las notas de reunión de protocolo por su cuenta. Herramientas
genéricas (Dependabot, Renovate) suben versiones de paquete pero no
saben qué significa un cambio de protocolo de Stellar — no existe nada
que lo haga específicamente para este ecosistema (sin competidor directo
encontrado, Raven, 3-oct-2026).

**¿Por qué creo que blockchain podría aportar?** Aquí la respuesta es
más honesta que forzada: el tablero público de "% de repos listos" solo
vale como evidencia si nadie —ni nosotros mismos— puede editarlo después
de publicado. Anclar ese histórico (vía un hash periódico on-chain, por
ejemplo) lo convierte en un **histórico inalterable** que cualquiera
puede auditar, en vez de un número que solo confías porque lo decimos
nosotros. No es la razón de ser del proyecto — la razón de ser es
detectar el desfase — pero sí es la pieza donde blockchain aporta algo
real y no decorativo.
