const TOTAL = 5708
const AL_DIA = 106
const DESFASADO = 1282
const RESTO = TOTAL - AL_DIA - DESFASADO

const SEGMENTOS = [
  { etiqueta: 'Al día', valor: AL_DIA, clase: 'bg-ok' },
  { etiqueta: 'Desfasado', valor: DESFASADO, clase: 'bg-desfasado' },
  { etiqueta: 'Sin soroban-sdk o sin dato', valor: RESTO, clase: 'bg-borde' },
]

export function EcosystemBoard() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center font-heading text-2xl font-semibold text-texto sm:text-3xl">
        Tablero del ecosistema
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-texto-sec">
        Qué tan listos están los repos de Stellar para el próximo protocolo, a nivel ecosistema.
      </p>

      <div className="mt-8 rounded-xl border border-borde bg-superficie p-6">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-elevada" role="img" aria-label={`${AL_DIA} de ${TOTAL} repos al día, ${DESFASADO} desfasados`}>
          {SEGMENTOS.map((s) => (
            <div key={s.etiqueta} className={s.clase} style={{ width: `${(s.valor / TOTAL) * 100}%` }} />
          ))}
        </div>

        <ul className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
          {SEGMENTOS.map((s) => (
            <li key={s.etiqueta} className="flex items-center gap-2 text-texto-sec">
              <span className={`size-2.5 shrink-0 rounded-full ${s.clase}`} aria-hidden="true" />
              {s.etiqueta}: <strong className="font-mono text-texto">{s.valor.toLocaleString('es-MX')}</strong>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-xs text-texto-sec">
          Dato de Raven del 3-oct-2026, sobre {TOTAL.toLocaleString('es-MX')} repos indexados de Stellar. No es un
          dato en vivo.
        </p>
      </div>
    </section>
  )
}
