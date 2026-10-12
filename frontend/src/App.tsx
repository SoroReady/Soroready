import { useState } from 'react'
import './App.css'

type ResultadoArchivo =
  | { estado: 'ok'; ruta: string; versionRepo: string; versionActual: string; releaseUrl: string }
  | { estado: 'desfasado'; ruta: string; versionRepo: string; versionActual: string; releaseUrl: string }
  | { estado: 'sin-dependencia'; ruta: string }

function limpiarVersion(v: string): string {
  return v.trim().replace(/^v/i, '')
}

function compararVersiones(a: string, b: string): number {
  const pa = limpiarVersion(a).split('.').map((n) => parseInt(n, 10) || 0)
  const pb = limpiarVersion(b).split('.').map((n) => parseInt(n, 10) || 0)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i++) {
    const na = pa[i] ?? 0
    const nb = pb[i] ?? 0
    if (na !== nb) return na - nb
  }
  return 0
}

function extraerVersionSorobanSdk(cargoToml: string): string | null {
  const match = cargoToml.match(
    /soroban-sdk\s*=\s*(?:"([^"]+)"|\{[^}]*version\s*=\s*"([^"]+)")/,
  )
  if (!match) return null
  return match[1] ?? match[2] ?? null
}

function construirTextoIssue(ruta: string, versionRepo: string, versionActual: string, releaseUrl: string): string {
  return `Título: Actualiza soroban-sdk antes del próximo upgrade de protocolo

${ruta} usa soroban-sdk ${versionRepo}. La versión vigente es ${versionActual}.

Revisa el changelog antes de actualizar: ${releaseUrl}

Este issue es informativo. Soroready no modifica tu código ni tus fondos.`
}

function App() {
  const [ownerRepo, setOwnerRepo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)
  const [resultados, setResultados] = useState<ResultadoArchivo[]>([])
  const [copiado, setCopiado] = useState(false)

  async function revisar() {
    setCopiado(false)
    setErrorGlobal(null)
    setResultados([])

    const partes = ownerRepo.trim().split('/')
    if (partes.length !== 2 || !partes[0] || !partes[1]) {
      setErrorGlobal('Escribe el repo como owner/repo, por ejemplo stellar/rs-soroban-sdk.')
      return
    }
    const [owner, repo] = partes

    setCargando(true)
    try {
      const [repoResp, releaseResp] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`),
        fetch('https://api.github.com/repos/stellar/rs-soroban-sdk/releases/latest'),
      ])

      if (!repoResp.ok) {
        setErrorGlobal('No se encontró ese repo en GitHub (o es privado).')
        return
      }
      if (!releaseResp.ok) {
        setErrorGlobal('No se pudo consultar la última versión de soroban-sdk en GitHub.')
        return
      }

      const repoData = await repoResp.json()
      const releaseData = await releaseResp.json()
      const versionActual = limpiarVersion(releaseData.tag_name ?? '')
      const releaseUrl =
        releaseData.html_url ?? `https://github.com/stellar/rs-soroban-sdk/releases/tag/${releaseData.tag_name}`
      const rama = repoData.default_branch

      const treeResp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${rama}?recursive=1`,
      )
      if (!treeResp.ok) {
        setErrorGlobal('No se pudo leer la lista de archivos del repo.')
        return
      }
      const treeData = await treeResp.json()
      const rutas: string[] = (treeData.tree ?? [])
        .filter(
          (item: { type: string; path: string }) =>
            item.type === 'blob' && (item.path === 'Cargo.toml' || item.path.endsWith('/Cargo.toml')),
        )
        .slice(0, 10)
        .map((item: { path: string }) => item.path)

      if (rutas.length === 0) {
        setErrorGlobal('No se encontró ningún Cargo.toml en este repo.')
        return
      }

      const contenidos = await Promise.all(
        rutas.map((ruta) =>
          fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ruta}`).then((r) =>
            r.ok ? r.json() : null,
          ),
        ),
      )

      const nuevos: ResultadoArchivo[] = rutas.map((ruta, i) => {
        const data = contenidos[i]
        const cargoToml = data ? atob(data.content ?? '') : ''
        const versionRepo = data ? extraerVersionSorobanSdk(cargoToml) : null

        if (!versionRepo) {
          return { estado: 'sin-dependencia', ruta }
        }
        const cmp = compararVersiones(versionRepo, versionActual)
        return cmp >= 0
          ? { estado: 'ok', ruta, versionRepo, versionActual, releaseUrl }
          : { estado: 'desfasado', ruta, versionRepo, versionActual, releaseUrl }
      })

      setResultados(nuevos)
    } catch {
      setErrorGlobal('Falló la consulta a la API de GitHub. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  async function copiarIssue(texto: string) {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  const primerDesfasado = resultados.find((r) => r.estado === 'desfasado')
  const textoIssue = primerDesfasado
    ? construirTextoIssue(
        primerDesfasado.ruta,
        primerDesfasado.versionRepo,
        primerDesfasado.versionActual,
        primerDesfasado.releaseUrl,
      )
    : null

  return (
    <main className="page">
      <h1>Soroready</h1>
      <p className="subtitulo">
        Revisa si tu repo de Stellar está listo para el próximo upgrade de protocolo. Solo avisa:
        nunca toca tu código ni tus fondos.
      </p>

      <form
        className="formulario"
        onSubmit={(e) => {
          e.preventDefault()
          void revisar()
        }}
      >
        <input
          type="text"
          placeholder="owner/repo"
          value={ownerRepo}
          onChange={(e) => setOwnerRepo(e.target.value)}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Revisando…' : 'Revisar'}
        </button>
      </form>

      {errorGlobal && <p className="mensaje error">{errorGlobal}</p>}

      {resultados.map((r) => (
        <div
          key={r.ruta}
          className={`mensaje ${r.estado === 'ok' ? 'ok' : r.estado === 'desfasado' ? 'desfasado' : 'error'}`}
        >
          <p className="ruta-archivo">{r.ruta}</p>
          {r.estado === 'sin-dependencia' ? (
            <p>Este Cargo.toml no declara soroban-sdk.</p>
          ) : (
            <>
              <p>
                {r.estado === 'ok' ? 'Al día' : 'Desfasado'}: usa{' '}
                <strong>{r.versionRepo}</strong>, la versión vigente es{' '}
                <strong>{r.versionActual}</strong>.
              </p>
              <a href={r.releaseUrl} target="_blank" rel="noreferrer">
                Ver release
              </a>
            </>
          )}
        </div>
      ))}

      {textoIssue && (
        <section className="issue-preview">
          <p className="etiqueta">Así se vería el issue. La Action todavía está en construcción.</p>
          <pre>{textoIssue}</pre>
          <button type="button" onClick={() => void copiarIssue(textoIssue)}>
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </section>
      )}
    </main>
  )
}

export default App
