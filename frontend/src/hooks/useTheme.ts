import { useCallback, useEffect, useState } from 'react'

type Tema = 'dark' | 'light'
const CLAVE = 'soroready:tema'

function temaInicial(): Tema {
  const actual = document.documentElement.getAttribute('data-theme')
  return actual === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
  }, [tema])

  const alternar = useCallback(() => {
    setTema((actual) => {
      const siguiente = actual === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(CLAVE, siguiente)
      } catch {
        // localStorage puede fallar; el tema sigue funcionando solo en memoria.
      }
      return siguiente
    })
  }, [])

  return { tema, alternar }
}
