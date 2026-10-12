import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { tema, alternar } = useTheme()
  const esOscuro = tema === 'dark'

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={esOscuro}
      className="flex size-11 items-center justify-center rounded-full border border-borde text-texto-sec transition-colors hover:text-texto"
    >
      {esOscuro ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
