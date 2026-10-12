import type { ProtocolVersions } from './types'

async function obtenerProtocolo(url: string): Promise<number | null> {
  try {
    const r = await fetch(url)
    if (!r.ok) return null
    const data = await r.json()
    return typeof data.current_protocol_version === 'number' ? data.current_protocol_version : null
  } catch {
    return null
  }
}

export async function consultarProtocolos(): Promise<ProtocolVersions> {
  const [mainnet, testnet] = await Promise.all([
    obtenerProtocolo('https://horizon.stellar.org/'),
    obtenerProtocolo('https://horizon-testnet.stellar.org/'),
  ])

  return {
    mainnet,
    testnet,
    consultadoEn: new Date().toISOString(),
    error: mainnet === null && testnet === null,
  }
}
