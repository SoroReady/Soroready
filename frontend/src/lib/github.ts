import { extraerDependenciaCargo, extraerVersionPackageJson, extraerVersionWorkspace } from './manifiestos'
import type { ArchivoEscaneado, RateLimitInfo, ReleaseInfo, ResultadoEscaneo } from './types'
import { compararVersiones, limpiarVersion } from './versiones'

const API = 'https://api.github.com'
const CACHE_MS = 10 * 60 * 1000
const IGNORAR = ['node_modules/', 'target/', 'vendor/']
const MAX_CARGO = 20
const MAX_PACKAGE = 10

export class ScanError extends Error {
  codigo: 'formato-invalido' | 'repo-no-encontrado' | 'sin-manifiestos' | 'limite-agotado' | 'red'
  constructor(codigo: ScanError['codigo'], mensaje: string) {
    super(mensaje)
    this.codigo = codigo
  }
}

interface TreeItem {
  path: string
  type: string
}

function rateLimitDesdeRespuesta(r: Response): RateLimitInfo {
  return {
    remaining: Number(r.headers.get('x-ratelimit-remaining') ?? '0'),
    limit: Number(r.headers.get('x-ratelimit-limit') ?? '60'),
    resetAt: Number(r.headers.get('x-ratelimit-reset') ?? '0') * 1000,
  }
}

function esRutaIgnorada(ruta: string): boolean {
  return IGNORAR.some((prefijo) => ruta.includes(`/${prefijo}`) || ruta.startsWith(prefijo))
}

async function obtenerRelease(repo: string): Promise<ReleaseInfo | null> {
  const r = await fetch(`${API}/repos/${repo}/releases/latest`)
  if (!r.ok) return null
  const data = await r.json()
  return {
    version: limpiarVersion(data.tag_name ?? ''),
    publishedAt: data.published_at ?? null,
    url: data.html_url ?? `https://github.com/${repo}/releases/tag/${data.tag_name}`,
    body: data.body ?? '',
  }
}

async function obtenerContenido(owner: string, repo: string, ruta: string): Promise<string | null> {
  const r = await fetch(`${API}/repos/${owner}/${repo}/contents/${ruta}`)
  if (!r.ok) return null
  const data = await r.json()
  try {
    return atob((data.content ?? '').replace(/\n/g, ''))
  } catch {
    return null
  }
}

function claveCache(owner: string, repo: string): string {
  return `soroready:scan:${owner}/${repo}`.toLowerCase()
}

function leerCache(owner: string, repo: string): ResultadoEscaneo | null {
  try {
    const crudo = sessionStorage.getItem(claveCache(owner, repo))
    if (!crudo) return null
    const { timestamp, data } = JSON.parse(crudo) as { timestamp: number; data: ResultadoEscaneo }
    if (Date.now() - timestamp > CACHE_MS) return null
    return data
  } catch {
    return null
  }
}

function guardarCache(owner: string, repo: string, data: ResultadoEscaneo): void {
  try {
    sessionStorage.setItem(claveCache(owner, repo), JSON.stringify({ timestamp: Date.now(), data }))
  } catch {
    // sessionStorage puede fallar (modo privado, cuota); no es crítico.
  }
}

export function parsearOwnerRepo(entrada: string): { owner: string; repo: string } {
  let texto = entrada.trim()
  texto = texto.replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/, '').replace(/\/$/, '')
  const partes = texto.split('/')
  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    throw new ScanError('formato-invalido', 'Escribe el repo como owner/repo o pega la URL de GitHub.')
  }
  return { owner: partes[0], repo: partes[1] }
}

