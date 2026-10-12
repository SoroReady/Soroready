import { ActionComingSoon } from './components/ActionComingSoon'
import { EcosystemBoard } from './components/EcosystemBoard'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ProtocolBanner } from './components/ProtocolBanner'
import { ScanSection } from './components/ScanSection'
import { ThemeToggle } from './components/ThemeToggle'
import { useScan } from './hooks/useScan'

function App() {
  const { estado, escanear } = useScan()

  return (
    <div className="min-h-svh bg-fondo text-texto">
      <a
        href="#resultado"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primario focus:px-4 focus:py-2 focus:text-sobre-primario"
      >
        Saltar al resultado
      </a>
      <ProtocolBanner />
      <div className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <main>
        <Hero onEscanear={escanear} cargando={estado.tipo === 'cargando'} />
        <ScanSection estado={estado} />
        <HowItWorks />
        <EcosystemBoard />
        <ActionComingSoon />
      </main>

      <Footer />
    </div>
  )
}

export default App
