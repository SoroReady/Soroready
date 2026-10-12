# AGENTS.md — reglas duras de Soroready, siempre, sin excepción

Fuente única de las reglas que aplican en cualquier sesión, en cualquier
herramienta, en este proyecto. `CLAUDE.md` la importa con `@AGENTS.md` —
no dupliques estas reglas ahí.

## Qué es Soroready

Radar que avisa a los repos de Stellar antes de que un upgrade trimestral
de protocolo les rompa algo. Lee `Cargo.toml`/`package.json`, compara
`soroban-sdk`/`stellar-sdk` contra las versiones vigentes, y abre un
issue con qué cambia y qué hay que tocar, antes de la fecha límite. Solo
issues por ahora — sin PRs automáticos.

**MVP:** una GitHub Action que lee manifests y abre un issue de
diagnóstico, un contrato demo en testnet detectado en vivo, y un tablero
público con el % de repos de Stellar listos para el próximo protocolo.

## Reglas duras

**No-custodial por construcción, siempre.** Soroready solo avisa: nunca
toca código, llaves ni fondos de nadie. Lee repos públicos
(`Cargo.toml`, `package.json`) y abre issues — nada más.

**Nunca "SDK" ni "Developer" en el nombre, título o descripción pública
del proyecto o de su paquete.** Nombra la capacidad ("radar de
upgrades", "readiness check"), no la categoría técnica — el paquete es
`@soroready/action`, nunca `@soroready/sdk`.

**Verifica con Raven (MCP) todo hecho de Stellar antes de afirmarlo** —
versión vigente del protocolo, fecha del próximo upgrade, versión de
`soroban-sdk`/`stellar-sdk`. Nunca de memoria de entrenamiento.

**Cero alucinación con cualquier cosa que dependa de la fecha.** Todo lo
dependiente de fecha o versión se reverifica en vivo, no se repite de
una sesión anterior sin checar. Está permitido decir "no lo sé, hay que
verificarlo." Marca como inferencia lo que no se pueda verificar — no lo
presentes como hecho confirmado.

**Nunca afirmar un estado "vivo"/"en producción"/"listo" sin evidencia
verificable.** Que una Action corra no prueba que el issue que abre sea
correcto, ni que un contrato demo "funcione" sin haberlo probado en
testnet de verdad. Se corrige con una nota fechada, nunca en silencio.

**Nunca repitas un "mergeado/cerrado/confirmado" sin verificarlo contra
la API primero** — `gh pr view` / `gh issue view` /
`gh api repos/.../commits`, no de memoria ni de lo que dijo una sesión
anterior.

**Para revisar si un archivo existe en un repo, usa
`gh api repos/OWNER/REPO/git/trees/BRANCH?recursive=1`** y busca la ruta
exacta en la lista completa — nunca
`gh api .../contents/<path> | grep -q .`, porque un 404 imprime `null`,
que `grep -q .` cuenta como verdadero.

**Nunca quitar los trailers de coautoría de IA**, y nómbralos con el
modelo real que produjo el commit, nunca uno fijo de plantilla.

**PRs e issues humanizados.** Título y descripción en el tono del
equipo, no una plantilla genérica de IA — di qué cambia y por qué, no
narres el proceso.

**Scope sprawl es el riesgo documentado de este tipo de proyecto de
bootcamp.** Antes de agregar cualquier cosa, revísala contra el alcance
del MVP: Action que lee manifests → issue con diagnóstico, contrato demo
en testnet, tablero público.

## Público / privado

Este repo es público. Lo que no deba verse, nunca entra a git:

- `playbooks/` — notas y procesos internos del equipo.
- `.claude/` completo — skills, comandos y settings locales.
- La memoria del proyecto — vive fuera del repo, en
  `~/.claude/projects/`.
- `.env`, `.env.*`, `*.key` y cualquier token o llave.
- `node_modules/`, `dist/`, `.vercel/`.

Todo lo anterior va en `.gitignore` y se revisa con `git status` antes
de cada commit.

## Identidad

La cuenta activa de `gh` en esta máquina es compartida entre el equipo
— se revisa con `gh api user --jq .login` antes de cada commit, push o
PR, nunca se asume de una sesión anterior.

| Nombre | Email (noreply) | Cuenta GitHub |
| --- | --- | --- |
| Mau Guillén | `237334409+mawyguillen-cpu@users.noreply.github.com` | `mawyguillen-cpu` |
| Luis López | `330698807+luislopez1910@users.noreply.github.com` | `luislopez1910` |

La identidad de git (`user.name`/`user.email`) se configura solo en el
repo local de quien esté trabajando, nunca con `--global`.
