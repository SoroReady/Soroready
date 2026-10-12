import { AlertTriangle, CheckCircle2, CircleSlash, XCircle } from 'lucide-react'
import type { ArchivoEscaneado } from '../lib/types'

const ICONOS = {
  'al-dia': CheckCircle2,
  desfasado: AlertTriangle,
  error: XCircle,
  'sin-dependencia': CircleSlash,
} as const

const COLOR_CLASE = {
  'al-dia': 'text-ok',
  desfasado: 'text-desfasado',
  error: 'text-error',
  'sin-dependencia': 'text-sin-dependencia',
} as const

const ETIQUETA = {
  'al-dia': 'Al día',
  desfasado: 'Desfasado',
  error: 'Error',
  'sin-dependencia': 'No usa el SDK',
} as const

export function FileCard({ archivo }: { archivo: ArchivoEscaneado }) {
  const Icono = ICONOS[archivo.estado]
  const color = COLOR_CLASE[archivo.estado]

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-4 text-left sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <a
          href={archivo.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all font-mono text-sm text-texto underline decoration-borde underline-offset-4 hover:decoration-primario"
        >
          {archivo.ruta}
        </a>
        <p className="mt-1 text-sm text-texto-sec">{archivo.motivo}</p>
      </div>
      <div className={`flex shrink-0 items-center gap-1.5 text-sm font-medium ${color}`}>
        <Icono size={16} aria-hidden="true" />
        <span>{ETIQUETA[archivo.estado]}</span>
      </div>
    </li>
  )
}
