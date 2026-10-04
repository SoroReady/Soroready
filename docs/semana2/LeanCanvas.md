# Lean Canvas — Soroready

**v1 · 4-oct-2026 · Semana 2, Blockchain Builders 101**

Revisado y aprobado por el equipo (Mau y Luis), 4-oct-2026.

| Bloque | Contenido |
| --- | --- |
| **Problema** | Los repos de Stellar no se enteran de que un upgrade de protocolo trimestral (en la práctica, cada ~2 meses en 2026) les va a romper algo hasta que ya se rompió. 1,282 de 5,708 repos indexados usan un `soroban-sdk` ya obsoleto; solo 106 están al día (Raven, 3-oct-2026). |
| **Segmentos de cliente** | Equipos con un repo activo de Stellar/Soroban — desde proyectos de hackathon/bootcamp que no vuelven a tocar el código hasta equipos en producción sin alguien dedicado a monitorear releases de SDK. Early adopters: equipos que arrancan con Scaffold Stellar. |
| **Propuesta de valor única** | Un radar, no un parche: lee tu repo, te dice exactamente qué versión de SDK tienes, qué protocolo viene y qué se rompe — antes de la fecha límite, en un issue, sin tocar tu código ni tus fondos. |
| **Solución** | (1) GitHub Action que compara `Cargo.toml`/`package.json` contra las versiones vigentes y abre un issue con el diagnóstico. (2) Contrato demo en testnet mostrando el problema real. (3) Tablero público de % de repos listos. Solo issues en esta fase — sin PRs automáticos. |
| **Canales** | Preinstalado en el kit de arranque oficial (propuesta de integración a `stellar-scaffold/ui`, el repo de template de Scaffold Stellar). Eventos recurrentes "upgrade day" por trimestre. Tablero público como evidencia de tracción compartible. |
| **Fuentes de ingreso** | No definido en el MVP del bootcamp — fuera de alcance para el Demo Day. A explorar después: freemium (issues gratis, reporte/dashboard de equipo de pago), o patrocinio de un "upgrade day". |
| **Estructura de costos** | Cómputo de la Action (mínimo, corre en CI del usuario), hosting del tablero público (estático, costo ~cero), tiempo del equipo. Sin costos de custodia ni de infraestructura on-chain propia — Soroready nunca sostiene fondos. |
| **Métricas clave** | % de repos de Stellar medidos que están en la versión vigente de `soroban-sdk`/`stellar-sdk` (hoy: 106/5,708 ≈ 1.9%). Issues abiertos por la Action. Repos que instalan la Action. Adopción dentro de Scaffold Stellar si la integración se acepta. |
| **Ventaja injusta** | Ninguna identificada todavía más allá de ser primero — no se encontró un competidor directo (Raven, 3-oct-2026). La ventaja real, si se construye, sería estar dentro del kit de arranque oficial antes de que alguien más lo intente. |

## Riesgos abiertos (marcados, no resueltos)

- **Inscripción del equipo**: pendiente confirmar con Fer (BAF) si Mau y
  Luis están inscritos — el registro cerró el 19-sep-2026.
- **Fecha del próximo protocolo**: no hay señal oficial pública
  verificada (Raven, 4-oct-2026) — no prometer una fecha en el pitch.
- **Aceptación de la integración a Scaffold Stellar**: no verificada
  todavía con nadie del lado de `stellar-scaffold/ui` — es una propuesta,
  no un acuerdo.
