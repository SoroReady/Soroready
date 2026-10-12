import { Check, Copy, ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { construirIssue, urlAbrirIssue } from '../lib/issue'
import type { ResultadoEscaneo } from '../lib/types'

export function IssuePreview({ resultado }: { resultado: ResultadoEscaneo }) {
  const [pestana, setPestana] = useState<'vista' | 'markdown'>('vista')
  const [copiado, setCopiado] = useState(false)

  const issue = useMemo(() => construirIssue(resultado), [resultado])
  const desfasados = resultado.archivos.filter((a) => a.estado === 'desfasado')

  async function copiar() {
    try {
      await navigator.clipboard.writeText(issue.markdown)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="rounded-xl border border-borde bg-superficie p-6">
      <p className="text-xs text-texto-sec">
        Así se vería el issue. La Action todavía está en construcción.
      </p>
      <h3 className="mt-1 font-heading text-lg font-semibold text-texto">{issue.titulo}</h3>

      <div className="mt-4 flex gap-1 border-b border-borde" role="tablist" aria-label="Formato del issue">
        {(['vista', 'markdown'] as const).map((opcion) => (
          <button
            key={opcion}
            type="button"
            role="tab"
            aria-selected={pestana === opcion}
            onClick={() => setPestana(opcion)}
            className={`min-h-11 px-3 text-sm capitalize ${
              pestana === opcion ? 'border-b-2 border-primario text-texto' : 'text-texto-sec'
            }`}
          >
            {opcion === 'vista' ? 'Vista' : 'Markdown'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {pestana === 'vista' ? (
          <div className="text-left text-sm text-texto">
            <p className="text-texto-sec">
              <code className="font-mono text-texto">
                {resultado.owner}/{resultado.repo}
              </code>{' '}
              tiene <strong>{desfasados.length}</strong> de <strong>{resultado.archivos.length}</strong> archivos
              desfasados frente a la última versión publicada por Stellar.
            </p>
            {desfasados.length > 0 && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-borde text-texto-sec">
                      <th className="py-1.5 pr-2 text-left font-medium">Archivo</th>
                      <th className="py-1.5 pr-2 text-left font-medium">Encontrada</th>
                      <th className="py-1.5 text-left font-medium">Vigente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desfasados.map((a) => (
                      <tr key={a.ruta} className="border-b border-borde/60">
                        <td className="py-1.5 pr-2 font-mono">{a.ruta}</td>
                        <td className="py-1.5 pr-2 font-mono">{a.versionEncontrada}</td>
                        <td className="py-1.5 font-mono">{a.versionVigente}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-xs text-texto-sec">
              Generado por Soroready. Solo un aviso: no cambia tu código ni tus fondos.
            </p>
          </div>
        ) : (
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-elevada p-4 font-mono text-xs text-texto">
            {issue.markdown}
          </pre>
        )}
        {issue.recortado && (
          <p className="mt-2 text-xs text-desfasado">
            El texto pasaba de ~7,000 caracteres y se recortó para que quepa en un issue de GitHub.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiar}
          className="flex min-h-11 items-center gap-1.5 rounded-lg border border-borde px-4 text-sm text-texto transition-colors hover:border-primario"
        >
          {copiado ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copiado ? 'Copiado' : 'Copiar'}
        </button>
        <a
          href={urlAbrirIssue(resultado.owner, resultado.repo, issue)}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center gap-1.5 rounded-lg bg-primario px-4 text-sm font-semibold text-sobre-primario"
        >
          <ExternalLink size={14} aria-hidden="true" />
          Abrir issue en GitHub
        </a>
      </div>
    </div>
  )
}
