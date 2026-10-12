import { useState } from 'react'
import './App.css'

type Resultado =
  | { estado: 'ok'; versionRepo: string; versionActual: string; releaseUrl: string }
  | { estado: 'desfasado'; versionRepo: string; versionActual: string; releaseUrl: string }
  | { estado: 'error'; mensaje: string }

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

function construirTextoIssue(versionRepo: string, versionActual: string, releaseUrl: string): string {
  return `Título: Actualiza soroban-sdk antes del próximo upgrade de protocolo

Este repo usa soroban-sdk ${versionRepo}. La versión vigente es ${versionActual}.

Revisa el changelog antes de actualizar: ${releaseUrl}

Este issue es informativo. Soroready no modifica tu código ni tus fondos.`
}

function App() {
  const [ownerRepo, setOwnerRepo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [copiado, setCopiado] = useState(false)

  async function revisar() {
    setCopiado(false)
    const partes = ownerRepo.trim().split('/')
    if (partes.length !== 2 || !partes[0] || !partes[1]) {
      setResultado({ estado: 'error', mensaje: 'Escribe el repo como owner/repo, por ejemplo stellar/rs-soroban-sdk.' })
      return
    }
    const [owner, repo] = partes

    setCargando(true)
    setResultado(null)
    try {
      const [cargoResp, releaseResp] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/Cargo.toml`),
        fetch('https://api.github.com/repos/stellar/rs-soroban-sdk/releases/latest'),
      ])

      if (!releaseResp.ok) {
        setResultado({ estado: 'error', mensaje: 'No se pudo consultar la última versión de soroban-sdk en GitHub.' })
        return
      }
      const releaseData = await releaseResp.json()
      const versionActual = limpiarVersion(releaseData.tag_name ?? '')
      const releaseUrl = releaseData.html_url ?? `https://github.com/stellar/rs-soroban-sdk/releases/tag/${releaseData.tag_name}`

      if (!cargoResp.ok) {
        setResultado({ estado: 'error', mensaje: 'No se encontró Cargo.toml en ese repo (o el repo no existe o es privado).' })
        return
      }
      const cargoData = await cargoResp.json()
      const cargoToml = atob(cargoData.content ?? '')
      const versionRepo = extraerVersionSorobanSdk(cargoToml)

      if (!versionRepo) {
        setResultado({ estado: 'error', mensaje: 'Cargo.toml no tiene una dependencia de soroban-sdk reconocible.' })
        return
      }

      const cmp = compararVersiones(versionRepo, versionActual)
      setResultado(
        cmp >= 0
          ? { estado: 'ok', versionRepo, versionActual, releaseUrl }
          : { estado: 'desfasado', versionRepo, versionActual, releaseUrl },
      )
    } catch {
      setResultado({ estado: 'error', mensaje: 'Falló la consulta a la API de GitHub. Intenta de nuevo.' })
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

  const textoIssue =
    resultado && resultado.estado !== 'error'
      ? construirTextoIssue(resultado.versionRepo, resultado.versionActual, resultado.releaseUrl)
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

      {resultado && resultado.estado === 'error' && (
        <p className="mensaje error">{resultado.mensaje}</p>
      )}

      {resultado && resultado.estado !== 'error' && (
        <div className={`mensaje ${resultado.estado === 'ok' ? 'ok' : 'desfasado'}`}>
          <p>
            {resultado.estado === 'ok' ? 'Al día' : 'Desfasado'}: tu repo usa{' '}
            <strong>{resultado.versionRepo}</strong>, la versión vigente es{' '}
            <strong>{resultado.versionActual}</strong>.
          </p>
          <a href={resultado.releaseUrl} target="_blank" rel="noreferrer">
            Ver release
          </a>
        </div>
      )}

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
