import { useCallback, useState } from 'react'
import { escanearRepo, ScanError } from '../lib/github'
import type { EstadoEscaneo } from '../lib/types'

export function useScan() {
  const [estado, setEstado] = useState<EstadoEscaneo>({ tipo: 'inactivo' })

  const escanear = useCallback(async (entrada: string) => {
    setEstado({ tipo: 'cargando', etiqueta: 'Consultando el repositorio…' })
    try {
      const resultado = await escanearRepo(entrada, (etiqueta) => {
        setEstado({ tipo: 'cargando', etiqueta })
      })
      setEstado({ tipo: 'listo', resultado })
    } catch (err) {
      if (err instanceof ScanError) {
        setEstado({ tipo: 'error', codigo: err.codigo, mensaje: err.message })
      } else {
        setEstado({ tipo: 'error', codigo: 'red', mensaje: 'Algo falló revisando ese repo. Intenta de nuevo.' })
      }
    }
  }, [])

  return { estado, escanear }
}
