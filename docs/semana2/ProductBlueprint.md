# Product Blueprint — Soroready

**v1 · 4-oct-2026 · Semana 2, Blockchain Builders 101 (BAF)**

Revisado y aprobado por el equipo (Mau y Luis), 4-oct-2026. Investigación
con Raven + GitHub API, 3/4-oct-2026. Mismo orden de secciones usado en
Pullcord.

## 1. Priorización de historias

De las historias candidatas en `MauGuillen.md` y `LuisLopez.md`, lo que
de verdad hace falta para el Demo Day del 26-oct-2026 (Must) contra lo
que es deseable pero no bloquea la demo (Should/Could):

| Prioridad | Historia | De |
| --- | --- | --- |
| **Must** | La Action lee `Cargo.toml`/`package.json` y abre un issue con el diagnóstico | Mau #2 |
| **Must** | El issue dice exactamente qué cambia y qué archivos tocar | Mau #3 |
| **Must** | Contrato demo en testnet con `soroban-sdk` viejo, detectado en vivo | Luis #1 |
| **Must** | Soroready solo abre issues, nunca PRs automáticos | Luis #3 |
| **Should** | Tablero público con el % de repos listos | Luis #2 |
| **Should** | El issue cita la fuente exacta de la versión vigente | Luis #5 |
| **Should** | El issue distingue qué contrato específico está desactualizado (multi-contrato) | Mau #6 |
| **Could** | Preinstalado en el template de Scaffold Stellar | Mau #4 |
| **Could** | Soroready usado en vivo en un evento "upgrade day" | Mau #5 |
| **Could** | Link a la guía de migración oficial del SDK en el issue | Luis #4 |

La integración a Scaffold Stellar (Could) es la tesis de crecimiento del
proyecto, pero no es necesaria para demostrar que el radar funciona el
26-oct — por eso queda fuera del "Must" aunque sea la pieza más
estratégica a mediano plazo.

## 2. Propuesta de valor

Un radar, no un parche: Soroready lee tu repo, te dice exactamente qué
versión de SDK tienes, qué protocolo de Stellar viene y qué se va a
romper — antes de la fecha límite, en un issue de GitHub, sin tocar tu
código ni tus fondos. Evidencia del problema: 1,282 de 5,708 repos
indexados de Stellar usan hoy un `soroban-sdk` ya obsoleto; solo 106
están al día (Raven, 3-oct-2026).

## 3. Flujo de usuario

1. El mantenedor agrega el workflow de Soroready a su repo (un archivo
   `.yml`, sin configuración adicional).
2. La Action corre (en push a `main`, o en un cron periódico) y lee
   `Cargo.toml`/`package.json` del repo.
3. Compara la versión de `soroban-sdk`/`stellar-sdk` encontrada contra la
   versión vigente, verificada en vivo (release real de
   `stellar-core`/`rs-soroban-sdk`/`js-stellar-sdk`, no un valor fijo
   desactualizado).
4. Si hay un desfase, abre (o actualiza) un issue en el repo con: qué
   versión tiene, qué versión/protocolo viene, qué cambia (citando el
   changelog real), y qué archivos del repo probablemente lo tocan.
5. El mantenedor lee el issue, decide si y cuándo actualizar — Soroready
   nunca abre un PR ni toca código directamente.
6. En paralelo, el resultado agregado (anónimo, solo "listo/no listo")
   alimenta el tablero público del % de repos de Stellar listos para el
   próximo protocolo.

## 4. Alcance del MVP

**Dentro de alcance (Demo Day 26-oct-2026):**
- GitHub Action que lee manifests y abre un issue de diagnóstico.
- Un contrato demo en testnet con una versión vieja de `soroban-sdk`,
  usado para mostrar la detección en vivo.
- Tablero público (JSON o página estática) con el % de repos listos,
  arrancando con el dato real de hoy (106/5,708).

**Fuera de alcance deliberadamente:**
- PRs automáticos — solo issues por ahora.
- Custodia de fondos o llaves de ningún tipo — Soroready nunca las toca.
- Integración confirmada con Scaffold Stellar — es una propuesta, no un
  acuerdo todavía.
- Modelo de ingresos — no se define para el Demo Day.
- Nombre/paquete con "SDK" o "Developer" — el paquete es
  `@soroready/action`, nunca `@soroready/sdk`.

## 5. Lean Canvas

Versión completa y canónica en [`LeanCanvas.md`](./LeanCanvas.md). Resumen:

