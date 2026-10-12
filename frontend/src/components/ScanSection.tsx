import { useMemo, useState } from 'react'
import { RadarIcon } from './RadarIcon'
import { FileCard } from './FileCard'
import { IssuePreview } from './IssuePreview'
import type { EstadoEscaneo } from '../lib/types'

type Filtro = 'todos' | 'desfasado' | 'al-dia'

const MENSAJE_ERROR: Record<string, string> = {
  'formato-invalido': 'Formato inválido',
  'repo-no-encontrado': 'Repo no encontrado',
  'sin-manifiestos': 'Sin manifiestos',
  'limite-agotado': 'Límite de consultas agotado',
  red: 'Error de red',
}

export function ScanSection({ estado }: { estado: EstadoEscaneo }) {
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const archivos = estado.tipo === 'listo' ? estado.resultado.archivos : []
  const relevantes = useMemo(() => archivos.filter((a) => a.estado === 'al-dia' || a.estado === 'desfasado'), [archivos])
  const alDia = relevantes.filter((a) => a.estado === 'al-dia').length

  const filtrados = useMemo(() => {
    if (filtro === 'todos') return archivos
    return archivos.filter((a) => a.estado === filtro)
  }, [archivos, filtro])

  if (estado.tipo === 'inactivo') return null

  return (
    <section id="resultado" aria-live="polite" className="mx-auto w-full max-w-3xl scroll-mt-8 px-4 py-10 sm:px-6">
      {estado.tipo === 'cargando' && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-borde bg-superficie p-10 text-center">
          <RadarIcon size={48} animado />
          <p className="text-sm text-texto-sec">{estado.etiqueta}</p>
        </div>
      )}

      {estado.tipo === 'error' && (
        <div className="rounded-xl border border-error/40 bg-superficie p-6 text-center">
          <p className="font-semibold text-error">{MENSAJE_ERROR[estado.codigo]}</p>
          <p className="mt-1 text-sm text-texto-sec">{estado.mensaje}</p>
        </div>
      )}

      {estado.tipo === 'listo' && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-borde bg-superficie p-6 text-center">
            <p className="font-heading text-2xl font-semibold text-texto">
              {relevantes.length > 0
                ? `${alDia} de ${relevantes.length} contratos al día`
                : 'Ningún archivo declara soroban-sdk o @stellar/stellar-sdk'}
            </p>
            {estado.resultado.releaseSoroban && (
              <p className="mt-2 text-sm text-texto-sec">
                soroban-sdk vigente: <strong className="font-mono text-texto">{estado.resultado.releaseSoroban.version}</strong>
                {estado.resultado.releaseSoroban.publishedAt && (
                  <> · publicado el {new Date(estado.resultado.releaseSoroban.publishedAt).toLocaleDateString('es-MX')}</>
                )}{' '}
                ·{' '}
                <a href={estado.resultado.releaseSoroban.url} target="_blank" rel="noreferrer" className="text-primario-texto underline">
                  notas del release
                </a>
              </p>
            )}
            {estado.resultado.rateLimit && (
              <p className="mt-3 text-xs text-texto-sec">
                Consultas restantes a la API de GitHub: {estado.resultado.rateLimit.remaining}/{estado.resultado.rateLimit.limit}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-2" role="group" aria-label="Filtrar resultados">
            {(['todos', 'desfasado', 'al-dia'] as const).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setFiltro(opcion)}
                aria-pressed={filtro === opcion}
                className={`flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${
                  filtro === opcion
                    ? 'border-primario bg-primario text-sobre-primario'
                    : 'border-borde text-texto-sec hover:text-texto'
                }`}
              >
                {opcion === 'todos' ? 'Todos' : opcion === 'desfasado' ? 'Desfasados' : 'Al día'}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-3">
            {filtrados.map((archivo) => (
              <FileCard key={archivo.ruta} archivo={archivo} />
            ))}
          </ul>

          <IssuePreview resultado={estado.resultado} />
        </div>
      )}
    </section>
  )
}
