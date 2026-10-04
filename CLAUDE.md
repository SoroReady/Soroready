@AGENTS.md

# CLAUDE.md — Soroready

**Repo:** [github.com/SoroReady/Soroready](https://github.com/SoroReady/Soroready)
(transferido de `Eras256/Soroready` el 4-oct-2026).

Las reglas duras viven en [AGENTS.md](AGENTS.md), importadas arriba — no
las repitas aquí. Este archivo es el mapa, no el reglamento.

## Qué es Soroready

Radar que avisa a los repos de Stellar antes de que un upgrade trimestral
de protocolo les rompa algo. Lee `Cargo.toml`/`package.json`, compara
`soroban-sdk`/`stellar-sdk` contra las versiones vigentes, y abre un issue
con qué cambia y qué hay que tocar, antes de la fecha límite. Solo issues
por ahora — sin PRs automáticos.

**Evidencia (Raven, 3-oct-2026):** de 5,708 repos indexados de Stellar,
1,282 usan un `soroban-sdk` ya obsoleto; solo 106 están en la versión
actual. Protocolo vigente verificado en Horizon el 4-oct-2026: mainnet y
testnet en protocol 29. Fecha del próximo upgrade: no confirmada — SDF
saca uno por trimestre, pero sin fecha pública verificada todavía.
Reverificar ambos datos con Raven antes de usarlos en cualquier entregable
— no son permanentes.

## El efecto Pollar aplicado aquí

Lo que crece un proyecto como este no es el producto en sí: es (1)
resolver un primer paso universal, (2) integrarse en minutos y gratis, (3)
tener su propio canal. Para Soroready: preinstalado en los kits de
arranque de Stellar (candidato: Scaffold Stellar), una sola GitHub Action
sin configuración, y un canal propio vía eventos "upgrade day" + un
tablero público de "% de repos listos para el próximo protocolo".

## MVP del bootcamp

1. GitHub Action: lee manifests, compara versiones, abre issue.
2. Contrato demo en testnet con una versión vieja de `soroban-sdk`.
3. Tablero público (JSON o página estática) con el % de repos listos.

## Equipo y entregables

Mau y Luis, bootcamp BAF "Blockchain Builders 101". Demo Day: 26-oct-2026.
Entregables: Problem Brief, Lean Canvas, pieza en testnet, video demo,
roadmap de 30 días. Pendiente confirmar con Fer (BAF) si Mau y Luis están
inscritos como equipo.

## Files

| File | What it is |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Las reglas duras |
| `playbooks/PLAYBOOK-claude-antigravity-setup.md` | Investigación detrás de la configuración de este proyecto |
| `playbooks/PLAYBOOK-build-flow.md` | Flujo generalizado estrategia → build para un proyecto de grant/bootcamp |
| `playbooks/git.md` | Cómo se escriben PRs/issues/comentarios en GitHub |
| `playbooks/continue.md` | Retomar una sesión sin reverificar lo ya verificado |
| `playbooks/images.md` | Pegar imágenes/screenshots sin gastar tokens de más |
| `playbooks/drive.md` | Evitar el MCP de Google Drive por defecto |
| `playbooks/PLAYBOOK-register-cleanup.md` | Limpieza de "tells" de escritura de IA |
| `playbooks/PATRON.md` | Plantilla para un prompt maestro "de cero a cien" |
| `playbooks/PROMPT-daylist-session-report.md` | Reporte de cierre de sesión en formato DAYLIST |
| `.claude/skills/claude-antigravity-setup/SKILL.md` | Checklist de configuración de proyecto |
| `.claude/skills/public-claim-verify/SKILL.md` | Verificar una afirmación pública antes de publicarla |
| `.claude/skills/doc-accuracy-audit/SKILL.md` | Auditar que la documentación coincide con el código real |
| `.claude/skills/repo-security-sweep/SKILL.md` | Barrido de seguridad de un repo antes de hacerlo público |
| `.claude/skills/teammate-commit-identity/SKILL.md` | Identidad de autoría correcta en commits de equipo |
| `.claude/skills/mexico-legal-check/SKILL.md` | Chequeo legal mexicano si Soroready alguna vez toca fondos/fiat |
| `.claude/skills/hackathon-fit-check/SKILL.md` | Qué tan bien encaja un proyecto en un hackathon/bootcamp dado |
| `.claude/skills/grants-track-record/SKILL.md` | Historial de tracción para una solicitud de grant |
| `.claude/skills/ecosystem-skills-installer/SKILL.md` | Instalar skills de un ecosistema nuevo verificadas, no copiadas a ciegas |
| `.claude/skills/full-context-loading/SKILL.md` | Qué contexto ya está cargado antes de responder |

### Persistent memory — outside this directory

Memory files live at
`~/.claude/projects/-home-vaiosvaios-Soroready/memory/`, indexed by
`MEMORY.md` there. Deliberadamente fuera de la carpeta del proyecto para
que nunca termine en el repo público por accidente. Aún vacía (4-oct-2026)
— no asumas que ya tiene contenido.

## Tooling

**Raven (MCP, `stellar-raven`)** y **lumenloop** están configurados en
`.mcp.json` — la sesión necesita reiniciarse después de agregarlo; corre
`/mcp`. Consulta Raven antes de afirmar cualquier hecho de Stellar
(versión de protocolo, fecha de upgrade, estructura de un repo).

**WSL note:** WSL tiene su propio `$HOME`. Las skills instaladas en
Windows no aparecen en Ubuntu — hay que instalar con
`ecosystem-skills-installer` directamente aquí si hace falta algo nuevo.
