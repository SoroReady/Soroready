export type EstadoArchivo = 'al-dia' | 'desfasado' | 'sin-dependencia' | 'error'

export interface ArchivoEscaneado {
  ruta: string
  tipo: 'cargo' | 'package'
  paquete: string
  estado: EstadoArchivo
  versionEncontrada: string | null
  versionVigente: string | null
  motivo: string
  githubUrl: string
}

export interface ReleaseInfo {
  version: string
  publishedAt: string | null
  url: string
  body: string
}

export interface RateLimitInfo {
  remaining: number
  limit: number
  resetAt: number
}

export interface ResultadoEscaneo {
  owner: string
  repo: string
  defaultBranch: string
  archivos: ArchivoEscaneado[]
  releaseSoroban: ReleaseInfo | null
  releaseStellarSdk: ReleaseInfo | null
  rateLimit: RateLimitInfo | null
  consultadoEn: string
}

export type EstadoEscaneo =
  | { tipo: 'inactivo' }
  | { tipo: 'cargando'; etiqueta: string }
  | { tipo: 'listo'; resultado: ResultadoEscaneo }
  | { tipo: 'error'; codigo: ErrorEscaneo; mensaje: string }

export type ErrorEscaneo =
  | 'formato-invalido'
  | 'repo-no-encontrado'
  | 'sin-manifiestos'
  | 'limite-agotado'
  | 'red'

export interface ProtocolVersions {
  mainnet: number | null
  testnet: number | null
  consultadoEn: string
  error: boolean
}
