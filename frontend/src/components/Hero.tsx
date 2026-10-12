import { motion } from 'motion/react'
import { Lock, RefreshCcw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { RadarIcon } from './RadarIcon'

const EJEMPLOS = ['stellar/soroban-examples', 'stellar/rs-soroban-sdk', 'stellar/soroban-example-dapp']

interface HeroProps {
  onEscanear: (entrada: string) => void
  cargando: boolean
}

export function Hero({ onEscanear, cargando }: HeroProps) {
  const [valor, setValor] = useState('')

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (valor.trim()) onEscanear(valor.trim())
  }

  return (
    <section className="flex min-h-[90svh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <RadarIcon size={96} animado />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 font-heading text-4xl font-semibold tracking-tight text-texto sm:text-5xl md:text-6xl"
      >
        soroready
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-4 max-w-xl text-balance text-base text-texto-sec sm:text-lg"
      >
        Un radar para repos de Stellar. Escanea tu manifiesto, compáralo con la última versión y avisa qué se va a
        romper antes del próximo upgrade de protocolo.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26 }}
        onSubmit={enviar}
        className="mt-8 flex w-full max-w-lg flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="owner-repo" className="sr-only">
          owner/repo o URL de GitHub
        </label>
        <input
          id="owner-repo"
          type="text"
          placeholder="owner/repo o URL de GitHub"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="h-12 flex-1 rounded-lg border border-borde bg-superficie px-4 font-mono text-sm text-texto outline-none placeholder:text-texto-sec focus-visible:border-primario"
        />
        <button
          type="submit"
          disabled={cargando || !valor.trim()}
          className="h-12 shrink-0 rounded-lg bg-primario px-6 font-semibold text-sobre-primario transition-opacity disabled:opacity-50"
        >
          {cargando ? 'Escaneando…' : 'Escanear'}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.34 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-texto-sec"
      >
        <span>Probar con:</span>
        {EJEMPLOS.map((ej) => (
          <button
            key={ej}
            type="button"
            onClick={() => {
              setValor(ej)
              onEscanear(ej)
            }}
            disabled={cargando}
            className="flex min-h-11 items-center rounded-full border border-borde px-3 font-mono transition-colors hover:border-primario hover:text-primario-texto disabled:opacity-50"
          >
            {ej}
          </button>
        ))}
      </motion.div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="mt-10 flex flex-col gap-3 text-sm text-texto-sec sm:flex-row sm:gap-8"
      >
        <li className="flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-primario-texto" aria-hidden="true" />
          Solo avisa, nunca toca tu código
        </li>
        <li className="flex items-center justify-center gap-2">
          <RefreshCcw size={16} className="text-primario-texto" aria-hidden="true" />
          Compara contra la última versión publicada por Stellar
        </li>
        <li className="flex items-center justify-center gap-2">
          <Lock size={16} className="text-primario-texto" aria-hidden="true" />
          Sin llaves ni fondos
        </li>
      </motion.ul>
    </section>
  )
}
