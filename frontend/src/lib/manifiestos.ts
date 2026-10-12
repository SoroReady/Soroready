interface DependenciaCargo {
  tipo: 'version' | 'workspace' | 'ninguna'
  version: string | null
}

function extraerTablaDependencia(toml: string, nombre: string): string | null {
  const re = new RegExp(`${nombre}\\s*=\\s*\\{([^}]*)\\}`)
  const match = toml.match(re)
  return match ? match[1] : null
}

export function extraerDependenciaCargo(toml: string, nombre = 'soroban-sdk'): DependenciaCargo {
  const comilla = toml.match(new RegExp(`${nombre}\\s*=\\s*"([^"]+)"`))
  if (comilla) return { tipo: 'version', version: comilla[1] }

  const tabla = extraerTablaDependencia(toml, nombre)
  if (tabla) {
    if (/workspace\s*=\s*true/.test(tabla)) return { tipo: 'workspace', version: null }
    const version = tabla.match(/version\s*=\s*"([^"]+)"/)
    if (version) return { tipo: 'version', version: version[1] }
  }

  return { tipo: 'ninguna', version: null }
}

export function extraerVersionWorkspace(tomlRaiz: string, nombre = 'soroban-sdk'): string | null {
  const seccion = tomlRaiz.match(/\[workspace\.dependencies\]([\s\S]*?)(?:\n\[|$)/)
  if (!seccion) return null
  const dep = extraerDependenciaCargo(seccion[1], nombre)
  return dep.tipo === 'version' ? dep.version : null
}

export function extraerVersionPackageJson(contenido: string, nombres: string[]): string | null {
  try {
    const data = JSON.parse(contenido) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    for (const nombre of nombres) {
      const version = data.dependencies?.[nombre] ?? data.devDependencies?.[nombre]
      if (version) return version.replace(/^[^\d]*/, '')
    }
    return null
  } catch {
    return null
  }
}