| Bloque | Contenido |
| --- | --- |
| Problema | 1,282/5,708 repos de Stellar con `soroban-sdk` obsoleto; solo 106 al día (Raven, 3-oct-2026) |
| Clientes | Mantenedores de repos Stellar/Soroban activos; early adopters vía Scaffold Stellar |
| Propuesta de valor | Radar que avisa antes del upgrade, en un issue, sin tocar código ni fondos |
| Solución | Action + contrato demo en testnet + tablero público |
| Canales | Integración a `stellar-scaffold/ui`, eventos "upgrade day", tablero público |
| Ingresos | No definido para el MVP |
| Costos | Cómputo de CI (mínimo) + hosting estático (~cero) + tiempo del equipo |
| Métricas | % de repos al día, issues abiertos, repos con la Action instalada |
| Ventaja injusta | Ser primero — sin competidor directo encontrado (Raven, 3-oct-2026) |

## 6. Backlog priorizado (link a GitHub Projects)

**Sin GitHub Projects todavía** — no se crea ningún board/org/repo sin
el OK explícito de Giovanny; este link se agrega aquí en cuanto exista.
Orden de prioridad mientras tanto:

1. Lógica de comparación de versiones (leer manifest → versión vigente real)
2. Apertura/actualización de issue con el diagnóstico
3. Contrato demo en testnet con versión vieja de `soroban-sdk`
4. Cálculo del % para el tablero público (aunque sea con una muestra chica)
5. Página estática del tablero público
6. Distinción multi-contrato dentro de un mismo repo
7. Cita de la fuente exacta (changelog real) dentro del issue
8. Propuesta de PR a `stellar-scaffold/ui` con el workflow preinstalado

## 7. Arquitectura inicial

```
┌─────────────────┐     lee      ┌──────────────────────┐
│ Repo del usuario │ ───────────▶│ Soroready Action      │
│ Cargo.toml /     │              │ (corre en su CI)      │
│ package.json     │              └──────────┬────────────┘
└─────────────────┘                           │ compara contra
                                               ▼
                                   ┌──────────────────────┐
                                   │ Versión vigente       │
                                   │ (release real:        │
                                   │ stellar-core /        │
                                   │ rs-soroban-sdk /       │
                                   │ js-stellar-sdk)        │
                                   └──────────┬────────────┘
                                               │ si hay desfase
                                               ▼
                                   ┌──────────────────────┐
                                   │ Issue en el repo del  │
                                   │ usuario (GitHub API)  │
                                   └──────────┬────────────┘
                                               │ resultado agregado
                                               │ (anónimo, listo/no listo)
                                               ▼
                                   ┌──────────────────────┐
                                   │ Tablero público        │
                                   │ (JSON/página estática) │
                                   └──────────────────────┘
```

Pieza separada, sin conexión al flujo anterior: un contrato demo en
**testnet**, deployado deliberadamente con una versión vieja de
`soroban-sdk`, usado solo para la demostración en vivo del Demo Day.

**Decisiones técnicas abiertas** (a resolver por Mau/Luis, no asumidas
aquí): lenguaje de la Action (TypeScript vs. composite action de shell),
de dónde se lee "la versión vigente" en tiempo real (API de GitHub
releases/crates.io/npm directamente, vs. un feed propio actualizado
periódicamente), y dónde se hostea el tablero (GitHub Pages es el
candidato obvio, sin costo).

## 8. Uso de Stellar y justificación

Soroready es Stellar-específico, no un chequeador de dependencias
genérico, por tres razones verificadas:

1. **El acoplamiento SDK↔protocolo es real y documentado.** Cada versión
   de `rs-soroban-sdk`/`js-stellar-sdk` está atada a una versión de
   protocolo concreta (ej. `rs-soroban-sdk` v28.0.0 "supporting Protocol
   28", `js-stellar-sdk` v17.0.0 "Protocol 28" con el cambio de
   credenciales de CAP-0071) — el desfase no es solo "una versión vieja
   de librería", es un contrato que deja de ser válido en la red.
2. **La cadencia es más rápida de lo asumido.** Verificado con releases
   reales de `stellar-core` (protocolo 25→29 entre enero y octubre de
   2026, cada ~2 meses) — el problema que Soroready ataca ocurre con más
   frecuencia que "una vez por trimestre".
3. **El testnet de Stellar es el lugar correcto para la demo.** El
   contrato demo se despliega en testnet real, no en una red simulada,
   para que el Demo Day muestre el problema ocurriendo en la red que de
   verdad importa — la misma donde corre hoy, según Horizon (4-oct-2026),
   el protocolo 29 vigente.

Soroready no mueve fondos, no custodia llaves y no sostiene ningún riel
fiat — solo lee repos públicos y abre issues; la justificación de uso de
Stellar es puramente de lectura/verificación contra la red real, nunca
de custodia.
