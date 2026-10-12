@AGENTS.md

# CLAUDE.md — Soroready

Las reglas duras viven en [AGENTS.md](AGENTS.md), importadas arriba — no
las repitas aquí. Este archivo es el mapa, no el reglamento.

## Público: lo que tiene un clon

| Archivo/carpeta | Qué es |
| --- | --- |
| `AGENTS.md` | Reglas duras del proyecto |
| `README.md` | Requisitos, instalación, cómo correr el front |
| `LICENSE` | Apache License 2.0 |
| `.mcp.json` | Configuración de Raven (MCP), sin secretos |
| `.gitignore` | Qué nunca sube al repo |
| `frontend/` | App en Vite + React + TypeScript |
| `docs/` | Entregables del bootcamp (briefs, blueprint, documentación) |

## Local: existe en esta máquina, NO en el repo

| Carpeta | Qué es |
| --- | --- |
| `playbooks/` | Notas y procesos internos del equipo |
| `.claude/skills/` | `claude-antigravity-setup`, `public-claim-verify`, `doc-accuracy-audit`, `repo-security-sweep`, `teammate-commit-identity`, `mexico-legal-check`, `hackathon-fit-check`, `grants-track-record`, `full-context-loading` |

Un clon no tiene estos archivos. No los cites desde un archivo público.

### Memoria persistente

Fuera del repo, en `~/.claude/projects/-home-vaiosvaios-Soroready-1/memory/`,
indexada por su propio `MEMORY.md` ahí.

## Estado (11-oct-2026)

Entregable 3 entregado. Front en producción:
[https://soroready.xyz](https://soroready.xyz) (Vercel, proyecto
`soro-ready/frontend` — se redespliega con `vercel --prod` desde
`frontend/`). Decisión de contratos: Opción B, sin contrato propio.
Siguiente paso: contrato demo en testnet y la GitHub Action — ninguna
de las dos existe todavía.