export async function escanearRepo(
  entrada: string,
  onProgreso?: (etiqueta: string) => void,
): Promise<ResultadoEscaneo> {
  const { owner, repo } = parsearOwnerRepo(entrada)

  const enCache = leerCache(owner, repo)
  if (enCache) return enCache

  onProgreso?.('Consultando el repositorio…')

  let repoResp: Response
  try {
    repoResp = await fetch(`${API}/repos/${owner}/${repo}`)
  } catch {
    throw new ScanError('red', 'Falló la conexión con la API de GitHub. Revisa tu red e intenta de nuevo.')
  }

  const rateLimit = rateLimitDesdeRespuesta(repoResp)

  if (!repoResp.ok) {
    if (repoResp.status === 403 && rateLimit.remaining === 0) {
      const minutos = Math.max(0, Math.ceil((rateLimit.resetAt - Date.now()) / 60000))
      throw new ScanError(
        'limite-agotado',
        `Se agotaron las consultas a la API de GitHub sin autenticación. Se liberan en ~${minutos} min.`,
      )
    }
    throw new ScanError('repo-no-encontrado', 'No se encontró ese repo en GitHub (o es privado).')
  }

  const repoData = await repoResp.json()
  const defaultBranch: string = repoData.default_branch

  onProgreso?.('Leyendo el árbol de archivos…')
  let treeResp: Response
  try {
    treeResp = await fetch(`${API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`)
  } catch {
    throw new ScanError('red', 'Falló la conexión con la API de GitHub. Revisa tu red e intenta de nuevo.')
  }
  if (!treeResp.ok) {
    throw new ScanError('red', 'No se pudo leer la lista de archivos del repo.')
  }
  const treeData = await treeResp.json()
  const items: TreeItem[] = treeData.tree ?? []

  const rutasCargo = items
    .filter((i) => i.type === 'blob' && (i.path === 'Cargo.toml' || i.path.endsWith('/Cargo.toml')))
    .filter((i) => !esRutaIgnorada(i.path))
    .slice(0, MAX_CARGO)
    .map((i) => i.path)

  const rutasPackage = items
    .filter((i) => i.type === 'blob' && (i.path === 'package.json' || i.path.endsWith('/package.json')))
    .filter((i) => !esRutaIgnorada(i.path))
    .slice(0, MAX_PACKAGE)
    .map((i) => i.path)

  if (rutasCargo.length === 0 && rutasPackage.length === 0) {
    throw new ScanError('sin-manifiestos', 'No se encontró ningún Cargo.toml ni package.json en este repo.')
  }

  onProgreso?.('Comparando versiones…')
  const [releaseSoroban, releaseStellarSdk] = await Promise.all([
    obtenerRelease('stellar/rs-soroban-sdk'),
    obtenerRelease('stellar/js-stellar-sdk'),
  ])

  let tomlRaiz: string | null = null
  if (rutasCargo.includes('Cargo.toml')) {
    tomlRaiz = await obtenerContenido(owner, repo, 'Cargo.toml')
  }

  const githubUrl = (ruta: string) => `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${ruta}`

  const archivosCargo: ArchivoEscaneado[] = await Promise.all(
    rutasCargo.map(async (ruta): Promise<ArchivoEscaneado> => {
      const contenido = ruta === 'Cargo.toml' ? tomlRaiz : await obtenerContenido(owner, repo, ruta)
      if (contenido === null) {
        return {
          ruta,
          tipo: 'cargo',
          paquete: 'soroban-sdk',
          estado: 'error',
          versionEncontrada: null,
          versionVigente: releaseSoroban?.version ?? null,
          motivo: 'No se pudo leer este archivo.',
          githubUrl: githubUrl(ruta),
        }
      }

      const dep = extraerDependenciaCargo(contenido, 'soroban-sdk')
      let version = dep.version
      if (dep.tipo === 'workspace') {
        version = tomlRaiz ? extraerVersionWorkspace(tomlRaiz, 'soroban-sdk') : null
      }

      if (!version || !releaseSoroban) {
        return {
          ruta,
          tipo: 'cargo',
          paquete: 'soroban-sdk',
          estado: 'sin-dependencia',
          versionEncontrada: null,
          versionVigente: releaseSoroban?.version ?? null,
          motivo: 'Este Cargo.toml no declara soroban-sdk.',
          githubUrl: githubUrl(ruta),
        }
      }

      const cmp = compararVersiones(version, releaseSoroban.version)
      return {
        ruta,
        tipo: 'cargo',
        paquete: 'soroban-sdk',
        estado: cmp >= 0 ? 'al-dia' : 'desfasado',
        versionEncontrada: version,
        versionVigente: releaseSoroban.version,
        motivo:
          cmp >= 0
            ? `Usa soroban-sdk ${version}, al día con la última versión publicada.`
            : `Usa soroban-sdk ${version}; la versión vigente es ${releaseSoroban.version}.`,
        githubUrl: githubUrl(ruta),
      }
    }),
  )

  const archivosPackage: ArchivoEscaneado[] = await Promise.all(
    rutasPackage.map(async (ruta): Promise<ArchivoEscaneado> => {
      const contenido = await obtenerContenido(owner, repo, ruta)
      if (contenido === null) {
        return {
          ruta,
          tipo: 'package',
          paquete: '@stellar/stellar-sdk',
          estado: 'error',
          versionEncontrada: null,
          versionVigente: releaseStellarSdk?.version ?? null,
          motivo: 'No se pudo leer este archivo.',
          githubUrl: githubUrl(ruta),
        }
      }

      const version = extraerVersionPackageJson(contenido, ['@stellar/stellar-sdk', 'stellar-sdk'])
      if (!version || !releaseStellarSdk) {
        return {
          ruta,
          tipo: 'package',
          paquete: '@stellar/stellar-sdk',
          estado: 'sin-dependencia',
          versionEncontrada: null,
          versionVigente: releaseStellarSdk?.version ?? null,
          motivo: 'Este package.json no declara @stellar/stellar-sdk ni stellar-sdk.',
          githubUrl: githubUrl(ruta),
        }
      }

      const cmp = compararVersiones(version, releaseStellarSdk.version)
      return {
        ruta,
        tipo: 'package',
        paquete: '@stellar/stellar-sdk',
        estado: cmp >= 0 ? 'al-dia' : 'desfasado',
        versionEncontrada: version,
        versionVigente: releaseStellarSdk.version,
        motivo:
          cmp >= 0
            ? `Usa @stellar/stellar-sdk ${version}, al día con la última versión publicada.`
            : `Usa @stellar/stellar-sdk ${version}; la versión vigente es ${releaseStellarSdk.version}.`,
        githubUrl: githubUrl(ruta),
      }
    }),
  )

  const resultado: ResultadoEscaneo = {
    owner,
    repo,
    defaultBranch,
    archivos: [...archivosCargo, ...archivosPackage],
    releaseSoroban,
    releaseStellarSdk,
    rateLimit,
    consultadoEn: new Date().toISOString(),
  }

  guardarCache(owner, repo, resultado)
  return resultado
}
