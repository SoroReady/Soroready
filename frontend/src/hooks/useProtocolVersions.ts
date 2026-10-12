import { useEffect, useState } from 'react'
import { consultarProtocolos } from '../lib/horizon'
import type { ProtocolVersions } from '../lib/types'

export function useProtocolVersions() {
  const [datos, setDatos] = useState<ProtocolVersions | null>(null)

  useEffect(() => {
    let vivo = true
    consultarProtocolos().then((r) => {
      if (vivo) setDatos(r)
    })
    return () => {
      vivo = false
    }
  }, [])

  return datos
}
