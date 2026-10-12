import { useProtocolVersions } from '../hooks/useProtocolVersions'

export function ProtocolBanner() {
  const protocolos = useProtocolVersions()

  if (!protocolos) {
    return (
      <div className="border-b border-borde bg-superficie/60 px-4 py-2 text-center text-xs text-texto-sec">
        Consultando protocolo vigente en Horizon…
      </div>
    )
  }

  if (protocolos.error) {
    return (
      <div className="border-b border-borde bg-superficie/60 px-4 py-2 text-center text-xs text-texto-sec">
        No se pudo consultar Horizon en este momento.
      </div>
    )
  }

  const hora = new Date(protocolos.consultadoEn).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="border-b border-borde bg-superficie/60 px-4 py-2 text-center font-mono text-xs text-texto-sec">
      Mainnet: protocolo {protocolos.mainnet ?? '—'} · Testnet: protocolo {protocolos.testnet ?? '—'}
      <span className="hidden sm:inline"> · consultado en Horizon a las {hora}</span>
    </div>
  )
}
